"""Tests for the Style wrapper and its value-object views."""

from __future__ import annotations

from typing import Any

import pytest

from dicebear import Style
from dicebear.errors import StyleValidationError, ValidationError


def _minimal() -> dict[str, Any]:
    return {"canvas": {"width": 100, "height": 100, "elements": []}}


def _full() -> dict[str, Any]:
    return {
        "$schema": "https://example.com/schema.json",
        "$comment": "Test style",
        "meta": {
            "license": {
                "name": "MIT",
                "url": "https://example.com/license",
                "text": "MIT License",
            },
            "creator": {"name": "Test", "url": "https://example.com"},
            "source": {"name": "Source", "url": "https://example.com/source"},
        },
        "canvas": {
            "width": 200,
            "height": 200,
            "elements": [
                {
                    "type": "element",
                    "name": "rect",
                    "attributes": {"width": "100", "height": "100", "fill": "#ff0000"},
                    "children": [{"type": "text", "value": "hello"}],
                },
                {"type": "component", "name": "eyes"},
                {"type": "text", "value": {"type": "variable", "name": "initials"}},
            ],
        },
        "components": {
            "eyes": {
                "width": 50,
                "height": 50,
                "probability": 100,
                "rotate": {"min": -10, "max": 10},
                "translate": {"x": {"min": 0, "max": 5}, "y": {"min": -2, "max": 2}},
                "variants": {
                    "open": {
                        "elements": [
                            {
                                "type": "element",
                                "name": "circle",
                                "attributes": {"r": "10", "cx": "25", "cy": "25"},
                            }
                        ]
                    },
                    "closed": {
                        "elements": [
                            {
                                "type": "element",
                                "name": "line",
                                "attributes": {
                                    "x1": "10",
                                    "y1": "25",
                                    "x2": "40",
                                    "y2": "25",
                                },
                            }
                        ]
                    },
                },
            }
        },
        "colors": {
            "skin": {"values": ["#f0c8a0", "#d4a574", "#8d5524"]},
            "hair": {"values": ["#2c1b18", "#b55239"], "notEqualTo": ["skin"]},
            "background": {"values": ["#ffffff", "#000000"], "contrastTo": "skin"},
        },
    }


# ---------------------------------------------------------------------------
# constructor
# ---------------------------------------------------------------------------


def test_accepts_minimal_definition() -> None:
    assert Style(_minimal()) is not None


def test_accepts_full_definition() -> None:
    assert Style(_full()) is not None


def test_throws_style_validation_error_for_invalid_data() -> None:
    with pytest.raises(StyleValidationError):
        Style({})


def test_throws_validation_error() -> None:
    with pytest.raises(ValidationError):
        Style({})


def test_throws_runtime_error() -> None:
    with pytest.raises(RuntimeError):
        Style({})


def test_error_includes_details() -> None:
    with pytest.raises(StyleValidationError) as exc_info:
        Style({})
    assert isinstance(exc_info.value.details, list)
    assert len(exc_info.value.details) > 0


# ---------------------------------------------------------------------------
# primitive methods
# ---------------------------------------------------------------------------


def test_returns_schema() -> None:
    full = _full()
    assert Style(full).schema() == full["$schema"]


def test_returns_comment() -> None:
    full = _full()
    assert Style(full).comment() == full["$comment"]


def test_returns_none_for_missing_optional_primitives() -> None:
    style = Style(_minimal())
    assert style.schema() is None
    assert style.comment() is None


def test_returns_defaults_for_missing_optional_objects() -> None:
    style = Style(_minimal())
    assert style.meta() is not None
    assert style.meta().license().name() is None
    assert style.meta().creator().name() is None
    assert style.meta().source().name() is None
    assert style.attributes() == {}


# ---------------------------------------------------------------------------
# canvas
# ---------------------------------------------------------------------------


def test_canvas_width_and_height() -> None:
    style = Style(_full())
    assert style.canvas().width() == 200
    assert style.canvas().height() == 200


def test_canvas_elements() -> None:
    style = Style(_full())
    elements = style.canvas().elements()
    assert len(elements) == 3
    assert elements[0].type() == "element"
    assert elements[0].name() == "rect"
    assert elements[1].type() == "component"
    assert elements[1].name() == "eyes"


def test_canvas_element_children() -> None:
    children = Style(_full()).canvas().elements()[0].children()
    assert len(children) == 1
    assert children[0].type() == "text"
    assert children[0].value() == "hello"


def test_canvas_element_attributes() -> None:
    attrs = Style(_full()).canvas().elements()[0].attributes()
    assert attrs is not None
    assert attrs["width"] == "100"
    assert attrs["fill"] == "#ff0000"


def test_canvas_element_variable_reference() -> None:
    el = Style(_full()).canvas().elements()[2]
    assert el.type() == "text"
    assert el.value() == {"type": "variable", "name": "initials"}


def test_canvas_caches_elements() -> None:
    style = Style(_full())
    assert style.canvas().elements() is style.canvas().elements()


# ---------------------------------------------------------------------------
# meta
# ---------------------------------------------------------------------------


def test_meta_license() -> None:
    meta = Style(_full()).meta()
    assert meta.license().name() == "MIT"
    assert meta.license().url() == "https://example.com/license"
    assert meta.license().text() == "MIT License"


def test_meta_creator() -> None:
    meta = Style(_full()).meta()
    assert meta.creator().name() == "Test"
    assert meta.creator().url() == "https://example.com"


def test_meta_source() -> None:
    assert Style(_full()).meta().source().name() == "Source"


def test_meta_cached() -> None:
    style = Style(_full())
    assert style.meta() is style.meta()


# ---------------------------------------------------------------------------
# components
# ---------------------------------------------------------------------------


def test_components_returns_map() -> None:
    components = Style(_full()).components()
    assert len(components) == 1
    assert "eyes" in components


def test_component_properties() -> None:
    eyes = Style(_full()).components()["eyes"]
    assert eyes.width() == 50
    assert eyes.height() == 50
    assert eyes.probability() == 100
    assert eyes.rotate() == {"min": -10, "max": 10}


def test_component_translate() -> None:
    translate = Style(_full()).components()["eyes"].translate()
    assert translate.x() == {"min": 0, "max": 5}
    assert translate.y() == {"min": -2, "max": 2}


def test_component_variants() -> None:
    eyes = Style(_full()).components()["eyes"]
    assert len(eyes.variants()) == 2
    assert "open" in eyes.variants()
    assert "closed" in eyes.variants()


def test_variant_elements() -> None:
    open_ = Style(_full()).components()["eyes"].variants()["open"]
    assert len(open_.elements()) == 1
    assert open_.elements()[0].name() == "circle"


def test_empty_components_when_none() -> None:
    assert len(Style(_minimal()).components()) == 0


def test_components_cached() -> None:
    style = Style(_full())
    assert style.components() is style.components()


# ---------------------------------------------------------------------------
# colors
# ---------------------------------------------------------------------------


def test_colors_returns_map() -> None:
    assert len(Style(_full()).colors()) == 3


def test_color_values() -> None:
    skin = Style(_full()).colors()["skin"]
    assert skin.values() == ["#f0c8a0", "#d4a574", "#8d5524"]


def test_color_not_equal_to() -> None:
    hair = Style(_full()).colors()["hair"]
    assert hair.not_equal_to() == ["skin"]


def test_color_contrast_to() -> None:
    background = Style(_full()).colors()["background"]
    assert background.contrast_to() == "skin"


def test_empty_colors_when_none() -> None:
    assert len(Style(_minimal()).colors()) == 0


def test_colors_cached() -> None:
    style = Style(_full())
    assert style.colors() is style.colors()


# ---------------------------------------------------------------------------
# component aliases
# ---------------------------------------------------------------------------


def _alias_definition() -> dict[str, Any]:
    return {
        "canvas": {"width": 100, "height": 100, "elements": []},
        "components": {
            "eyes": {
                "width": 50,
                "height": 60,
                "probability": 80,
                "rotate": {"min": -10, "max": 10},
                "scale": {"min": 0.9, "max": 1.1},
                "translate": {"x": {"min": -5, "max": 5}, "y": {"min": -2, "max": 2}},
                "variants": {
                    "open": {
                        "elements": [
                            {
                                "type": "element",
                                "name": "circle",
                                "attributes": {"r": "5"},
                            }
                        ]
                    },
                    "closed": {
                        "elements": [
                            {
                                "type": "element",
                                "name": "line",
                                "attributes": {"x1": "0", "x2": "10"},
                            }
                        ]
                    },
                },
            },
            "eyesRight": {"extends": "eyes"},
        },
    }


def test_alias_exposed_as_map_entry() -> None:
    components = Style(_alias_definition()).components()
    assert "eyesRight" in components
    assert components["eyesRight"].extends_name() == "eyes"
    assert components["eyes"].extends_name() is None


def test_alias_inherits_width_and_height() -> None:
    alias = Style(_alias_definition()).components()["eyesRight"]
    assert alias.width() == 50
    assert alias.height() == 60


def test_alias_inherits_variants() -> None:
    alias = Style(_alias_definition()).components()["eyesRight"]
    assert list(alias.variants().keys()) == ["open", "closed"]


def test_alias_delegates_probability_rotate_scale_translate_to_source() -> None:
    alias = Style(_alias_definition()).components()["eyesRight"]
    assert alias.probability() == 80
    assert alias.rotate() == {"min": -10, "max": 10}
    assert alias.scale() == {"min": 0.9, "max": 1.1}
    assert alias.translate().x() == {"min": -5, "max": 5}
    assert alias.translate().y() == {"min": -2, "max": 2}


def test_alias_rejects_unknown_extends_target() -> None:
    with pytest.raises(StyleValidationError):
        Style(
            {
                "canvas": {"width": 100, "height": 100, "elements": []},
                "components": {"eyesRight": {"extends": "missing"}},
            }
        )


def test_alias_rejects_alias_of_alias() -> None:
    with pytest.raises(StyleValidationError):
        Style(
            {
                "canvas": {"width": 100, "height": 100, "elements": []},
                "components": {
                    "eyes": {
                        "width": 10,
                        "height": 10,
                        "variants": {"open": {"elements": []}},
                    },
                    "eyesRight": {"extends": "eyes"},
                    "eyesRightAgain": {"extends": "eyesRight"},
                },
            }
        )
