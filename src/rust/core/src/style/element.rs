//! Read-only view over a single render-tree element from a style definition.
//!
//! The same node type covers SVG elements, text, and component references —
//! [`Element::kind`] discriminates between them.

use indexmap::IndexMap;
use serde::de::IgnoredAny;
use serde::Deserialize;

/// An attribute or element value: a literal string, or a typed reference
/// (`{ "type": "color" | "variable", "name": "…" }`).
#[derive(Deserialize, Clone)]
#[serde(untagged)]
pub(crate) enum DynValue {
    Str(String),
    Ref(Ref),
}

/// A `{ "type": …, "name": … }` reference to a named color or built-in variable.
#[derive(Deserialize, Clone)]
pub(crate) struct Ref {
    #[serde(rename = "type")]
    kind: String,
    name: String,
}

impl Ref {
    pub(crate) fn kind(&self) -> &str {
        &self.kind
    }

    pub(crate) fn name(&self) -> &str {
        &self.name
    }
}

/// One `animations` entry: an independent timeline with its own duration,
/// delay, and per-property keyframe tracks.
#[derive(Deserialize, Clone)]
pub(crate) struct Animation {
    name: Option<String>,
    duration: f64,
    delay: Option<f64>,
    iterations: Option<Iterations>,
    direction: Option<String>,
    fill: Option<String>,
    easing: Option<Easing>,
    origin: Option<AnimationOrigin>,
    tracks: IndexMap<String, AnimationTrack>,
}

impl Animation {
    /// The optional name grouping this timeline under a user-selectable
    /// animation. Several timelines may share one name. A timeline without
    /// one only plays when the `animation` option enables all animations.
    pub(crate) fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    /// The duration of one iteration in seconds.
    pub(crate) fn duration(&self) -> f64 {
        self.duration
    }

    /// The start delay in seconds, defaulting to `0`.
    pub(crate) fn delay(&self) -> f64 {
        self.delay.unwrap_or(0.0)
    }

    /// The finite iteration count, or `None` for the default `infinite` (the
    /// explicit `"infinite"` keyword reads the same).
    pub(crate) fn iterations(&self) -> Option<f64> {
        match self.iterations {
            Some(Iterations::Count(count)) => Some(count),
            _ => None,
        }
    }

    pub(crate) fn direction(&self) -> Option<&str> {
        self.direction.as_deref()
    }

    /// The CSS `animation-fill-mode`, defaulting to `none`.
    pub(crate) fn fill(&self) -> &str {
        self.fill.as_deref().unwrap_or("none")
    }

    /// The default easing for segments whose keyframes define none.
    pub(crate) fn easing(&self) -> Option<&Easing> {
        self.easing.as_ref()
    }

    /// The transform origin for rotate and scale tracks, as `(x, y)`
    /// percentages of the element's bounding box, defaulting to the center.
    pub(crate) fn origin(&self) -> (f64, f64) {
        match &self.origin {
            Some(origin) => (origin.x, origin.y),
            None => (50.0, 50.0),
        }
    }

    pub(crate) fn tracks(&self) -> &IndexMap<String, AnimationTrack> {
        &self.tracks
    }
}

/// The `iterations` value: a finite count, or the `infinite` keyword (the
/// only string the schema allows).
#[derive(Deserialize, Clone)]
#[serde(untagged)]
enum Iterations {
    Count(f64),
    Infinite(IgnoredAny),
}

/// An easing: a named keyword (`linear`, `ease`, …, `hold`) or a cubic bezier
/// given by its two control points.
#[derive(Deserialize, Clone)]
#[serde(untagged)]
pub(crate) enum Easing {
    Keyword(String),
    Bezier(EasingBezier),
}

/// The `{ x1, y1, x2, y2 }` control points of a cubic bezier easing.
#[derive(Deserialize, Clone)]
pub(crate) struct EasingBezier {
    pub x1: f64,
    pub y1: f64,
    pub x2: f64,
    pub y2: f64,
}

#[derive(Deserialize, Clone)]
struct AnimationOrigin {
    x: f64,
    y: f64,
}

/// The keyframes animating one property of the element.
#[derive(Deserialize, Clone)]
pub(crate) struct AnimationTrack {
    keyframes: Vec<AnimationKeyframe>,
}

impl AnimationTrack {
    pub(crate) fn keyframes(&self) -> &[AnimationKeyframe] {
        &self.keyframes
    }
}

/// A single keyframe: `at` positions it on the timeline as a percentage of
/// the animation's duration, `easing` shapes the segment to the next
/// keyframe.
#[derive(Deserialize, Clone)]
pub(crate) struct AnimationKeyframe {
    at: f64,
    value: f64,
    easing: Option<Easing>,
}

impl AnimationKeyframe {
    pub(crate) fn at(&self) -> f64 {
        self.at
    }

    pub(crate) fn value(&self) -> f64 {
        self.value
    }

    pub(crate) fn easing(&self) -> Option<&Easing> {
        self.easing.as_ref()
    }
}

#[derive(Deserialize, Clone)]
pub(crate) struct Element {
    #[serde(rename = "type")]
    kind: String,
    name: Option<String>,
    value: Option<DynValue>,
    attributes: Option<IndexMap<String, DynValue>>,
    #[serde(default)]
    animations: Vec<Animation>,
    #[serde(default)]
    children: Vec<Element>,
}

impl Element {
    /// The element type discriminator (`element`, `text`, or `component`).
    /// Named `kind` because `type` is a Rust keyword; mirrors JS `type()`.
    pub(crate) fn kind(&self) -> &str {
        &self.kind
    }

    pub(crate) fn name(&self) -> Option<&str> {
        self.name.as_deref()
    }

    pub(crate) fn value(&self) -> Option<&DynValue> {
        self.value.as_ref()
    }

    pub(crate) fn attributes(&self) -> Option<&IndexMap<String, DynValue>> {
        self.attributes.as_ref()
    }

    /// The element's declarative animation timelines. Empty for elements
    /// without animations.
    pub(crate) fn animations(&self) -> &[Animation] {
        &self.animations
    }

    pub(crate) fn children(&self) -> &[Element] {
        &self.children
    }
}
