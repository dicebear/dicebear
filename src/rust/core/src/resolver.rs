//! Derives every deterministic value for an avatar from the style, the user
//! options, and a seeded PRNG, exposing them as memoized named accessors.
//!
//! Like the other ports, every value the resolver picks is recorded in
//! a snapshot (`resolved`), which `Avatar::to_json` returns. The raw seed is
//! deliberately excluded. The PRNG is key-based and order-independent, so the
//! snapshot doubles as the only mutable state besides the `color_resolving`
//! stack that detects circular color references.

use std::cell::{OnceCell, RefCell};
use std::collections::{HashMap, HashSet};

use serde_json::Value;

use crate::error::Error;
use crate::options::{Options, COLOR_ORDER_FIXED, COLOR_ORDER_RANDOM};
use crate::prng::{cmp_utf16, unique_by_code_point, Prng, Range};
use crate::style::{Color, Component, Style};
use crate::utils::color;

/// The `tags` filter tokens grouped by role, as [`Resolver`] composes them.
/// Every field borrows from the memoized [`Options::tags`]. `bare_disallows` is
/// the subset of `disallows` carrying no value, kept as a lookup set for the
/// per-component narrowing.
struct TagFilter<'a> {
    allow_categories: Vec<&'a str>,
    allows: HashMap<&'a str, Vec<&'a str>>,
    bares: Vec<&'a str>,
    disallows: Vec<(&'a str, Option<&'a str>)>,
    bare_disallows: HashSet<&'a str>,
}

pub struct Resolver<'a> {
    style: &'a Style,
    options: &'a Options,
    prng: Prng,
    color_resolving: RefCell<Vec<String>>,
    result: RefCell<serde_json::Map<String, Value>>,
    tags: OnceCell<TagFilter<'a>>,
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
            tags: OnceCell::new(),
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

    pub fn animation(&self) -> bool {
        // Deliberately without PRNG involvement: whether an avatar animates
        // must not depend on the seed.
        let value = self.options.animation().unwrap_or(false);
        self.record("animation", Value::from(value));
        value
    }

    /// Whether one timeline plays. A named timeline follows its
    /// `${name}Animation` switch when the user set one, recorded under that
    /// key, and the global `animation` switch otherwise. Unnamed timelines
    /// always follow the global switch. No PRNG is involved.
    pub fn animation_plays(&self, name: Option<&str>) -> bool {
        let named = name.and_then(|name| self.options.animation_for(name).map(|flag| (name, flag)));

        match named {
            Some((name, flag)) => {
                self.record(&format!("{name}Animation"), Value::from(flag));
                flag
            }
            None => self.animation(),
        }
    }

    pub fn animation_speed(&self) -> f64 {
        self.float("animationSpeed", self.options.animation_speed(), 1.0)
    }

    /// Returns the speed factor of one timeline. A named timeline plays at
    /// its `${name}AnimationSpeed` option when the user set one, drawn under
    /// that key, and at the global factor otherwise. Unnamed timelines always
    /// follow the global factor. The option is drawn only when asked for, so
    /// a static render leaves nothing in the resolved snapshot.
    pub fn animation_speed_for(&self, name: Option<&str>) -> f64 {
        let named = name.and_then(|name| {
            self.options
                .animation_speed_for(name)
                .map(|range| (name, range))
        });

        match named {
            Some((name, range)) => self.float(&format!("{name}AnimationSpeed"), Some(range), 1.0),
            None => self.animation_speed(),
        }
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

    /// Classifies the parsed [`Options::tags`] tokens into the allow groups,
    /// bare requirements and disallows the filter is composed from. The result
    /// depends only on the options, never on a component, so it is computed
    /// once per avatar rather than rebuilt for each of a style's components.
    /// The tokens are borrowed from the memoized [`Options::tags`], so the
    /// classification itself allocates no strings.
    fn tag_filter(&self) -> &TagFilter<'a> {
        self.tags.get_or_init(|| {
            // Insertion-ordered allow groups: category -> allowed values.
            let mut allow_categories: Vec<&'a str> = Vec::new();
            let mut allows: HashMap<&'a str, Vec<&'a str>> = HashMap::new();
            let mut bares: Vec<&'a str> = Vec::new();
            let mut disallows: Vec<(&'a str, Option<&'a str>)> = Vec::new();
            let mut bare_disallows: HashSet<&'a str> = HashSet::new();

            for token in self.options.tags() {
                let category = token.category.as_str();

                if token.negated {
                    disallows.push((category, token.value.as_deref()));

                    if token.value.is_none() {
                        bare_disallows.insert(category);
                    }
                } else if let Some(value) = token.value.as_deref() {
                    allows
                        .entry(category)
                        .or_insert_with(|| {
                            allow_categories.push(category);
                            Vec::new()
                        })
                        .push(value);
                } else if !bares.contains(&category) {
                    bares.push(category);
                }
            }

            TagFilter {
                allow_categories,
                allows,
                bares,
                disallows,
                bare_disallows,
            }
        })
    }

    /// Narrows a component's variants to the names satisfying the global `tags`
    /// filter, applying the parsed [`Options::tags`] tokens in one pass over the
    /// pool:
    ///
    /// - A positive `cat:value` token is an axis-scoped allow. Within each
    ///   category some allow mentions, a variant is kept only if it carries no
    ///   tag in that category (untouched) or matches one of the allowed values
    ///   (OR within the category). Distinct allowed categories combine with
    ///   AND, and a category no allow mentions is left unconstrained.
    /// - A bare positive `cat` token requires the category: it drops variants
    ///   that carry no tag in `cat`. It only binds where the category is in
    ///   use — a component with no `cat` tag on any variant is left untouched,
    ///   so `animation` turns on a style's opt-in animation without erasing
    ///   the components that know nothing about it.
    /// - A negative `!cat`/`!cat:value` token disallows, dropping every variant
    ///   carrying any tag in `cat` (bare) or the exact `cat:value` tag. Disallows
    ///   are checked alongside allows but always win.
    ///
    /// Returns the surviving variant names in definition order.
    fn tag_filtered_names(&self, component: &Component) -> Vec<String> {
        let TagFilter {
            allow_categories,
            allows,
            bares,
            disallows,
            bare_disallows,
        } = self.tag_filter();

        // A bare token only binds where its category is in use, so this
        // narrowing — unlike the classification — is genuinely per-component.
        let required: Vec<&str> = bares
            .iter()
            .copied()
            .filter(|category| {
                !bare_disallows.contains(category)
                    && component
                        .variants()
                        .values()
                        .any(|variant| variant.has_tag(category, None))
            })
            .collect();

        let mut names: Vec<String> = Vec::new();

        for (name, variant) in component.variants() {
            let allowed = allow_categories.iter().all(|category| {
                let values = &allows[category];
                !variant.has_tag(category, None)
                    || values
                        .iter()
                        .any(|value| variant.has_tag(category, Some(value)))
            }) && required
                .iter()
                .all(|category| variant.has_tag(category, None));
            let disallowed = disallows
                .iter()
                .any(|(category, value)| variant.has_tag(category, *value));

            if allowed && !disallowed {
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

    pub fn color_order(&self, name: &str) -> String {
        // Deliberately not recorded: unlike colorFill this is no PRNG pick, so
        // it stays out of the resolved() snapshot.
        self.options
            .color_order(name)
            .unwrap_or_else(|| COLOR_ORDER_RANDOM.to_string())
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

    /// Resolves a named color to its final stop list, applying contrast sorting
    /// and `notEqualTo` filtering from the style definition. Returns
    /// [`Error::CircularColorReference`] when colors reference each other in a
    /// cycle.
    ///
    /// A user-set `${name}ColorOrder: 'fixed'` pins user-supplied colors to
    /// their verbatim order: the shuffle and the contrast sort are skipped
    /// (`notEqualTo` filtering still applies), and the gradient stop count
    /// defaults to the number of supplied colors instead of 2. A style palette
    /// carries no order contract, so with `fixed` it is still deduplicated,
    /// code-point sorted, and contrast sorted; only the shuffle is skipped.
    fn resolve_color(&self, name: &str) -> Result<Vec<String>, Error> {
        let style_color = self.style.colors().get(name);
        let user_colors = self.options.color(name);
        let fixed = self.color_order(name) == COLOR_ORDER_FIXED;
        let verbatim = user_colors.is_some() && fixed;
        let source: Vec<String> = user_colors
            .or_else(|| style_color.map(|c| c.values().to_vec()))
            .unwrap_or_default();

        let mut candidates: Vec<String> = source.iter().map(|c| color::to_hex(c)).collect();
        let fill = self.color_fill(name);
        let stops = if fill == "solid" {
            1
        } else {
            self.color_fill_stops(name, if verbatim { candidates.len() } else { 2 })
        };

        let Some(style_color) = style_color else {
            let ordered = self.order(name, candidates, fixed, verbatim);
            return Ok(ordered.into_iter().take(stops).collect());
        };

        if self.color_resolving.borrow().iter().any(|n| n == name) {
            let mut chain = self.color_resolving.borrow().clone();
            chain.push(name.to_string());
            return Err(Error::CircularColorReference(chain));
        }

        self.color_resolving.borrow_mut().push(name.to_string());
        // Apply constraints, then always pop the stack (even on error).
        let outcome = self.apply_color_constraints(style_color, &mut candidates, verbatim);
        self.color_resolving.borrow_mut().pop();
        outcome?;

        // Skip the shuffle when sorted by contrast, to preserve that ordering.
        let ordered = if style_color.contrast_to().is_some() {
            candidates
        } else {
            self.order(name, candidates, fixed, verbatim)
        };

        Ok(ordered.into_iter().take(stops).collect())
    }

    fn apply_color_constraints(
        &self,
        style_color: &Color,
        candidates: &mut Vec<String>,
        verbatim: bool,
    ) -> Result<(), Error> {
        if let Some(reference) = style_color.contrast_to() {
            if !verbatim {
                if let Some(ref_color) = self.color(reference)?.into_iter().next() {
                    *candidates = color::sort_by_contrast(candidates, &ref_color);
                }
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

    /// Applies `${name}ColorOrder` to the candidate list. `random` shuffles via
    /// the PRNG. `fixed` skips the shuffle: user-supplied colors (`verbatim`)
    /// keep exactly the given order, while a style palette is still deduplicated
    /// and sorted by UTF-16 code units, matching the canonicalization the
    /// shuffle applies before drawing.
    fn order(
        &self,
        name: &str,
        candidates: Vec<String>,
        fixed: bool,
        verbatim: bool,
    ) -> Vec<String> {
        if !fixed {
            return self.prng.shuffle(&format!("{name}Color"), &candidates);
        }

        if verbatim {
            return candidates;
        }

        // Deprecated: DiceBear 11 will take the palette in its definition
        // order here, the same verbatim rule as user-supplied colors, and
        // drop this sort (see CHANGELOG.md, "Deprecated").
        let mut unique = unique_by_code_point(&candidates);
        unique.sort_by(|a, b| cmp_utf16(a.as_str(), b.as_str()));

        unique.into_iter().cloned().collect()
    }

    fn color_fill_stops(&self, name: &str, fallback: usize) -> usize {
        match self.options.color_fill_stops(name) {
            Some(range) => self
                .prng
                .integer(&format!("{name}ColorFillStops"), &range)
                .max(0) as usize,
            None => fallback,
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

#[cfg(test)]
mod tests {
    use serde_json::{json, Value};

    use super::Resolver;
    use crate::options::Options;
    use crate::style::Style;

    const MINIMAL_STYLE: &str = r#"{"canvas":{"width":100,"height":100,"elements":[]}}"#;

    /// Mirrors the JS test fixture: `hair.notEqualTo = skin` and
    /// `background.contrastTo = skin`.
    fn style_with_colors() -> Style {
        Style::from_str(
            r##"{
                "canvas": { "width": 100, "height": 100, "elements": [] },
                "colors": {
                    "skin": { "values": ["#f0c8a0", "#d4a574", "#8d5524"] },
                    "hair": { "values": ["#2c1b18", "#b55239", "#d6b370"], "notEqualTo": ["skin"] },
                    "background": { "values": ["#ffffff", "#000000", "#cccccc"], "contrastTo": "skin" }
                }
            }"##,
        )
        .unwrap()
    }

    fn resolve(style: &Style, options: Value, name: &str) -> Vec<String> {
        let options = Options::new(options);
        let resolver = Resolver::new(style, &options);

        resolver.color(name).unwrap()
    }

    #[test]
    fn color_order_defaults_to_random() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();
        let options = Options::new(json!({ "seed": "order-default" }));
        let resolver = Resolver::new(&style, &options);

        assert_eq!(resolver.color_order("skin"), "random");
    }

    #[test]
    fn fixed_order_keeps_the_given_order_for_gradient_fills() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();
        let colors = resolve(
            &style,
            json!({
                "seed": "order-fixed",
                "skinColor": ["#0055a4", "#ffffff", "#ef4135"],
                "skinColorFill": "linear",
                "skinColorOrder": "fixed",
            }),
            "skin",
        );

        assert_eq!(colors, vec!["#0055a4", "#ffffff", "#ef4135"]);
    }

    #[test]
    fn fixed_order_keeps_the_order_for_every_seed() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();

        for i in 0..20 {
            let colors = resolve(
                &style,
                json!({
                    "seed": format!("order-fixed-{i}"),
                    "skinColor": ["#0055a4", "#ffffff", "#ef4135"],
                    "skinColorFill": "linear",
                    "skinColorOrder": "fixed",
                }),
                "skin",
            );

            assert_eq!(colors, vec!["#0055a4", "#ffffff", "#ef4135"]);
        }
    }

    #[test]
    fn fixed_order_defaults_the_stop_count_to_the_number_of_colors() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();
        let colors = resolve(
            &style,
            json!({
                "seed": "order-stops",
                "skinColor": ["#ff0000", "#00ff00", "#0000ff", "#ffffff"],
                "skinColorFill": "linear",
                "skinColorOrder": "fixed",
            }),
            "skin",
        );

        assert_eq!(colors.len(), 4);
    }

    #[test]
    fn fixed_order_respects_an_explicit_stop_count() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();
        let colors = resolve(
            &style,
            json!({
                "seed": "order-explicit-stops",
                "skinColor": ["#0055a4", "#ffffff", "#ef4135"],
                "skinColorFill": "linear",
                "skinColorFillStops": 2,
                "skinColorOrder": "fixed",
            }),
            "skin",
        );

        assert_eq!(colors, vec!["#0055a4", "#ffffff"]);
    }

    #[test]
    fn fixed_order_always_uses_the_first_color_for_solid_fills() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();
        let colors = resolve(
            &style,
            json!({
                "seed": "order-solid",
                "skinColor": ["#ef4135", "#0055a4"],
                "skinColorOrder": "fixed",
            }),
            "skin",
        );

        assert_eq!(colors, vec!["#ef4135"]);
    }

    #[test]
    fn fixed_order_skips_contrast_sorting() {
        // background.contrastTo = skin: by default the strongest-contrast
        // candidate comes first, with a fixed order the user's first color wins.
        let style = style_with_colors();
        let options = json!({
            "seed": "order-contrast",
            "skinColor": "#000000",
            "backgroundColor": ["#111111", "#ffffff"],
        });

        let mut fixed = options.clone();
        fixed["backgroundColorOrder"] = json!("fixed");

        assert_eq!(resolve(&style, options, "background"), vec!["#ffffff"]);
        assert_eq!(resolve(&style, fixed, "background"), vec!["#111111"]);
    }

    #[test]
    fn fixed_order_still_applies_not_equal_to_filtering() {
        // hair.notEqualTo = skin
        let style = style_with_colors();
        let colors = resolve(
            &style,
            json!({
                "seed": "order-not-equal",
                "skinColor": "#2c1b18",
                "hairColor": ["#2c1b18", "#b55239", "#d6b370"],
                "hairColorFill": "linear",
                "hairColorOrder": "fixed",
            }),
            "hair",
        );

        assert_eq!(colors, vec!["#b55239", "#d6b370"]);
    }

    #[test]
    fn fixed_order_sorts_a_style_palette_instead_of_taking_it_verbatim() {
        // Without user-supplied colors, 'fixed' only skips the shuffle: the
        // style palette keeps the canonical code-point sort, for every seed.
        let style = style_with_colors();

        for i in 0..5 {
            let colors = resolve(
                &style,
                json!({
                    "seed": format!("order-style-{i}"),
                    "skinColorFill": "linear",
                    "skinColorFillStops": 3,
                    "skinColorOrder": "fixed",
                }),
                "skin",
            );

            assert_eq!(colors, vec!["#8d5524", "#d4a574", "#f0c8a0"]);
        }
    }

    #[test]
    fn fixed_order_keeps_contrast_sorting_for_a_style_palette() {
        // background.contrastTo = skin and no user-supplied background colors:
        // the strongest-contrast candidate still comes first.
        let style = style_with_colors();
        let colors = resolve(
            &style,
            json!({
                "seed": "order-style-contrast",
                "skinColor": "#000000",
                "backgroundColorOrder": "fixed",
            }),
            "background",
        );

        assert_eq!(colors, vec!["#ffffff"]);
    }

    #[test]
    fn fixed_order_keeps_the_default_of_two_stops_for_a_style_palette() {
        let style = style_with_colors();
        let colors = resolve(
            &style,
            json!({
                "seed": "order-style-stops",
                "skinColorFill": "linear",
                "skinColorOrder": "fixed",
            }),
            "skin",
        );

        assert_eq!(colors, vec!["#8d5524", "#d4a574"]);
    }

    #[test]
    fn animation_speed_lets_the_specific_option_win_over_the_global_one() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();
        let options = Options::new(json!({
            "animationSpeed": 0.5,
            "blinkAnimationSpeed": 2
        }));
        let resolver = Resolver::new(&style, &options);

        assert_eq!(resolver.animation_speed_for(Some("blink")), 2.0);
        assert_eq!(resolver.animation_speed_for(Some("sway")), 0.5);
        assert_eq!(resolver.animation_speed_for(None), 0.5);

        let resolved = resolver.resolved();

        assert_eq!(resolved["blinkAnimationSpeed"], json!(2));
        assert!(resolved.get("swayAnimationSpeed").is_none());
    }

    #[test]
    fn animation_speed_draws_a_specific_range_under_its_own_key() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();
        let options = json!({
            "seed": "x",
            "blinkAnimationSpeed": [0.5, 2],
            "swayAnimationSpeed": [0.5, 2]
        });
        let named = Options::new(options.clone());
        let resolver = Resolver::new(&style, &named);
        let blink = resolver.animation_speed_for(Some("blink"));

        assert!((0.5..=2.0).contains(&blink));
        assert_ne!(blink, resolver.animation_speed_for(Some("sway")));

        // The named key is not the global key, so the same seed and range
        // yield a different draw.
        let global = Options::new(json!({ "seed": "x", "animationSpeed": [0.5, 2] }));

        assert_ne!(blink, Resolver::new(&style, &global).animation_speed());

        let again = Options::new(options);

        assert_eq!(
            Resolver::new(&style, &again).animation_speed_for(Some("blink")),
            blink
        );
    }

    #[test]
    fn animation_plays_lets_a_named_switch_win_over_the_global_one() {
        let style = Style::from_str(MINIMAL_STYLE).unwrap();
        let on = Options::new(json!({ "animation": false, "blinkAnimation": true }));
        let resolver = Resolver::new(&style, &on);

        assert!(resolver.animation_plays(Some("blink")));
        assert!(!resolver.animation_plays(Some("sway")));
        assert!(!resolver.animation_plays(None));

        let resolved = resolver.resolved();

        assert_eq!(resolved["blinkAnimation"], json!(true));
        assert!(resolved.get("swayAnimation").is_none());

        let off = Options::new(json!({ "animation": true, "blinkAnimation": false }));
        let resolver = Resolver::new(&style, &off);

        assert!(!resolver.animation_plays(Some("blink")));
        assert!(resolver.animation_plays(Some("sway")));
        assert!(resolver.animation_plays(None));
    }
}
