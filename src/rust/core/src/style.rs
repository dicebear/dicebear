//! Validated, decomposed wrapper around a style definition.
//!
//! The per-concept views (canvas, element, component, color, meta) live in the
//! `style/` submodules, mirroring the original's `Style/` directory.

mod canvas;
mod color;
mod component;
mod component_translate;
mod component_variant;
mod element;
mod meta;
mod meta_creator;
mod meta_license;
mod meta_source;

pub(crate) use canvas::Canvas;
pub(crate) use color::Color;
pub(crate) use component::Component;
pub(crate) use element::{Animation, AnimationKeyframe, DynValue, Easing, Element};
pub(crate) use meta::Meta;

use std::collections::BTreeSet;

use indexmap::IndexMap;
use serde::Deserialize;
use serde_json::Value;

use crate::error::Error;
use crate::validate;
use component::RawComponent;

/// The raw, deserialized style definition.
#[derive(Deserialize)]
struct Definition {
    #[serde(rename = "$id")]
    id: Option<String>,
    #[serde(rename = "$schema")]
    schema: Option<String>,
    #[serde(rename = "$comment")]
    comment: Option<String>,
    meta: Option<Meta>,
    attributes: Option<IndexMap<String, DynValue>>,
    canvas: Canvas,
    components: Option<IndexMap<String, RawComponent>>,
    colors: Option<IndexMap<String, Color>>,
}

/// A parsed, validated style definition with its component aliases flattened.
pub struct Style {
    id: Option<String>,
    schema: Option<String>,
    comment: Option<String>,
    meta: Option<Meta>,
    attributes: Option<IndexMap<String, DynValue>>,
    canvas: Canvas,
    components: IndexMap<String, Component>,
    colors: IndexMap<String, Color>,
    has_animations: bool,
    animation_names: Vec<String>,
}

impl Style {
    /// Parses and validates a style definition from a JSON string.
    #[allow(clippy::should_implement_trait)]
    pub fn from_str(json: &str) -> Result<Self, Error> {
        Self::from_value(serde_json::from_str(json)?)
    }

    /// Validates and builds a style from an already-parsed JSON value.
    pub fn from_value(value: Value) -> Result<Self, Error> {
        validate::style(&value)?;

        let def: Definition = serde_json::from_value(value)?;

        let has_animations = has_animations(&def);
        let animation_names = animation_names(&def);

        Ok(Self {
            id: def.id,
            schema: def.schema,
            comment: def.comment,
            meta: def.meta,
            attributes: def.attributes,
            canvas: def.canvas,
            components: component::build(def.components),
            colors: def.colors.unwrap_or_default(),
            has_animations,
            animation_names,
        })
    }

    /// Returns the definition's `$id`, or `None` when not set.
    pub fn id(&self) -> Option<&str> {
        self.id.as_deref()
    }

    /// Returns the definition's `$schema` URI, or `None` when not set.
    pub fn schema(&self) -> Option<&str> {
        self.schema.as_deref()
    }

    /// Returns the definition's `$comment`, or `None` when not set.
    pub fn comment(&self) -> Option<&str> {
        self.comment.as_deref()
    }

    pub(crate) fn canvas(&self) -> &Canvas {
        &self.canvas
    }

    pub(crate) fn root_attributes(&self) -> Option<&IndexMap<String, DynValue>> {
        self.attributes.as_ref()
    }

    pub(crate) fn meta(&self) -> Option<&Meta> {
        self.meta.as_ref()
    }

    pub(crate) fn components(&self) -> &IndexMap<String, Component> {
        &self.components
    }

    pub(crate) fn colors(&self) -> &IndexMap<String, Color> {
        &self.colors
    }

    /// Whether any element in the definition carries declarative animations.
    /// Computed at construction. Consumed by the options descriptor to
    /// advertise the `animation` options only where they have an effect.
    pub(crate) fn has_animations(&self) -> bool {
        self.has_animations
    }

    /// The sorted distinct names of the definition's animation timelines.
    /// Computed at construction. Consumed by the options descriptor, which
    /// advertises a switch, a speed, and a delay field per name, and by the
    /// animation hash. Sorted so every implementation reports the same order
    /// regardless of how it walks the definition.
    pub(crate) fn animation_names(&self) -> &[String] {
        &self.animation_names
    }
}

/// Whether any element in the definition carries declarative animations.
fn has_animations(def: &Definition) -> bool {
    let mut found = false;

    visit_elements(def, &mut |element, _| {
        if !element.animations().is_empty() {
            found = true;
        }
    });

    found
}

/// The sorted distinct names across the definition's animation timelines.
fn animation_names(def: &Definition) -> Vec<String> {
    let mut names: BTreeSet<String> = BTreeSet::new();

    visit_elements(def, &mut |element, _| {
        for animation in element.animations() {
            if let Some(name) = animation.name() {
                names.insert(name.to_string());
            }
        }
    });

    names.into_iter().collect()
}

/// Walks every element in the definition — the canvas tree and every non-alias
/// component variant tree — and invokes `visit` with the element and its JSON
/// pointer path.
fn visit_elements(def: &Definition, visit: &mut dyn FnMut(&Element, &str)) {
    fn walk(elements: &[Element], path: &str, visit: &mut dyn FnMut(&Element, &str)) {
        for (index, element) in elements.iter().enumerate() {
            let element_path = format!("{path}/{index}");

            visit(element, &element_path);
            walk(
                element.children(),
                &format!("{element_path}/children"),
                visit,
            );
        }
    }

    walk(def.canvas.elements(), "/canvas/elements", visit);

    let Some(components) = def.components.as_ref() else {
        return;
    };

    for (name, component) in components {
        let RawComponent::Base(data) = component else {
            continue;
        };

        for (variant_name, variant) in data.variants() {
            walk(
                variant.elements(),
                &format!("/components/{name}/variants/{variant_name}/elements"),
                visit,
            );
        }
    }
}
