"""Tests for the options descriptor."""

from __future__ import annotations

from dicebear import OptionsDescriptor, Style


def _minimal_style() -> Style:
    return Style({"canvas": {"width": 100, "height": 100, "elements": []}})


def _full_style() -> Style:
    return Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "components": {
                "eyes": {
                    "width": 100,
                    "height": 100,
                    "variants": {
                        "open": {"elements": []},
                        "closed": {"elements": []},
                        "wink": {"elements": []},
                    },
                },
                "mouth": {
                    "width": 100,
                    "height": 100,
                    "variants": {
                        "happy": {"elements": []},
                        "sad": {"elements": []},
                    },
                },
            },
            "colors": {
                "skin": {"values": ["#ff0000", "#00ff00"]},
                "hair": {"values": ["#000000"]},
                "text": {
                    "values": ["#ffffff", "#000000"],
                    "contrastTo": "background",
                },
            },
        }
    )


# ---------------------------------------------------------------------------
# base options
# ---------------------------------------------------------------------------


def test_includes_all_base_options() -> None:
    schema = OptionsDescriptor(_minimal_style()).to_json()
    assert schema["seed"] == {"type": "string"}
    assert schema["size"] == {"type": "number", "min": 1, "max": 4096}
    assert schema["idRandomization"] == {"type": "boolean"}
    assert schema["flip"] == {
        "type": "enum",
        "values": ["none", "horizontal", "vertical", "both"],
        "list": True,
    }
    assert schema["scale"] == {"type": "range", "min": 0, "max": 10}
    assert schema["borderRadius"] == {"type": "range", "min": 0, "max": 50}
    assert schema["rotate"] == {"type": "range", "min": -360, "max": 360}
    assert schema["translateX"] == {"type": "range", "min": -1000, "max": 1000}
    assert schema["translateY"] == {"type": "range", "min": -1000, "max": 1000}
    assert schema["fontFamily"] == {"type": "string", "list": True}
    assert schema["fontWeight"] == {
        "type": "number",
        "min": 1,
        "max": 1000,
        "list": True,
    }


def test_always_includes_background_color_options() -> None:
    schema = OptionsDescriptor(_minimal_style()).to_json()
    assert schema["backgroundColor"] == {"type": "color", "list": True}
    assert schema["backgroundColorFill"] == {
        "type": "enum",
        "values": ["solid", "linear", "radial"],
        "list": True,
    }
    assert schema["backgroundColorFillStops"] == {"type": "range", "min": 2}
    assert schema["backgroundColorAngle"] == {"type": "range", "min": -360, "max": 360}


# ---------------------------------------------------------------------------
# component options
# ---------------------------------------------------------------------------


def test_generates_component_options() -> None:
    schema = OptionsDescriptor(_full_style()).to_json()
    assert "eyesVariant" in schema
    assert "eyesProbability" in schema
    assert "eyesRotate" not in schema
    assert "eyesTranslateX" not in schema
    assert "eyesTranslateY" not in schema
    assert "eyesScale" not in schema
    assert "mouthVariant" in schema


def test_root_scale_constraints() -> None:
    schema = OptionsDescriptor(_full_style()).to_json()
    assert schema["scale"] == {"type": "range", "min": 0, "max": 10}


def test_sorted_variant_names() -> None:
    schema = OptionsDescriptor(_full_style()).to_json()
    assert schema["eyesVariant"] == {
        "type": "enum",
        "values": ["closed", "open", "wink"],
        "list": True,
        "weighted": True,
    }


def test_probability_constraints() -> None:
    schema = OptionsDescriptor(_full_style()).to_json()
    assert schema["eyesProbability"] == {"type": "number", "min": 0, "max": 100}


# ---------------------------------------------------------------------------
# color options
# ---------------------------------------------------------------------------


def test_generates_color_options() -> None:
    schema = OptionsDescriptor(_full_style()).to_json()
    assert schema["skinColor"] == {"type": "color", "list": True}
    assert schema["hairColor"] == {"type": "color", "list": True}
    assert schema["skinColorFill"] == {
        "type": "enum",
        "values": ["solid", "linear", "radial"],
        "list": True,
    }


def test_exposes_contrast_to_on_color_fields() -> None:
    schema = OptionsDescriptor(_full_style()).to_json()
    assert schema["textColor"] == {
        "type": "color",
        "list": True,
        "contrastTo": "background",
    }
    assert "contrastTo" not in schema["skinColor"]


# ---------------------------------------------------------------------------
# caching
# ---------------------------------------------------------------------------


def test_structurally_equal() -> None:
    descriptor = OptionsDescriptor(_full_style())
    assert descriptor.to_json() == descriptor.to_json()


def test_returns_independent_copies() -> None:
    descriptor = OptionsDescriptor(_full_style())
    a = descriptor.to_json()
    b = descriptor.to_json()
    a["seed"] = {"type": "mutated"}
    assert a["seed"] != b["seed"]
