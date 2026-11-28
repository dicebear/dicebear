//! Validation of a style definition: the depth check, `definition.json`, and
//! the cross-key checks the JSON Schema cannot express. The checks read the
//! parsed JSON value, before it is deserialized into the typed definition.

use std::collections::HashSet;

use indexmap::IndexMap;
use serde_json::{Map, Value};

use super::{check, collected, style_schema};
use crate::error::Error;

/// Validates a style definition against `definition.json`, then checks its
/// aliases, its component references for cycles, and its animation keyframe
/// order.
pub(crate) fn style(instance: &Value) -> Result<(), Error> {
    check(&style_schema::VALIDATOR, instance)?;

    let components = instance.get("components").and_then(Value::as_object);

    validate_aliases(components)?;
    validate_component_cycles(components)?;
    validate_animations(instance)
}

/// The component an entry of the `components` block aliases, or `None` for a
/// base component. An entry with an `extends` string is an alias.
fn alias_source(entry: &Value) -> Option<&str> {
    entry.get("extends").and_then(Value::as_str)
}

/// The array under `key` in `value`, or an empty slice when there is none.
fn array<'a>(value: &'a Value, key: &str) -> &'a [Value] {
    value
        .get(key)
        .and_then(Value::as_array)
        .map(Vec::as_slice)
        .unwrap_or(&[])
}

/// The variants of a base component entry, in definition order.
fn variants(entry: &Value) -> impl Iterator<Item = (&String, &Value)> {
    entry
        .get("variants")
        .and_then(Value::as_object)
        .into_iter()
        .flatten()
}

/// Verifies that every `extends` references an existing, non-alias component —
/// a cross-key constraint the JSON Schema cannot express.
fn validate_aliases(components: Option<&Map<String, Value>>) -> Result<(), Error> {
    let Some(components) = components else {
        return Ok(());
    };

    let mut errors: Vec<String> = Vec::new();

    for (name, entry) in components {
        let Some(extends) = alias_source(entry) else {
            continue;
        };

        match components.get(extends) {
            None => errors.push(format!(
                "/components/{name}/extends references unknown component \"{extends}\""
            )),
            Some(target) if alias_source(target).is_some() => errors.push(format!(
                "/components/{name}/extends references alias \"{extends}\" — alias chains are not allowed"
            )),
            Some(_) => {}
        }
    }

    collected(errors)
}

/// Verifies that no component renders itself, directly or through other
/// components. The renderer registers a variant's `<defs>` entry only after
/// its body has rendered, so a cycle would recurse until the stack runs out.
/// A reference to an alias counts as a reference to its source, since the
/// alias renders the source's variants. Unknown names render nothing and close
/// no cycle. Runs after `validate_aliases`, so every alias points at a base
/// component here.
fn validate_component_cycles(components: Option<&Map<String, Value>>) -> Result<(), Error> {
    struct Reference<'a> {
        name: &'a str,
        source: &'a str,
        path: String,
    }

    fn collect<'a>(
        components: &'a Map<String, Value>,
        elements: &'a [Value],
        path: &str,
        found: &mut Vec<Reference<'a>>,
    ) {
        for (index, element) in elements.iter().enumerate() {
            let element_path = format!("{path}/{index}");

            if element.get("type").and_then(Value::as_str) == Some("component") {
                if let Some(name) = element.get("name").and_then(Value::as_str) {
                    let source = components
                        .get_key_value(name)
                        .map(|(key, entry)| alias_source(entry).unwrap_or(key.as_str()));

                    if let Some(source) = source {
                        found.push(Reference {
                            name,
                            source,
                            path: element_path.clone(),
                        });
                    }
                }
            }

            collect(
                components,
                array(element, "children"),
                &format!("{element_path}/children"),
                found,
            );
        }
    }

    // Depth-first search: a reference to a component that is still on the
    // stack closes a cycle. The depth is bounded by the number of components.
    fn visit<'a>(
        name: &'a str,
        references: &IndexMap<&'a str, Vec<Reference<'a>>>,
        on_stack: &mut HashSet<&'a str>,
        done: &mut HashSet<&'a str>,
        errors: &mut Vec<String>,
    ) {
        on_stack.insert(name);

        for reference in references.get(name).map(Vec::as_slice).unwrap_or(&[]) {
            if on_stack.contains(reference.source) {
                errors.push(format!(
                    "{} references component \"{}\", which leads back to \"{}\" — component cycles are not allowed",
                    reference.path, reference.name, reference.source
                ));
            } else if !done.contains(reference.source) {
                visit(reference.source, references, on_stack, done, errors);
            }
        }

        on_stack.remove(name);
        done.insert(name);
    }

    let Some(components) = components else {
        return Ok(());
    };

    let mut references: IndexMap<&str, Vec<Reference>> = IndexMap::new();

    for (name, component) in components {
        if alias_source(component).is_some() {
            continue;
        }

        let mut found = Vec::new();

        for (variant_name, variant) in variants(component) {
            collect(
                components,
                array(variant, "elements"),
                &format!("/components/{name}/variants/{variant_name}/elements"),
                &mut found,
            );
        }

        references.insert(name.as_str(), found);
    }

    let mut on_stack = HashSet::new();
    let mut done = HashSet::new();
    let mut errors: Vec<String> = Vec::new();

    for name in references.keys() {
        if !done.contains(name) {
            visit(name, &references, &mut on_stack, &mut done, &mut errors);
        }
    }

    collected(errors)
}

/// Verifies that every animation track lists its keyframes in strictly
/// ascending `at` order — an ordering between array items the JSON Schema
/// cannot express. Step jumps are expressed with the `hold` easing rather
/// than duplicate positions.
fn validate_animations(definition: &Value) -> Result<(), Error> {
    let mut errors: Vec<String> = Vec::new();

    visit_elements(definition, &mut |element, path| {
        for (animation_index, animation) in array(element, "animations").iter().enumerate() {
            let tracks = animation.get("tracks").and_then(Value::as_object);

            for (track_name, track) in tracks.into_iter().flatten() {
                let at: Vec<Option<f64>> = array(track, "keyframes")
                    .iter()
                    .map(|keyframe| keyframe.get("at").and_then(Value::as_f64))
                    .collect();

                for i in 1..at.len() {
                    if let (Some(current), Some(previous)) = (at[i], at[i - 1]) {
                        if current <= previous {
                            errors.push(format!(
                                "{path}/animations/{animation_index}/tracks/{track_name}/keyframes/{i}/at must be greater than the previous keyframe"
                            ));
                        }
                    }
                }
            }
        }
    });

    collected(errors)
}

/// Walks every element in the definition — the canvas tree and every non-alias
/// component variant tree — and invokes `visit` with the element and its JSON
/// pointer path.
fn visit_elements(definition: &Value, visit: &mut dyn FnMut(&Value, &str)) {
    fn walk(elements: &[Value], path: &str, visit: &mut dyn FnMut(&Value, &str)) {
        for (index, element) in elements.iter().enumerate() {
            let element_path = format!("{path}/{index}");

            visit(element, &element_path);
            walk(
                array(element, "children"),
                &format!("{element_path}/children"),
                visit,
            );
        }
    }

    if let Some(canvas) = definition.get("canvas") {
        walk(array(canvas, "elements"), "/canvas/elements", visit);
    }

    let Some(components) = definition.get("components").and_then(Value::as_object) else {
        return;
    };

    for (name, component) in components {
        if alias_source(component).is_some() {
            continue;
        }

        for (variant_name, variant) in variants(component) {
            walk(
                array(variant, "elements"),
                &format!("/components/{name}/variants/{variant_name}/elements"),
                visit,
            );
        }
    }
}
