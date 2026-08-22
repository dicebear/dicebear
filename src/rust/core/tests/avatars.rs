//! Cross-language avatar parity. Renders each shared fixture case and asserts
//! the SVG matches byte-for-byte the output committed under
//! `<repo>/tests/fixtures/parity/avatars/`, the same fixtures every other port
//! renders against.

use std::fs;
use std::path::PathBuf;

use dicebear_core::{Avatar, OptionsDescriptor, Style};
use serde_json::Value;

fn parity_dir() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("../../../tests/fixtures/parity")
}

fn read(path: PathBuf) -> String {
    fs::read_to_string(&path).unwrap_or_else(|e| panic!("read {}: {e}", path.display()))
}

/// Enumerates the parity style fixtures instead of repeating a hand-maintained
/// list, so a fixture added to `tests/fixtures/parity/styles` is picked up here
/// the way the PHP and Python suites already pick it up. Sorted, so the
/// assertion order stays stable.
fn style_names() -> Vec<String> {
    let dir = parity_dir().join("styles");
    let mut names: Vec<String> = fs::read_dir(&dir)
        .unwrap_or_else(|e| panic!("list {}: {e}", dir.display()))
        .map(|entry| entry.expect("read dir entry").path())
        .filter(|path| path.extension().is_some_and(|ext| ext == "json"))
        .map(|path| {
            path.file_stem()
                .expect("fixture file stem")
                .to_string_lossy()
                .into_owned()
        })
        .collect();

    assert!(!names.is_empty(), "no style fixtures found");
    names.sort();

    names
}

#[test]
fn avatar_parity() {
    for name in style_names() {
        let name = name.as_str();
        let style_json = read(parity_dir().join("styles").join(format!("{name}.json")));
        let style =
            Style::from_str(&style_json).unwrap_or_else(|e| panic!("parse style {name}: {e}"));

        let cases: Value = serde_json::from_str(&read(
            parity_dir().join("avatars").join(format!("{name}.json")),
        ))
        .unwrap();

        for case in cases.as_array().unwrap() {
            let id = case["id"].as_str().unwrap();
            let avatar = Avatar::new(&style, case["options"].clone())
                .unwrap_or_else(|e| panic!("render {name} / {id}: {e}"));

            assert_eq!(
                avatar.to_svg(),
                case["svg"].as_str().unwrap(),
                "{name} / {id}"
            );

            // Deep-equal (order-independent) like the other ports' suites.
            // Unlike Python's `1.0 == 1`, serde_json distinguishes
            // integer and float numbers, so this also pins whole-number
            // options as JSON integers.
            assert_eq!(
                avatar.to_json()["options"],
                case["resolvedOptions"],
                "{name} / {id} resolved options"
            );

            // Only select cases carry a dataUri — it pins the percent-encoding
            // contract (JS encodeURIComponent) without bloating every fixture.
            if let Some(data_uri) = case["dataUri"].as_str() {
                assert_eq!(avatar.to_data_uri(), data_uri, "{name} / {id} data URI");
            }
        }
    }
}

/// Cross-language descriptor parity: the field map every port derives from a
/// style (types, ranges, sorted variant lists, per-color fields) must deep-equal
/// the JS-generated fixture. Like the resolved-options assertion above, the
/// `Value` comparison also pins whole numbers as JSON integers.
#[test]
fn descriptor_parity() {
    for name in style_names() {
        let name = name.as_str();
        let style_json = read(parity_dir().join("styles").join(format!("{name}.json")));
        let style =
            Style::from_str(&style_json).unwrap_or_else(|e| panic!("parse style {name}: {e}"));

        let expected: Value = serde_json::from_str(&read(
            parity_dir()
                .join("descriptors")
                .join(format!("{name}.json")),
        ))
        .unwrap();

        assert_eq!(
            OptionsDescriptor::new(&style).to_json(),
            expected,
            "{name} descriptor"
        );
    }
}
