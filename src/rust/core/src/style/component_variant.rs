//! Read-only view over an entry in a component's `variants` block.

use serde::Deserialize;

use super::element::Element;

#[derive(Deserialize)]
pub(crate) struct ComponentVariant {
    elements: Vec<Element>,
    weight: Option<f64>,
    #[serde(default)]
    tags: Vec<String>,
}

impl ComponentVariant {
    pub(crate) fn elements(&self) -> &[Element] {
        &self.elements
    }

    /// The weighted-pick weight, defaulting to `1`.
    pub(crate) fn weight(&self) -> f64 {
        self.weight.unwrap_or(1.0)
    }

    /// The variant's descriptive tags (e.g. `hairLength:long`), or an empty
    /// slice when none are authored. Consumed by the `tags` render option to
    /// filter the variant pool.
    pub(crate) fn tags(&self) -> &[String] {
        &self.tags
    }

    /// Tests this variant against a single tag-filter token's grammar. With no
    /// `value`, it matches a whole category: the bare `category` tag or any
    /// `category:value` tag. With a `value`, it matches only the exact
    /// `category:value` tag.
    pub(crate) fn has_tag(&self, category: &str, value: Option<&str>) -> bool {
        match value {
            None => {
                let prefix = format!("{category}:");
                self.tags
                    .iter()
                    .any(|tag| tag == category || tag.starts_with(&prefix))
            }
            Some(value) => {
                let needle = format!("{category}:{value}");
                self.tags.iter().any(|tag| tag == &needle)
            }
        }
    }
}
