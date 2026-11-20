//! Validates style definitions and options against the shared draft-07 JSON
//! schemas (the pure-data `dicebear-schema` crate). The compiled validators are
//! built once and reused.

use std::sync::LazyLock;

use jsonschema::Validator;
use serde_json::Value;

use crate::error::Error;

static DEFINITION: LazyLock<Validator> = LazyLock::new(|| compile(dicebear_schema::DEFINITION));
static OPTIONS: LazyLock<Validator> = LazyLock::new(|| compile(dicebear_schema::OPTIONS));

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

/// Validates a style definition against `definition.json`.
pub(crate) fn definition(instance: &Value) -> Result<(), Error> {
    check(&DEFINITION, instance)
}

/// How many levels of objects and arrays the options may nest, counting the
/// options object itself as the first. Valid options nest two levels at most;
/// the limit matches the C#, Dart and Python ports.
const MAX_OPTIONS_DEPTH: usize = 64;

/// Validates an options object against `options.json`.
///
/// Options nested deeper than [`MAX_OPTIONS_DEPTH`] levels are turned down
/// first. The schema validator follows the nesting with recursion, and on a
/// thread with the default 2 MiB stack a few thousand levels overflow it,
/// which aborts the process instead of returning an error.
pub(crate) fn options(instance: &Value) -> Result<(), Error> {
    if exceeds_depth(instance, 1) {
        return Err(Error::Validation(format!(
            "nesting is deeper than the {MAX_OPTIONS_DEPTH} levels this port reads"
        )));
    }

    check(&OPTIONS, instance)
}

/// Returns whether `value`, found on level `depth`, nests deeper than
/// [`MAX_OPTIONS_DEPTH`]. The search stops at the first level past the limit,
/// so it never recurses deeper than that itself.
fn exceeds_depth(value: &Value, depth: usize) -> bool {
    match value {
        Value::Array(items) => {
            depth > MAX_OPTIONS_DEPTH || items.iter().any(|item| exceeds_depth(item, depth + 1))
        }
        Value::Object(map) => {
            depth > MAX_OPTIONS_DEPTH || map.values().any(|item| exceeds_depth(item, depth + 1))
        }
        _ => false,
    }
}

fn check(validator: &Validator, instance: &Value) -> Result<(), Error> {
    if validator.is_valid(instance) {
        return Ok(());
    }

    let messages: Vec<String> = validator
        .iter_errors(instance)
        .map(|error| error.to_string())
        .collect();

    Err(Error::Validation(messages.join("; ")))
}
