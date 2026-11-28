//! Validation of an options object.

use serde_json::Value;

use super::{check, options_schema};
use crate::error::Error;

/// Validates an options object against `options.json`.
pub(crate) fn options(instance: &Value) -> Result<(), Error> {
    check(&options_schema::VALIDATOR, instance)
}
