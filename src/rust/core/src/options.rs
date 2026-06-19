//! Reads and normalizes the raw user-supplied options.
//!
//! Each accessor returns the user's input in a normalized form (always a list
//! for options that accept a scalar or a list, or `None` when unset), so the
//! [`crate::Resolver`] never has to normalize. Resolution against the style and
//! the PRNG happens there; this type is purely about reading input.

use std::collections::HashMap;

use serde_json::Value;

use crate::prng::Range;

/// A parsed `tags` filter token. [`Options::tags`] decodes each raw
/// `category` / `category:value` / `!…` string into this shape so the resolver
/// composes the filter without parsing the grammar itself.
pub(crate) struct TagFilterToken {
    pub category: String,
    pub value: Option<String>,
    pub negated: bool,
}

pub struct Options {
    data: Value,
}

impl Options {
    pub fn new(data: Value) -> Self {
        let data = if data.is_object() {
            data
        } else {
            Value::Object(serde_json::Map::new())
        };

        Self { data }
    }

    fn get(&self, key: &str) -> Option<&Value> {
        self.data.get(key).filter(|v| !v.is_null())
    }

    pub fn seed(&self) -> Option<String> {
        self.get("seed").and_then(Value::as_str).map(String::from)
    }

    pub fn size(&self) -> Option<f64> {
        self.get("size").and_then(Value::as_f64)
    }

    pub fn id_randomization(&self) -> Option<bool> {
        self.get("idRandomization").and_then(Value::as_bool)
    }

    pub fn title(&self) -> Option<String> {
        self.get("title").and_then(Value::as_str).map(String::from)
    }

    pub fn flip(&self) -> Vec<String> {
        as_string_array(self.get("flip"))
    }

    pub fn font_family(&self) -> Vec<String> {
        as_string_array(self.get("fontFamily"))
    }

    pub fn font_weight(&self) -> Vec<f64> {
        as_number_array(self.get("fontWeight"))
    }

    pub fn scale(&self) -> Option<Range> {
        to_range(self.get("scale"))
    }

    pub fn border_radius(&self) -> Option<Range> {
        to_range(self.get("borderRadius"))
    }

    pub fn rotate(&self) -> Option<Range> {
        to_range(self.get("rotate"))
    }

    pub fn translate_x(&self) -> Option<Range> {
        to_range(self.get("translateX"))
    }

    pub fn translate_y(&self) -> Option<Range> {
        to_range(self.get("translateY"))
    }

    /// Returns the global `tags` filter as parsed tokens, or an empty list when
    /// unset. Each raw token (`category` / `category:value`, optionally
    /// `!`-prefixed to exclude) is decoded into `{ category, value?, negated }`
    /// so the resolver composes the filter without parsing the grammar itself.
    /// An empty list means no tag filtering (classic behavior).
    pub(crate) fn tags(&self) -> Vec<TagFilterToken> {
        as_string_array(self.get("tags"))
            .into_iter()
            .map(|token| {
                let negated = token.starts_with('!');
                let body = if negated { &token[1..] } else { &token[..] };

                match body.find(':') {
                    None => TagFilterToken {
                        category: body.to_string(),
                        value: None,
                        negated,
                    },
                    Some(sep) => TagFilterToken {
                        category: body[..sep].to_string(),
                        value: Some(body[sep + 1..].to_string()),
                        negated,
                    },
                }
            })
            .collect()
    }

    /// Returns the `${name}Variant` constraint as a weighted map, or `None` when
    /// unset. A bare string or string list is normalized to weight `1` each.
    pub fn component_variant(&self, name: &str) -> Option<HashMap<String, f64>> {
        match self.get(&format!("{name}Variant"))? {
            Value::String(s) => Some(HashMap::from([(s.clone(), 1.0)])),
            Value::Array(a) => Some(
                a.iter()
                    .filter_map(Value::as_str)
                    .map(|s| (s.to_string(), 1.0))
                    .collect(),
            ),
            Value::Object(o) => Some(
                o.iter()
                    .filter_map(|(k, v)| v.as_f64().map(|w| (k.clone(), w)))
                    .collect(),
            ),
            _ => None,
        }
    }

    pub fn component_probability(&self, name: &str) -> Option<f64> {
        self.get(&format!("{name}Probability"))
            .and_then(Value::as_f64)
    }

    /// Returns `None` (rather than `[]`) when `${name}Color` is unset, so the
    /// resolver can fall back to the style definition's values.
    pub fn color(&self, name: &str) -> Option<Vec<String>> {
        self.get(&format!("{name}Color"))
            .map(|v| as_string_array(Some(v)))
    }

    pub fn color_fill(&self, name: &str) -> Vec<String> {
        as_string_array(self.get(&format!("{name}ColorFill")))
    }

    pub fn color_angle(&self, name: &str) -> Option<Range> {
        to_range(self.get(&format!("{name}ColorAngle")))
    }

    pub fn color_fill_stops(&self, name: &str) -> Option<Range> {
        to_range(self.get(&format!("{name}ColorFillStops")))
    }
}

/// Normalizes a scalar/array/absent string value into a list.
fn as_string_array(value: Option<&Value>) -> Vec<String> {
    match value {
        Some(Value::Array(a)) => a
            .iter()
            .filter_map(Value::as_str)
            .map(String::from)
            .collect(),
        Some(Value::String(s)) => vec![s.clone()],
        _ => Vec::new(),
    }
}

/// Normalizes a scalar/array/absent numeric value into a list.
fn as_number_array(value: Option<&Value>) -> Vec<f64> {
    match value {
        Some(Value::Array(a)) => a.iter().filter_map(Value::as_f64).collect(),
        Some(v) => v.as_f64().map(|n| vec![n]).unwrap_or_default(),
        None => Vec::new(),
    }
}

/// Normalizes a range option (bare number, `[n]`, `[min, max]`, or absent) into
/// a [`Range`]. A bare number becomes a fixed `min == max`; an empty array is
/// treated as unset. Matches the JS, PHP, Python, Go and Dart ports.
fn to_range(value: Option<&Value>) -> Option<Range> {
    match value {
        Some(Value::Number(n)) => {
            let x = n.as_f64()?;
            Some(Range {
                min: x,
                max: x,
                step: None,
            })
        }
        Some(Value::Array(a)) => {
            let nums: Vec<f64> = a.iter().filter_map(Value::as_f64).collect();
            if nums.is_empty() {
                return None;
            }
            let min = nums.iter().copied().fold(f64::INFINITY, f64::min);
            let max = nums.iter().copied().fold(f64::NEG_INFINITY, f64::max);
            Some(Range {
                min,
                max,
                step: None,
            })
        }
        _ => None,
    }
}
