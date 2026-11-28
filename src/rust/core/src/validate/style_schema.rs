//! The compiled `definition.json` schema for style definitions.

use std::sync::LazyLock;

use jsonschema::Validator;

use super::compile;

/// The `definition.json` validator, compiled on first use.
pub(super) static VALIDATOR: LazyLock<Validator> =
    LazyLock::new(|| compile(dicebear_schema::DEFINITION));
