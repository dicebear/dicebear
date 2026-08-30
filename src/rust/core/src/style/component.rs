//! Read-only view over an entry in a style definition's `components` block.
//!
//! An entry is either a base component with its own dimensions and variants or
//! an alias declared via `extends`. Aliases are pure references: they share the
//! source's [`ComponentData`] via `Arc` and delegate every accessor to it.

use std::collections::HashMap;
use std::sync::Arc;

use indexmap::IndexMap;
use serde::Deserialize;

use super::component_translate::ComponentTranslate;
use super::component_variant::ComponentVariant;
use crate::prng::Range;

/// A `components` entry before alias resolution.
#[derive(Deserialize)]
#[serde(untagged)]
pub(crate) enum RawComponent {
    Alias { extends: String },
    // Boxed: the base variant is far larger than the alias.
    Base(Box<ComponentData>),
}

/// The intrinsic data of a base component, shared by its aliases via `Arc`.
#[derive(Deserialize)]
pub(crate) struct ComponentData {
    width: f64,
    height: f64,
    probability: Option<f64>,
    rotate: Option<Range>,
    scale: Option<Range>,
    #[serde(default)]
    translate: ComponentTranslate,
    variants: IndexMap<String, ComponentVariant>,
}

impl ComponentData {
    /// The variants of a base component, before alias resolution. Consumed by
    /// the definition-level walks in `Style` (animation validation and
    /// detection).
    pub(crate) fn variants(&self) -> &IndexMap<String, ComponentVariant> {
        &self.variants
    }
}

pub(crate) struct Component {
    name: String,
    source_name: String,
    data: Arc<ComponentData>,
}

impl Component {
    /// The entry's own name (the alias key for aliases).
    pub(crate) fn name(&self) -> &str {
        &self.name
    }

    /// The canonical user-option key prefix: the source's name for an alias,
    /// otherwise the entry's own name.
    pub(crate) fn source_name(&self) -> &str {
        &self.source_name
    }

    /// Whether this entry is an alias (its name differs from its source's).
    pub(crate) fn is_alias(&self) -> bool {
        self.name != self.source_name
    }

    pub(crate) fn width(&self) -> f64 {
        self.data.width
    }

    pub(crate) fn height(&self) -> f64 {
        self.data.height
    }

    /// The render probability (0–100), defaulting to `100`.
    pub(crate) fn probability(&self) -> f64 {
        self.data.probability.unwrap_or(100.0)
    }

    pub(crate) fn rotate(&self) -> Option<Range> {
        self.data.rotate
    }

    pub(crate) fn scale(&self) -> Option<Range> {
        self.data.scale
    }

    pub(crate) fn translate(&self) -> &ComponentTranslate {
        &self.data.translate
    }

    pub(crate) fn variants(&self) -> &IndexMap<String, ComponentVariant> {
        &self.data.variants
    }
}

/// Resolves the raw `components` block into flattened [`Component`]s. Base
/// components are built first; each alias then shares its source's `Arc`. An
/// alias whose source is missing is skipped (alias validity is checked in
/// `Style` so a clear error is reported instead).
pub(crate) fn build(raw: Option<IndexMap<String, RawComponent>>) -> IndexMap<String, Component> {
    let Some(raw) = raw else {
        return IndexMap::new();
    };

    let mut bases: HashMap<String, Arc<ComponentData>> = HashMap::new();
    let mut order: Vec<(String, Option<String>)> = Vec::new();

    for (name, entry) in raw {
        match entry {
            RawComponent::Base(data) => {
                bases.insert(name.clone(), Arc::new(*data));
                order.push((name, None));
            }
            RawComponent::Alias { extends } => order.push((name, Some(extends))),
        }
    }

    let mut components = IndexMap::new();

    for (name, extends) in order {
        let key = extends.as_deref().unwrap_or(&name);

        if let Some(data) = bases.get(key) {
            let source_name = extends.clone().unwrap_or_else(|| name.clone());
            components.insert(
                name.clone(),
                Component {
                    name,
                    source_name,
                    data: Arc::clone(data),
                },
            );
        }
    }

    components
}
