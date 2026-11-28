//! Validates style definitions and options against the shared draft-07 JSON
//! schemas (the pure-data `dicebear-schema` crate). The compiled validators are
//! built once and reused.
//!
//! Each schema lives in its own submodule (`style_schema`, `options_schema`).
//! The entry points [`style`] and [`options`] run the shared depth check and
//! the schema validation; [`style`] then adds the cross-key checks on the
//! definition that the JSON Schema cannot express.

mod options;
mod options_schema;
mod style;
mod style_schema;

pub(crate) use options::options;
pub(crate) use style::style;

use jsonschema::Validator;
use serde_json::Value;

use crate::error::Error;

/// Parses one of the shared schemas and compiles it.
///
/// Every `pattern` reaches the regex engine as the schema writes it. The schema
/// spells its whitespace class out instead of leaning on `\s`, and the regex
/// crate reads `$` as the end of the haystack, the anchor ECMA-262 gives it
/// without the `m` flag. Engines that also let `$` match before a trailing
/// newline have to translate that anchor first. This one does not.
fn compile(schema: &str) -> Validator {
    let schema: Value = serde_json::from_str(schema).expect("embedded schema is valid JSON");

    jsonschema::validator_for(&schema).expect("embedded schema compiles")
}

/// How many levels of objects and arrays a style definition or the options may
/// nest, counting the value itself as the first. The deepest style definition
/// uses less than a quarter of that and valid options two levels; the limit
/// matches the C#, Dart and Python ports.
const MAX_DEPTH: usize = 64;

/// Returns whether `value`, found on level `depth`, nests deeper than
/// [`MAX_DEPTH`]. The search stops at the first level past the limit, so it
/// never recurses deeper than that itself.
fn exceeds_depth(value: &Value, depth: usize) -> bool {
    match value {
        Value::Array(items) => {
            depth > MAX_DEPTH || items.iter().any(|item| exceeds_depth(item, depth + 1))
        }
        Value::Object(map) => {
            depth > MAX_DEPTH || map.values().any(|item| exceeds_depth(item, depth + 1))
        }
        _ => false,
    }
}

/// Validates `instance` against `validator`.
///
/// A value nested deeper than [`MAX_DEPTH`] levels is turned down first. The
/// schema validator follows the nesting with recursion, and on a thread with
/// the default 2 MiB stack a few thousand levels overflow it, which aborts the
/// process instead of returning an error.
fn check(validator: &Validator, instance: &Value) -> Result<(), Error> {
    if exceeds_depth(instance, 1) {
        return Err(Error::Validation(format!(
            "nesting is deeper than the {MAX_DEPTH} levels this port reads"
        )));
    }

    if validator.is_valid(instance) {
        return Ok(());
    }

    let messages: Vec<String> = validator
        .iter_errors(instance)
        .map(|error| error.to_string())
        .collect();

    Err(Error::Validation(messages.join("; ")))
}

/// Turns the collected messages of one check into a result, joining them
/// with `"; "` into a single [`Error::Validation`].
fn collected(errors: Vec<String>) -> Result<(), Error> {
    if errors.is_empty() {
        Ok(())
    } else {
        Err(Error::Validation(errors.join("; ")))
    }
}
