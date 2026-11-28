//! The compiled `options.json` schema for avatar options.

use std::sync::LazyLock;

use jsonschema::Validator;

use super::compile;

/// The `options.json` validator, compiled on first use.
pub(super) static VALIDATOR: LazyLock<Validator> =
    LazyLock::new(|| compile(dicebear_schema::OPTIONS));
