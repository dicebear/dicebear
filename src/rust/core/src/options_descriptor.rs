//! Builds a descriptor of every option a given style accepts.
//!
//! Tooling such as the editor uses the result to render form controls and
//! validation hints without having to introspect the style itself.

use std::collections::BTreeSet;

use serde_json::{json, Map, Value};

use crate::options::{COLOR_ORDER_FIXED, COLOR_ORDER_RANDOM};
use crate::style::Style;

pub struct OptionsDescriptor<'a> {
    style: &'a Style,
}

impl<'a> OptionsDescriptor<'a> {
    pub fn new(style: &'a Style) -> Self {
        Self { style }
    }

    /// Builds and returns the descriptor: a map of option name → field metadata.
    pub fn to_json(&self) -> Value {
        let mut result = Map::new();

        result.insert("seed".into(), json!({ "type": "string" }));
        result.insert(
            "size".into(),
            json!({ "type": "number", "min": 1, "max": 4096 }),
        );
        result.insert("idRandomization".into(), json!({ "type": "boolean" }));
        result.insert("title".into(), json!({ "type": "string" }));
        result.insert(
            "flip".into(),
            json!({ "type": "enum", "values": ["none", "horizontal", "vertical", "both"], "list": true }),
        );
        result.insert(
            "fontFamily".into(),
            json!({ "type": "string", "list": true }),
        );
        result.insert(
            "fontWeight".into(),
            json!({ "type": "number", "min": 1, "max": 1000, "list": true }),
        );
        result.insert(
            "scale".into(),
            json!({ "type": "range", "min": 0, "max": 10 }),
        );
        result.insert(
            "borderRadius".into(),
            json!({ "type": "range", "min": 0, "max": 50 }),
        );
        result.insert("rotate".into(), rotate_range());
        result.insert("translateX".into(), translate_range());
        result.insert("translateY".into(), translate_range());

        let mut tags: BTreeSet<String> = BTreeSet::new();

        for (name, component) in self.style.components() {
            if component.is_alias() {
                continue;
            }

            let mut variants: Vec<&String> = component.variants().keys().collect();
            variants.sort();

            result.insert(
                format!("{name}Variant"),
                json!({ "type": "enum", "values": variants, "list": true, "weighted": true }),
            );
            result.insert(
                format!("{name}Probability"),
                json!({ "type": "number", "min": 0, "max": 100 }),
            );

            for variant in component.variants().values() {
                for tag in variant.tags() {
                    tags.insert(tag.clone());
                }
            }
        }

        let colors = self.style.colors();
        let color_names = colors
            .keys()
            .cloned()
            .chain(std::iter::once("background".to_string()));

        for name in color_names {
            let mut field = Map::new();
            field.insert("type".into(), json!("color"));
            field.insert("list".into(), json!(true));

            if let Some(contrast_to) = colors.get(&name).and_then(|c| c.contrast_to()) {
                field.insert("contrastTo".into(), json!(contrast_to));
            }

            result.insert(format!("{name}Color"), Value::Object(field));
            result.insert(
                format!("{name}ColorFill"),
                json!({ "type": "enum", "values": ["solid", "linear", "radial"], "list": true }),
            );
            result.insert(
                format!("{name}ColorFillStops"),
                json!({ "type": "range", "min": 2 }),
            );
            result.insert(format!("{name}ColorAngle"), rotate_range());
            result.insert(
                format!("{name}ColorOrder"),
                json!({ "type": "enum", "values": [COLOR_ORDER_RANDOM, COLOR_ORDER_FIXED] }),
            );
        }

        // Only advertise the `tags` filter when the style actually carries tags.
        // The values are the sorted union of every tag across the style's
        // variants, but `open` marks them as suggestions: the filter also
        // accepts `!` disallows and bare categories. Only an unknown category
        // is ignored. An unknown value inside a category the style does use
        // matches nothing, so every variant tagged on that axis is dropped.
        if !tags.is_empty() {
            let values: Vec<String> = tags.into_iter().collect();
            result.insert(
                "tags".into(),
                json!({ "type": "enum", "values": values, "list": true, "open": true }),
            );
        }

        Value::Object(result)
    }
}

fn rotate_range() -> Value {
    json!({ "type": "range", "min": -360, "max": 360 })
}

fn translate_range() -> Value {
    json!({ "type": "range", "min": -1000, "max": 1000 })
}
