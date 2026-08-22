//! Core library for generating DiceBear avatars.
//!
//! A Rust port of the DiceBear core. The full pipeline is implemented —
//! [`Style`] parses a style definition, [`Avatar`] resolves options against it
//! with a deterministic, key-based PRNG and renders the SVG. Output is verified
//! byte-for-byte against the cross-language parity fixtures under
//! `<repo>/tests/fixtures/parity/`.
//!
//! The public API mirrors the reference: [`Avatar`], [`Style`],
//! [`OptionsDescriptor`], the [`color`] utilities and [`Error`]. Everything else
//! (the PRNG, resolver, renderer, options, and the other utilities) is internal.

mod avatar;
mod error;
mod options;
mod options_descriptor;
mod prng;
mod renderer;
mod resolver;
mod style;
mod utils;
mod validate;

pub use avatar::Avatar;
pub use error::Error;
pub use options_descriptor::OptionsDescriptor;
pub use style::Style;
pub use utils::color;
