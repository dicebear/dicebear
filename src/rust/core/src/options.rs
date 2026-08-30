//! Reads and normalizes the raw user-supplied options.
//!
//! Each accessor returns the user's input in a normalized form (always a list
//! for options that accept a scalar or a list, or `None` when unset), so the
//! [`crate::Resolver`] never has to normalize. Resolution against the style and
//! the PRNG happens there; this type is purely about reading input.

use std::cell::OnceCell;
use std::collections::HashMap;

use serde_json::Value;

use crate::prng::Range;

/// The two values of the per-color `${name}ColorOrder` option.
pub(crate) const COLOR_ORDER_RANDOM: &str = "random";
pub(crate) const COLOR_ORDER_FIXED: &str = "fixed";

/// A parsed `tags` filter token. [`Options::tags`] decodes each raw
/// `category` / `category:value` / `!…` string into this shape so the resolver
/// composes the filter without parsing the grammar itself.
pub(crate) struct TagFilterToken {
    pub category: String,
    pub value: Option<String>,
    pub negated: bool,
}

/// The interpreted `animation` option: a boolean switch, or a selection of
/// timeline names in user order (a bare name is normalized to a one-element
/// list). Keeps the raw shape so the resolved-options snapshot serializes the
/// user's input, while consumers work with the accessors.
#[derive(Clone)]
pub(crate) enum AnimationSelection {
    Flag(bool),
    Names(Vec<String>),
}

impl AnimationSelection {
    /// Whether no timeline plays at all.
    pub(crate) fn off(&self) -> bool {
        match self {
            Self::Flag(flag) => !flag,
            Self::Names(names) => names.is_empty(),
        }
    }

    /// Whether a timeline carrying the given name plays. `true` plays every
    /// timeline; a name selection plays only named timelines carrying one of
    /// the selected names.
    pub(crate) fn matches(&self, name: Option<&str>) -> bool {
        match self {
            Self::Flag(flag) => *flag,
            Self::Names(names) => {
                name.is_some_and(|name| names.iter().any(|candidate| candidate == name))
            }
        }
    }

    /// The selected names in user order, or `None` for the boolean forms.
    /// Consumed by the animation class namespace hash.
    pub(crate) fn names(&self) -> Option<&[String]> {
        match self {
            Self::Flag(_) => None,
            Self::Names(names) => Some(names),
        }
    }

    /// The raw option value for the resolved-options snapshot: the boolean as
    /// given, or the name list in user order as a JSON array.
    pub(crate) fn to_value(&self) -> Value {
        match self {
            Self::Flag(flag) => Value::from(*flag),
            Self::Names(names) => Value::from(names.clone()),
        }
    }
}

pub struct Options {
    data: Value,
    tags: OnceCell<Vec<TagFilterToken>>,
}

impl Options {
    pub fn new(data: Value) -> Self {
        let data = if data.is_object() {
            data
        } else {
            Value::Object(serde_json::Map::new())
        };

        Self {
            data,
            tags: OnceCell::new(),
        }
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

    /// Returns the animation switch as given for booleans, or a name
    /// selection normalized to a list (a bare name becomes a one-element
    /// list). `None` when unset.
    pub(crate) fn animation(&self) -> Option<AnimationSelection> {
        match self.get("animation")? {
            Value::Bool(flag) => Some(AnimationSelection::Flag(*flag)),
            value => Some(AnimationSelection::Names(as_string_array(Some(value)))),
        }
    }

    pub fn animation_speed(&self) -> Option<Range> {
        to_range(self.get("animationSpeed"))
    }

    /// Returns the global `tags` filter as parsed tokens, or an empty list when
    /// unset. Each raw token (`category` / `category:value`, optionally
    /// `!`-prefixed to disallow) is decoded into `{ category, value?, negated }`
    /// so the resolver composes the filter without parsing the grammar itself.
    /// An empty list means no tag filtering (classic behavior). Memoized, since
    /// the resolver reads it once per component.
    pub(crate) fn tags(&self) -> &[TagFilterToken] {
        self.tags.get_or_init(|| {
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
        })
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

    pub fn color_order(&self, name: &str) -> Option<String> {
        self.get(&format!("{name}ColorOrder"))
            .and_then(Value::as_str)
            .map(String::from)
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
/// treated as unset. Matches every other port.
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

#[cfg(test)]
mod tests {
    use serde_json::json;

    use super::Options;

    #[test]
    fn color_order_returns_none_when_unset() {
        assert_eq!(Options::new(json!({})).color_order("skin"), None);
    }

    #[test]
    fn color_order_passes_the_value_through() {
        let options = Options::new(json!({ "skinColorOrder": "fixed" }));

        assert_eq!(options.color_order("skin").as_deref(), Some("fixed"));
    }
}
