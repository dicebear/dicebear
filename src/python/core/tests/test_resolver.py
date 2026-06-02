"""Tests for deterministic option resolution."""

from __future__ import annotations

from typing import Any

import pytest

from dicebear import Style
from dicebear.errors import CircularColorReferenceError
from dicebear.options import Options
from dicebear.resolver import Resolver


def _make_resolver(style: Style, data: dict[str, Any] | None = None) -> Resolver:
    return Resolver(style, Options(data or {}))


def _minimal_style() -> Style:
    return Style({"canvas": {"width": 100, "height": 100, "elements": []}})


def _style_with_components() -> Style:
    return Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "variants": {
                        "open": {"elements": []},
                        "closed": {"elements": []},
                        "wink": {"elements": []},
                    },
                }
            },
        }
    )


def _style_with_colors() -> Style:
    return Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "colors": {
                "skin": {"values": ["#f0c8a0", "#d4a574", "#8d5524"]},
                "hair": {
                    "values": ["#2c1b18", "#b55239", "#d6b370"],
                    "notEqualTo": ["skin"],
                },
                "background": {
                    "values": ["#ffffff", "#000000", "#cccccc"],
                    "contrastTo": "skin",
                },
            },
        }
    )


def _style_with_weights() -> Style:
    return Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "variants": {
                        "common": {"elements": [], "weight": 10},
                        "rare": {"elements": [], "weight": 1},
                        "hidden": {"elements": [], "weight": 0},
                    },
                }
            },
        }
    )


def _full_options() -> dict[str, Any]:
    return {
        "seed": "test-seed",
        "size": 128,
        "idRandomization": True,
        "flip": ["horizontal", "vertical"],
        "fontFamily": ["Arial", "Helvetica"],
        "fontWeight": [400, 700],
        "scale": [0.8, 1.2],
        "borderRadius": [0, 50],
        "eyesProbability": 80,
        "eyesVariant": ["open", "closed", "wink"],
        "skinColor": ["#f0c8a0", "#d4a574"],
        "rotate": [-15, 15],
        "translateX": [-5, 5],
        "translateY": [-2, 2],
    }


# ---------------------------------------------------------------------------
# constructor
# ---------------------------------------------------------------------------


def test_accepts_minimal_options() -> None:
    assert _make_resolver(_minimal_style(), {}) is not None


def test_accepts_full_options() -> None:
    assert _make_resolver(_minimal_style(), _full_options()) is not None


# ---------------------------------------------------------------------------
# defaults
# ---------------------------------------------------------------------------


def test_defaults() -> None:
    resolver = _make_resolver(_minimal_style(), {})
    assert resolver.seed() == ""
    assert resolver.size() is None
    assert resolver.id_randomization() is False
    assert resolver.flip() == "none"
    assert resolver.font_family() == "system-ui"
    assert resolver.font_weight() == 400
    assert resolver.scale() == pytest.approx(1, abs=1e-10)
    assert resolver.border_radius() == pytest.approx(0, abs=1e-10)


def test_pattern_defaults() -> None:
    resolver = _make_resolver(_minimal_style(), {})
    assert resolver.variant("eyes") is None
    assert resolver.color("skin") == []
    assert resolver.color_fill("skin") == "solid"
    assert resolver.rotate() == pytest.approx(0, abs=1e-10)
    assert resolver.translate_x() == pytest.approx(0, abs=1e-10)
    assert resolver.translate_y() == pytest.approx(0, abs=1e-10)


# ---------------------------------------------------------------------------
# single values
# ---------------------------------------------------------------------------


def test_single_values() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {
            "seed": "my-seed",
            "size": 256,
            "idRandomization": True,
            "flip": "horizontal",
            "fontFamily": "Arial",
            "fontWeight": 700,
            "scale": 1.5,
            "borderRadius": 25,
        },
    )
    assert resolver.seed() == "my-seed"
    assert resolver.size() == 256
    assert resolver.id_randomization() is True
    assert resolver.flip() == "horizontal"
    assert resolver.font_family() == "Arial"
    assert resolver.font_weight() == 700
    assert resolver.scale() == pytest.approx(1.5, abs=1e-10)
    assert resolver.border_radius() == pytest.approx(25, abs=1e-10)


def test_single_pattern_values() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {
            "eyesProbability": 80,
            "eyesVariant": "open",
            "skinColor": "#f0c8a0",
            "rotate": 45,
            "translateX": 5,
            "translateY": -3,
        },
    )
    assert resolver.variant("eyes") is None
    assert resolver.color("skin") == ["#f0c8a0"]
    assert resolver.rotate() == pytest.approx(45, abs=1e-10)
    assert resolver.translate_x() == pytest.approx(5, abs=1e-10)
    assert resolver.translate_y() == pytest.approx(-3, abs=1e-10)


# ---------------------------------------------------------------------------
# PRNG resolution
# ---------------------------------------------------------------------------


def test_deterministic() -> None:
    full = _full_options()
    a = _make_resolver(_minimal_style(), full)
    b = _make_resolver(_minimal_style(), full)
    assert a.flip() == b.flip()
    assert a.font_family() == b.font_family()
    assert a.font_weight() == b.font_weight()
    assert a.scale() == b.scale()
    assert a.border_radius() == b.border_radius()


def test_different_seeds() -> None:
    full = _full_options()
    a = _make_resolver(_minimal_style(), {**full, "seed": "seed-a"})
    b = _make_resolver(_minimal_style(), {**full, "seed": "seed-b"})
    results = [
        a.flip() != b.flip(),
        a.font_family() != b.font_family(),
        a.scale() != b.scale(),
        a.rotate() != b.rotate(),
    ]
    assert any(results)


def test_picks_from_arrays() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {
            "seed": "pick-test",
            "flip": ["horizontal", "vertical"],
            "skinColor": ["#f0c8a0", "#d4a574", "#8d5524"],
        },
    )
    assert resolver.flip() in ["horizontal", "vertical"]
    assert len(resolver.color("skin")) == 1
    assert resolver.color("skin")[0] in ["#f0c8a0", "#d4a574", "#8d5524"]


def test_interpolates_ranges() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {
            "seed": "range-test",
            "scale": [0.8, 1.2],
            "borderRadius": [0, 50],
            "rotate": [-15, 15],
            "translateX": [-5, 5],
        },
    )
    assert 0.8 <= resolver.scale() <= 1.2
    assert 0 <= resolver.border_radius() <= 50
    assert -15 <= resolver.rotate() <= 15


def test_picks_color_fill_from_arrays() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {"seed": "fill-test", "skinColorFill": ["solid", "linear", "radial"]},
    )
    assert resolver.color_fill("skin") in ["solid", "linear", "radial"]


def test_color_fill_stops_for_gradient() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {
            "seed": "gradient-test",
            "skinColor": ["#f0c8a0", "#d4a574", "#8d5524"],
            "skinColorFill": "linear",
            "skinColorFillStops": 2,
        },
    )
    colors = resolver.color("skin")
    assert len(colors) == 2
    for c in colors:
        assert c in ["#f0c8a0", "#d4a574", "#8d5524"]


def test_defaults_to_2_stops_for_gradient() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {
            "seed": "gradient-default-test",
            "skinColor": ["#f0c8a0", "#d4a574", "#8d5524"],
            "skinColorFill": "radial",
        },
    )
    assert len(resolver.color("skin")) == 2


def test_single_color_for_solid_fill() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {
            "seed": "solid-test",
            "skinColor": ["#f0c8a0", "#d4a574", "#8d5524"],
            "skinColorFill": "solid",
        },
    )
    colors = resolver.color("skin")
    assert len(colors) == 1
    assert colors[0] in ["#f0c8a0", "#d4a574", "#8d5524"]


def test_picks_from_font_weight_array() -> None:
    resolver = _make_resolver(
        _minimal_style(), {"seed": "fw-test", "fontWeight": [400, 700]}
    )
    assert resolver.font_weight() in [400, 700]


# ---------------------------------------------------------------------------
# colorFillStops via color()
# ---------------------------------------------------------------------------


def test_respects_custom_stops_count() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {
            "seed": "stops-test",
            "skinColor": ["#ff0000", "#00ff00", "#0000ff", "#ffffff"],
            "skinColorFill": "linear",
            "skinColorFillStops": 3,
        },
    )
    assert len(resolver.color("skin")) == 3


def test_picks_integer_stops_from_range() -> None:
    for i in range(20):
        resolver = _make_resolver(
            _minimal_style(),
            {
                "seed": f"stops-{i}",
                "skinColor": ["#ff0000", "#00ff00", "#0000ff", "#ffffff", "#000000"],
                "skinColorFill": "radial",
                "skinColorFillStops": [2, 4],
            },
        )
        count = len(resolver.color("skin"))
        assert 2 <= count <= 4


# ---------------------------------------------------------------------------
# component_transform
# ---------------------------------------------------------------------------


def test_component_transform_identity_defaults() -> None:
    t = _make_resolver(
        _style_with_components(), {"seed": "identity"}
    ).component_transform("eyes")
    assert t["rotate"] == pytest.approx(0.0, abs=1e-10)
    assert t["translateX"] == pytest.approx(0.0, abs=1e-10)
    assert t["translateY"] == pytest.approx(0.0, abs=1e-10)
    assert t["scale"] == pytest.approx(1.0, abs=1e-10)


def test_component_transform_draws_rotate_from_definition() -> None:
    style = Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "rotate": {"min": -10, "max": 10},
                    "variants": {"open": {"elements": []}},
                }
            },
        }
    )
    t = _make_resolver(style, {"seed": "rotate"}).component_transform("eyes")
    assert -10 <= t["rotate"] <= 10


def test_component_transform_is_deterministic_per_seed() -> None:
    a = _make_resolver(_style_with_components(), {"seed": "pick"})
    b = _make_resolver(_style_with_components(), {"seed": "pick"})
    assert a.component_transform("eyes") == b.component_transform("eyes")


def test_component_transform_identity_for_unknown_component() -> None:
    t = _make_resolver(_minimal_style(), {"seed": "unknown"}).component_transform(
        "missing"
    )
    assert t["rotate"] == pytest.approx(0.0, abs=1e-10)
    assert t["translateX"] == pytest.approx(0.0, abs=1e-10)
    assert t["translateY"] == pytest.approx(0.0, abs=1e-10)
    assert t["scale"] == pytest.approx(1.0, abs=1e-10)


def test_root_scale_defaults_to_one() -> None:
    resolver = _make_resolver(_minimal_style(), {"seed": "root-scale"})
    assert resolver.scale() == pytest.approx(1.0, abs=1e-10)


# ---------------------------------------------------------------------------
# probability / visibility
# ---------------------------------------------------------------------------


def test_variant_when_probability_100() -> None:
    resolver = _make_resolver(
        _style_with_components(), {"seed": "visible-test", "eyesProbability": 100}
    )
    assert resolver.variant("eyes") is not None


def test_variant_null_when_probability_0() -> None:
    resolver = _make_resolver(
        _style_with_components(), {"seed": "hidden-test", "eyesProbability": 0}
    )
    assert resolver.variant("eyes") is None


def test_variant_visible_by_default() -> None:
    resolver = _make_resolver(
        _style_with_components(), {"seed": "default-visible-test"}
    )
    assert resolver.variant("eyes") is not None


# ---------------------------------------------------------------------------
# variant constraints
# ---------------------------------------------------------------------------


def test_only_picks_from_style_defined_variants() -> None:
    resolver = _make_resolver(
        _style_with_components(),
        {"seed": "variant-test", "eyesVariant": ["open", "closed", "invalid"]},
    )
    result = resolver.variant("eyes")
    assert result is not None
    assert result in ["open", "closed", "wink"]
    assert result != "invalid"


def test_variant_null_when_no_user_variants_match() -> None:
    resolver = _make_resolver(
        _style_with_components(),
        {"seed": "fallback-test", "eyesVariant": ["invalid1", "invalid2"]},
    )
    assert resolver.variant("eyes") is None


def test_empty_variant_array_yields_null_variant() -> None:
    resolver = _make_resolver(
        _style_with_components(), {"seed": "empty-test", "eyesVariant": []}
    )
    assert resolver.variant("eyes") is None


def test_picks_from_style_variants_when_no_option() -> None:
    resolver = _make_resolver(_style_with_components(), {"seed": "default-test"})
    result = resolver.variant("eyes")
    assert result is not None
    assert result in ["open", "closed", "wink"]


def test_variant_null_when_component_missing() -> None:
    resolver = _make_resolver(
        _minimal_style(), {"seed": "no-component-test", "eyesVariant": "open"}
    )
    assert resolver.variant("eyes") is None


# ---------------------------------------------------------------------------
# color constraints
# ---------------------------------------------------------------------------


def test_contrast_to_sorting() -> None:
    resolver = _make_resolver(
        _style_with_colors(),
        {
            "seed": "contrast-test",
            "skinColor": "#f0c8a0",
            "backgroundColor": ["#ffffff", "#000000", "#cccccc"],
        },
    )
    colors = resolver.color("background")
    assert len(colors) == 1
    assert colors[0] == "#000000"


def test_not_equal_to_filtering() -> None:
    resolver = _make_resolver(
        _style_with_colors(),
        {
            "seed": "not-equal-test",
            "skinColor": "#f0c8a0",
            "hairColor": ["#f0c8a0", "#2c1b18", "#b55239"],
        },
    )
    colors = resolver.color("hair")
    assert len(colors) == 1
    assert colors[0] != "#f0c8a0"


def test_not_equal_to_keeps_all_when_all_would_be_filtered() -> None:
    resolver = _make_resolver(
        _style_with_colors(),
        {"seed": "all-filtered-test", "skinColor": "#f0c8a0", "hairColor": ["#f0c8a0"]},
    )
    colors = resolver.color("hair")
    assert len(colors) == 1
    assert colors[0] == "#f0c8a0"


def test_color_caching() -> None:
    resolver = _make_resolver(
        _style_with_colors(),
        {"seed": "cache-test", "skinColor": ["#f0c8a0", "#d4a574"]},
    )
    assert resolver.color("skin") is resolver.color("skin")


def test_color_without_style_definition() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {"seed": "no-style-test", "customColor": ["#ff0000", "#00ff00"]},
    )
    colors = resolver.color("custom")
    assert len(colors) == 1
    assert colors[0] in ["#ff0000", "#00ff00"]


def test_circular_contrast_to_throws() -> None:
    style = Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "colors": {
                "a": {"values": ["#ff0000", "#00ff00"], "contrastTo": "b"},
                "b": {"values": ["#0000ff", "#ffffff"], "contrastTo": "a"},
            },
        }
    )
    resolver = _make_resolver(
        style,
        {
            "seed": "circular-test",
            "aColor": ["#ff0000", "#00ff00"],
            "bColor": ["#0000ff", "#ffffff"],
        },
    )
    with pytest.raises(CircularColorReferenceError) as exc_info:
        resolver.color("a")
    assert exc_info.value.chain == ["a", "b", "a"]
    assert "a → b → a" in str(exc_info.value)


def test_circular_not_equal_to_throws() -> None:
    style = Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "colors": {
                "a": {"values": ["#ff0000"], "notEqualTo": ["b"]},
                "b": {"values": ["#00ff00"], "notEqualTo": ["a"]},
            },
        }
    )
    resolver = _make_resolver(
        style,
        {
            "seed": "circular-not-equal-test",
            "aColor": ["#ff0000"],
            "bColor": ["#00ff00"],
        },
    )
    with pytest.raises(CircularColorReferenceError) as exc_info:
        resolver.color("a")
    assert exc_info.value.chain == ["a", "b", "a"]
    assert "a → b → a" in str(exc_info.value)


# ---------------------------------------------------------------------------
# resolved
# ---------------------------------------------------------------------------


def test_resolved_includes_consumed_values() -> None:
    resolver = _make_resolver(
        _minimal_style(),
        {"seed": "test", "flip": ["horizontal", "vertical"], "scale": [0.5, 1]},
    )
    resolver.seed()
    resolver.flip()
    resolver.scale()
    resolved = resolver.resolved()
    assert resolved["flip"] in ["horizontal", "vertical", "none"]
    assert isinstance(resolved["scale"], (int, float))


def test_resolved_does_not_include_seed() -> None:
    resolver = _make_resolver(_minimal_style(), {"seed": "test"})
    resolver.seed()
    assert "seed" not in resolver.resolved()


def test_resolved_memoized() -> None:
    resolver = _make_resolver(
        _minimal_style(), {"seed": "test", "flip": ["horizontal", "vertical"]}
    )
    assert resolver.flip() == resolver.flip()


def test_resolved_includes_variant_values() -> None:
    resolver = _make_resolver(
        _style_with_components(), {"seed": "test", "eyesVariant": ["open", "closed"]}
    )
    resolver.variant("eyes")
    resolved = resolver.resolved()
    assert "eyesVariant" in resolved
    assert resolved["eyesVariant"] in ["open", "closed", "wink"]


def test_resolved_includes_color_values() -> None:
    resolver = _make_resolver(
        _style_with_colors(), {"seed": "test", "skinColor": ["#ff0000", "#00ff00"]}
    )
    resolver.color("skin")
    resolved = resolver.resolved()
    assert "skinColor" in resolved
    assert isinstance(resolved["skinColor"], list)


# ---------------------------------------------------------------------------
# variant weights
# ---------------------------------------------------------------------------


def test_weight_zero_never_picked() -> None:
    for i in range(100):
        resolver = _make_resolver(_style_with_weights(), {"seed": f"weight-{i}"})
        assert resolver.variant("eyes") != "hidden"


def test_weight_zero_allowed_when_explicit() -> None:
    resolver = _make_resolver(
        _style_with_weights(), {"seed": "explicit-hidden", "eyesVariant": "hidden"}
    )
    assert resolver.variant("eyes") == "hidden"


def test_higher_weight_favored() -> None:
    common_count = sum(
        1
        for i in range(200)
        if _make_resolver(_style_with_weights(), {"seed": f"favor-{i}"}).variant("eyes")
        == "common"
    )
    assert common_count > 100


def test_object_variant_overrides_weights() -> None:
    for i in range(100):
        resolver = _make_resolver(
            _style_with_weights(),
            {"seed": f"override-{i}", "eyesVariant": {"hidden": 1}},
        )
        assert resolver.variant("eyes") == "hidden"


def test_object_variant_filters_and_weights() -> None:
    for i in range(100):
        resolver = _make_resolver(
            _style_with_weights(),
            {"seed": f"filter-{i}", "eyesVariant": {"common": 1, "rare": 1}},
        )
        assert resolver.variant("eyes") in ["common", "rare"]


def test_all_weights_zero_fallback() -> None:
    style = Style(
        {
            "canvas": {"width": 100, "height": 100, "elements": []},
            "components": {
                "eyes": {
                    "width": 50,
                    "height": 50,
                    "variants": {
                        "a": {"elements": [], "weight": 0},
                        "b": {"elements": [], "weight": 0},
                    },
                }
            },
        }
    )
    resolver = _make_resolver(style, {"seed": "all-zero"})
    assert resolver.variant("eyes") in ["a", "b"]


def test_deterministic_with_weights() -> None:
    a = _make_resolver(_style_with_weights(), {"seed": "deterministic-test"})
    b = _make_resolver(_style_with_weights(), {"seed": "deterministic-test"})
    assert a.variant("eyes") == b.variant("eyes")


# ---------------------------------------------------------------------------
# color_angle
# ---------------------------------------------------------------------------


def test_color_angle_default() -> None:
    resolver = _make_resolver(_minimal_style(), {})
    assert resolver.color_angle("skin") == pytest.approx(0, abs=1e-10)


def test_color_angle_single_value() -> None:
    resolver = _make_resolver(_minimal_style(), {"skinColorAngle": 45})
    assert resolver.color_angle("skin") == pytest.approx(45, abs=1e-10)


def test_color_angle_range() -> None:
    resolver = _make_resolver(
        _minimal_style(), {"seed": "angle-test", "skinColorAngle": [-90, 90]}
    )
    value = resolver.color_angle("skin")
    assert -90 <= value <= 90
