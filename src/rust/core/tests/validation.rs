//! Validation rejects malformed style definitions and options.

use std::fs;
use std::path::PathBuf;

use dicebear_core::{Avatar, Error, Style};
use serde_json::{json, Value};

const MINIMAL_STYLE: &str = r#"{"canvas":{"width":100,"height":100,"elements":[]}}"#;

#[test]
fn accepts_a_minimal_valid_style_and_options() {
    let style = Style::from_str(MINIMAL_STYLE).expect("minimal style is valid");
    assert!(Avatar::new(&style, json!({ "seed": "x" })).is_ok());
    // `null` options are treated as empty and accepted.
    assert!(Avatar::new(&style, json!(null)).is_ok());
}

#[test]
fn rejects_a_definition_missing_canvas() {
    assert!(Style::from_str(r#"{"components":{}}"#).is_err());
}

#[test]
fn rejects_an_alias_to_an_unknown_component() {
    let def = r#"{"canvas":{"width":100,"height":100,"elements":[]},"components":{"a":{"extends":"missing"}}}"#;
    match Style::from_str(def) {
        Ok(_) => panic!("alias to unknown component must fail"),
        Err(err) => assert!(err.to_string().contains("unknown component")),
    }
}

#[test]
fn rejects_options_with_a_wrong_type() {
    let style = Style::from_str(MINIMAL_STYLE).unwrap();
    // `seed` must be a string.
    assert!(Avatar::new(&style, json!({ "seed": 123 })).is_err());
}

#[test]
fn rejects_a_color_order_with_an_unknown_value() {
    let style = Style::from_str(MINIMAL_STYLE).unwrap();

    assert!(Avatar::new(&style, json!({ "skinColorOrder": "sorted" })).is_err());
}

#[test]
fn rejects_a_color_order_array() {
    let style = Style::from_str(MINIMAL_STYLE).unwrap();

    // `${name}ColorOrder` takes a single value, never a list.
    assert!(Avatar::new(&style, json!({ "skinColorOrder": ["fixed"] })).is_err());
}

/// Cross-language validation parity: every port must accept and reject the
/// same inputs (error messages are language-specific and not compared). The
/// circular color reference cases additionally pin the reported chain.
#[test]
fn validation_parity() {
    let path = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("../../../tests/fixtures/parity/validation.json");
    let text = fs::read_to_string(&path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()));
    let f: Value = serde_json::from_str(&text).unwrap();

    let mut minimal = None;

    for c in f["styles"].as_array().unwrap() {
        let id = c["id"].as_str().unwrap();
        let definition = serde_json::to_string(&c["definition"]).unwrap();
        let result = Style::from_str(&definition);

        assert_eq!(result.is_ok(), c["valid"].as_bool().unwrap(), "style {id}");

        if id == "minimal" {
            minimal = result.ok();
        }
    }

    let minimal = minimal.expect("minimal style fixture");

    for c in f["options"].as_array().unwrap() {
        let id = c["id"].as_str().unwrap();
        let result = Avatar::new(&minimal, c["options"].clone());

        assert_eq!(
            result.is_ok(),
            c["valid"].as_bool().unwrap(),
            "options {id}"
        );
    }

    for c in f["circularColors"].as_array().unwrap() {
        let id = c["id"].as_str().unwrap();
        let style_json = serde_json::to_string(&c["style"]).unwrap();
        let style = Style::from_str(&style_json)
            .unwrap_or_else(|e| panic!("circular style {id} must parse: {e}"));
        let want: Vec<&str> = c["chain"]
            .as_array()
            .unwrap()
            .iter()
            .map(|x| x.as_str().unwrap())
            .collect();

        match Avatar::new(&style, c["options"].clone()) {
            Ok(_) => panic!("circular {id}: expected an error"),
            Err(Error::CircularColorReference(chain)) => {
                assert_eq!(chain, want, "circular {id} chain");
            }
            Err(other) => panic!("circular {id}: expected CircularColorReference, got {other}"),
        }
    }
}
