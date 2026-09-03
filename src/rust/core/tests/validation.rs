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

/// A one-keyframe opacity track, the smallest animation the schema accepts.
fn opacity_track() -> Value {
    json!({
        "duration": 1,
        "tracks": { "opacity": { "keyframes": [{ "at": 0, "value": 1 }] } },
    })
}

#[test]
fn rejects_animations_inside_defs() {
    let result = Style::from_value(json!({
        "canvas": {
            "width": 100,
            "height": 100,
            "elements": [{
                "type": "element",
                "name": "defs",
                "children": [{
                    "type": "element",
                    "name": "circle",
                    "attributes": { "id": "dot", "r": "10" },
                    "animations": [opacity_track()],
                }],
            }],
        },
    }));

    // The schema rejects animations below `defs`: a `<use>` clones only the
    // node it references, so the animation wrappers never reach the instance.
    assert!(result.is_err(), "animation inside defs must fail");
}

#[test]
fn rejects_animations_below_a_clip_path() {
    let result = Style::from_value(json!({
        "canvas": {
            "width": 100,
            "height": 100,
            "elements": [{
                "type": "element",
                "name": "clipPath",
                "attributes": { "id": "clip" },
                "children": [{
                    "type": "element",
                    "name": "g",
                    "children": [{
                        "type": "element",
                        "name": "circle",
                        "attributes": { "r": "10" },
                        "animations": [opacity_track()],
                    }],
                }],
            }],
        },
    }));

    // `<g>` is no valid clipPath content, so the schema rejects animations
    // anywhere below it.
    assert!(result.is_err(), "animation below a clipPath must fail");
}

#[test]
fn accepts_animations_inside_a_mask() {
    let result = Style::from_value(json!({
        "canvas": {
            "width": 100,
            "height": 100,
            "elements": [{
                "type": "element",
                "name": "mask",
                "attributes": { "id": "fade" },
                "children": [{
                    "type": "element",
                    "name": "circle",
                    "attributes": { "r": "10", "fill": "#fff" },
                    "animations": [opacity_track()],
                }],
            }],
        },
    }));

    assert!(result.is_ok(), "animation inside a mask must be accepted");
}

fn attribute_style(fill: &str) -> Result<Style, Error> {
    Style::from_value(json!({
        "canvas": { "width": 100, "height": 100, "elements": [] },
        "attributes": { "fill": fill },
    }))
}

/// The injection filter in `definition.json` separates its tokens with the
/// whitespace class the schema spells out, and that class holds the five ASCII
/// whitespace characters and nothing else. A payload split by one of them has
/// to be rejected, or it would land verbatim in the rendered SVG. Every other
/// code point reads as part of the token, so the filter never sees a match.
#[test]
fn the_injection_filter_skips_ascii_whitespace_only() {
    let skipped = ['\u{0009}', '\u{000a}', '\u{000c}', '\u{000d}', '\u{0020}'];
    let not_skipped = [
        '\u{000b}', '\u{0085}', '\u{00a0}', '\u{1680}', '\u{2000}', '\u{2028}', '\u{2029}',
        '\u{202f}', '\u{205f}', '\u{3000}', '\u{feff}', '\u{200b}',
    ];

    assert!(attribute_style("javascript:alert(1)").is_err());
    assert!(attribute_style("url(https://evil.example)").is_err());

    for separator in skipped {
        let code = separator as u32;

        assert!(
            attribute_style(&format!("javascript{separator}:alert(1)")).is_err(),
            "a javascript: payload split by U+{code:04X} must be rejected"
        );
        assert!(
            attribute_style(&format!("url{separator}({separator}https://evil.example)")).is_err(),
            "a url( payload split by U+{code:04X} must be rejected"
        );
        assert!(
            attribute_style(&format!("url({separator}#local)")).is_ok(),
            "a local reference behind U+{code:04X} must stay valid"
        );
    }

    for separator in not_skipped {
        let code = separator as u32;

        assert!(
            attribute_style(&format!("javascript{separator}:alert(1)")).is_ok(),
            "U+{code:04X} does not end the javascript token, so the value is valid"
        );
        assert!(
            attribute_style(&format!("url{separator}({separator}https://evil.example)")).is_ok(),
            "U+{code:04X} does not end the url token, so the value is valid"
        );
        assert!(
            attribute_style(&format!("url({separator}#local)")).is_err(),
            "U+{code:04X} behind `url(` is not skipped, so the reference is rejected"
        );
    }
}

/// Local paint server references are what the `url(` filter deliberately lets
/// through, with or without whitespace around the parenthesis.
#[test]
fn local_url_references_stay_valid() {
    assert!(attribute_style("url(#local)").is_ok());
    assert!(attribute_style("url( #local)").is_ok());
    assert!(attribute_style("url\t(\t#local)").is_ok());
}

/// The anchored patterns in `options.json` end where the input ends, so a color
/// with a trailing newline is not valid.
#[test]
fn a_trailing_newline_fails_an_anchored_pattern() {
    let style = Style::from_str(MINIMAL_STYLE).unwrap();

    assert!(Avatar::new(&style, json!({ "backgroundColor": ["#ff0000"] })).is_ok());
    assert!(Avatar::new(&style, json!({ "backgroundColor": ["ff0000"] })).is_ok());
    assert!(Avatar::new(&style, json!({ "backgroundColor": ["#ff0000\n"] })).is_err());
    assert!(Avatar::new(&style, json!({ "fontFamily": ["Foo Bar, Baz"] })).is_ok());
}
