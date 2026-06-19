//! Derives every deterministic value for an avatar from the style, the user
//! options, and a seeded PRNG, exposing them as memoized named accessors.
//!
//! Like the other ports, every value the resolver picks is recorded in
//! a snapshot (`resolved`), which `Avatar::to_json` returns. The raw seed is
//! deliberately excluded. The PRNG is key-based and order-independent, so the
//! snapshot doubles as the only mutable state besides the `color_resolving`
//! stack that detects circular color references.

use std::cell::RefCell;
use std::collections::HashMap;

use serde_json::Value;

use crate::error::Error;
use crate::options::Options;
use crate::prng::{Prng, Range};
use crate::style::{Color, Component, Style};
use crate::utils::color;

pub struct Resolver<'a> {
    style: &'a Style,
    options: &'a Options,
    prng: Prng,
    color_resolving: RefCell<Vec<String>>,
    result: RefCell<serde_json::Map<String, Value>>,
}

impl<'a> Resolver<'a> {
    pub fn new(style: &'a Style, options: &'a Options) -> Self {
        let prng = Prng::new(options.seed().unwrap_or_default());

        Self {
            style,
            options,
            prng,
            color_resolving: RefCell::new(Vec::new()),
            result: RefCell::new(serde_json::Map::new()),
        }
    }

    pub fn seed(&self) -> String {
        // Deliberately not recorded — the seed is the one input kept out of the
        // resolved() snapshot, so a serialized avatar never leaks it.
        self.options.seed().unwrap_or_default()
    }

    pub fn size(&self) -> Option<f64> {
        let value = self.options.size();
        self.record("size", value.map_or(Value::Null, num_value));
        value
    }

    pub fn id_randomization(&self) -> bool {
        let value = self.options.id_randomization().unwrap_or(false);
        self.record("idRandomization", Value::from(value));
        value
    }

    pub fn title(&self) -> Option<String> {
        let value = self.options.title();
        self.record("title", value.clone().map_or(Value::Null, Value::from));
        value
    }

    pub fn flip(&self) -> String {
        let value = self
            .prng
            .pick("flip", &self.options.flip())
            .cloned()
            .unwrap_or_else(|| "none".to_string());
        self.record("flip", Value::from(value.clone()));
        value
    }

    pub fn font_family(&self) -> String {
        let value = self
            .prng
            .pick("fontFamily", &self.options.font_family())
            .cloned()
            .unwrap_or_else(|| "system-ui".to_string());
        self.record("fontFamily", Value::from(value.clone()));
        value
    }

    pub fn font_weight(&self) -> f64 {
        let value = self
            .prng
            .pick("fontWeight", &self.options.font_weight())
            .copied()
            .unwrap_or(400.0);
        self.record("fontWeight", num_value(value));
        value
    }

    pub fn scale(&self) -> f64 {
        self.float("scale", self.options.scale(), 1.0)
    }

    pub fn border_radius(&self) -> f64 {
        self.float("borderRadius", self.options.border_radius(), 0.0)
    }

    pub fn rotate(&self) -> f64 {
        self.float("rotate", self.options.rotate(), 0.0)
    }

    pub fn translate_x(&self) -> f64 {
        self.float("translateX", self.options.translate_x(), 0.0)
    }

    pub fn translate_y(&self) -> f64 {
        self.float("translateY", self.options.translate_y(), 0.0)
    }

    /// Selects a variant for the given component, or `None` when the component
    /// is unknown or rolled invisible.
    pub fn variant(&self, name: &str) -> Option<String> {
        let value = self.resolve_variant(name);
        self.record(
            &format!("{name}Variant"),
            value.clone().map_or(Value::Null, Value::from),
        );
        value
    }

    fn resolve_variant(&self, name: &str) -> Option<String> {
        let component = self.style.components().get(name)?;

        if !self.is_visible(name, component) {
            return None;
        }

        let weights = self.variant_weights(component);

        self.prng.weighted_pick(&format!("{name}Variant"), &weights)
    }

    /// Builds the name -> weight map the PRNG draws a variant from. The
    /// per-component `${name}Variant` option is more specific than the global
    /// `tags` filter, so it takes precedence: when set, it fully governs the
    /// component's pool (its named variants, weighted by the option) and the
    /// tags filter is ignored for that component. The tags filter applies only
    /// where the user gave no explicit `${name}Variant` (see
    /// [`Self::tag_filtered_names`]), and falls back to every variant when
    /// neither is set. Names the style does not define are dropped, and an empty
    /// `${name}Variant` (or an empty tag result) yields no variant.
    fn variant_weights(&self, component: &Component) -> HashMap<String, f64> {
        let variants = component.variants();
        let named = self.options.component_variant(component.source_name());
        let mut weights: HashMap<String, f64> = HashMap::new();

        match named {
            Some(named) => {
                for (v, w) in named {
                    if variants.contains_key(&v) {
                        weights.insert(v, w);
                    }
                }
            }
            None if !self.options.tags().is_empty() => {
                for name in self.tag_filtered_names(component) {
                    if let Some(variant) = variants.get(&name) {
                        weights.insert(name, variant.weight());
                    }
                }
            }
            None => {
                for (v, variant) in variants {
                    weights.insert(v.clone(), variant.weight());
                }
            }
        }

        weights
    }

    /// Narrows a component's variants to the names satisfying the global `tags`
    /// filter, applying the parsed [`Options::tags`] tokens in one pass over the
    /// pool:
    ///
    /// - A positive `cat:value` token is an axis-scoped include. Within each
    ///   category some include mentions, a variant is kept only if it carries no
    ///   tag in that category (untouched) or matches one of the included values
    ///   (OR within the category). Distinct included categories combine with
    ///   AND, and a category no include mentions is left unconstrained. A bare
    ///   positive `cat` token carries no value, so it imposes no constraint.
    /// - A negative `!cat`/`!cat:value` token excludes, dropping every variant
    ///   carrying any tag in `cat` (bare) or the exact `cat:value` tag. Excludes
    ///   are checked alongside includes but always win.
    ///
    /// Returns the surviving variant names in definition order.
    fn tag_filtered_names(&self, component: &Component) -> Vec<String> {
        // Insertion-ordered include groups: category -> included values.
        let mut include_categories: Vec<String> = Vec::new();
        let mut includes: HashMap<String, Vec<String>> = HashMap::new();
        let mut excludes: Vec<(String, Option<String>)> = Vec::new();

        for token in self.options.tags() {
            if token.negated {
                excludes.push((token.category, token.value));
            } else if let Some(value) = token.value {
                includes
                    .entry(token.category.clone())
                    .or_insert_with(|| {
                        include_categories.push(token.category.clone());
                        Vec::new()
                    })
                    .push(value);
            }
        }

        let mut names: Vec<String> = Vec::new();

        for (name, variant) in component.variants() {
            let included = include_categories.iter().all(|category| {
                let values = &includes[category];
                !variant.has_tag(category, None)
                    || values
                        .iter()
                        .any(|value| variant.has_tag(category, Some(value)))
            });
            let excluded = excludes
                .iter()
                .any(|(category, value)| variant.has_tag(category, value.as_deref()));

            if included && !excluded {
                names.push(name.clone());
            }
        }

        names
    }

    pub fn color(&self, name: &str) -> Result<Vec<String>, Error> {
        let key = format!("{name}Color");

        // Memoize like the JS `#memo`: a color already resolved this pass is
        // returned from the snapshot instead of being recomputed. Without it, a
        // graph where each color references the next via both `contrastTo` and
        // `notEqualTo` re-resolves exponentially (a schema-valid DoS).
        if let Some(cached) = self.cached_color(&key) {
            return Ok(cached);
        }

        let value = self.resolve_color(name)?;
        self.record(&key, Value::from(value.clone()));
        Ok(value)
    }

    /// Reads an already-resolved color list back out of the snapshot, or `None`
    /// if this color has not been resolved yet this pass.
    fn cached_color(&self, key: &str) -> Option<Vec<String>> {
        self.result.borrow().get(key).map(|value| {
            value
                .as_array()
                .map(|items| {
                    items
                        .iter()
                        .filter_map(|item| item.as_str().map(str::to_string))
                        .collect()
                })
                .unwrap_or_default()
        })
    }

    pub fn color_fill(&self, name: &str) -> String {
        let value = self
            .prng
            .pick(&format!("{name}ColorFill"), &self.options.color_fill(name))
            .cloned()
            .unwrap_or_else(|| "solid".to_string());
        self.record(&format!("{name}ColorFill"), Value::from(value.clone()));
        value
    }

    pub fn color_angle(&self, name: &str) -> f64 {
        self.float(
            &format!("{name}ColorAngle"),
            self.options.color_angle(name),
            0.0,
        )
    }

    /// Returns `(rotate, translate_x, translate_y, scale)` for a component, each
    /// recorded as `{name}Rotate` / `{name}TranslateX` / … in the snapshot.
    pub fn component_transform(&self, name: &str) -> (f64, f64, f64, f64) {
        let component = self.style.components().get(name);

        (
            self.float(
                &format!("{name}Rotate"),
                component.and_then(Component::rotate),
                0.0,
            ),
            self.float(
                &format!("{name}TranslateX"),
                component.and_then(|c| c.translate().x()),
                0.0,
            ),
            self.float(
                &format!("{name}TranslateY"),
                component.and_then(|c| c.translate().y()),
                0.0,
            ),
            self.float(
                &format!("{name}Scale"),
                component.and_then(Component::scale),
                1.0,
            ),
        )
    }

    /// An informational snapshot of every value the resolver picked. Unset
    /// (`null`) entries are filtered out; the raw seed is excluded.
    pub fn resolved(&self) -> Value {
        let map: serde_json::Map<String, Value> = self
            .result
            .borrow()
            .iter()
            .filter(|(_, value)| !value.is_null())
            .map(|(key, value)| (key.clone(), value.clone()))
            .collect();

        Value::Object(map)
    }

    fn probability(&self, component: &Component) -> f64 {
        self.options
            .component_probability(component.source_name())
            .unwrap_or(component.probability())
    }

    fn is_visible(&self, name: &str, component: &Component) -> bool {
        self.prng
            .bool(&format!("{name}Probability"), self.probability(component))
    }

    fn resolve_color(&self, name: &str) -> Result<Vec<String>, Error> {
        let style_color = self.style.colors().get(name);
        let source: Vec<String> = self
            .options
            .color(name)
            .or_else(|| style_color.map(|c| c.values().to_vec()))
            .unwrap_or_default();

        let mut candidates: Vec<String> = source.iter().map(|c| color::to_hex(c)).collect();
        let fill = self.color_fill(name);
        let stops = if fill == "solid" {
            1
        } else {
            self.color_fill_stops(name)
        };

        let Some(style_color) = style_color else {
            let shuffled = self.prng.shuffle(&format!("{name}Color"), &candidates);
            return Ok(shuffled.into_iter().take(stops).collect());
        };

        if self.color_resolving.borrow().iter().any(|n| n == name) {
            let mut chain = self.color_resolving.borrow().clone();
            chain.push(name.to_string());
            return Err(Error::CircularColorReference(chain));
        }

        self.color_resolving.borrow_mut().push(name.to_string());
        // Apply constraints, then always pop the stack (even on error).
        let outcome = self.apply_color_constraints(style_color, &mut candidates);
        self.color_resolving.borrow_mut().pop();
        outcome?;

        // Skip the shuffle when sorted by contrast, to preserve that ordering.
        let ordered = if style_color.contrast_to().is_some() {
            candidates
        } else {
            self.prng.shuffle(&format!("{name}Color"), &candidates)
        };

        Ok(ordered.into_iter().take(stops).collect())
    }

    fn apply_color_constraints(
        &self,
        style_color: &Color,
        candidates: &mut Vec<String>,
    ) -> Result<(), Error> {
        if let Some(reference) = style_color.contrast_to() {
            if let Some(ref_color) = self.color(reference)?.into_iter().next() {
                *candidates = color::sort_by_contrast(candidates, &ref_color);
            }
        }

        if !style_color.not_equal_to().is_empty() {
            let mut excluded: Vec<String> = Vec::new();
            for reference in style_color.not_equal_to() {
                excluded.extend(self.color(reference)?);
            }
            *candidates = color::filter_not_equal_to(candidates, &excluded);
        }

        Ok(())
    }

    fn color_fill_stops(&self, name: &str) -> usize {
        match self.options.color_fill_stops(name) {
            Some(range) => self
                .prng
                .integer(&format!("{name}ColorFillStops"), &range)
                .max(0) as usize,
            None => 2,
        }
    }

    fn float(&self, key: &str, range: Option<Range>, fallback: f64) -> f64 {
        let value = match range {
            Some(range) => self.prng.float(key, &range),
            None => fallback,
        };
        self.record(key, num_value(value));
        value
    }

    fn record(&self, key: &str, value: Value) {
        let mut result = self.result.borrow_mut();
        if !result.contains_key(key) {
            result.insert(key.to_string(), value);
        }
    }
}

/// Serializes a numeric pick the way the JS port does: a whole number becomes a
/// JSON integer (`256`), not a float (`256.0`), so `Avatar::to_json` matches the
/// other ports byte-for-byte. Fractional and out-of-range values stay `f64`.
fn num_value(value: f64) -> Value {
    if value.fract() == 0.0 && value.abs() < 9_007_199_254_740_992.0 {
        Value::from(value as i64)
    } else {
        Value::from(value)
    }
}
