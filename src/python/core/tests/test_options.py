"""Tests for option parsing and normalization."""

from __future__ import annotations

import pytest

from dicebear.errors import OptionsValidationError, ValidationError
from dicebear.options import Options

# ---------------------------------------------------------------------------
# constructor
# ---------------------------------------------------------------------------


def test_accepts_empty_data() -> None:
    assert Options({}) is not None


def test_accepts_none_data() -> None:
    assert Options() is not None


def test_accepts_full_input_data() -> None:
    options = Options(
        {"seed": "test-seed", "size": 128, "flip": "horizontal", "scale": 1.2}
    )
    assert options is not None


def test_throws_options_validation_error() -> None:
    with pytest.raises(OptionsValidationError):
        Options({"size": -1})


def test_throws_validation_error() -> None:
    with pytest.raises(ValidationError):
        Options({"size": -1})


def test_error_includes_details() -> None:
    with pytest.raises(OptionsValidationError) as exc_info:
        Options({"size": -1})
    assert isinstance(exc_info.value.details, list)
    assert len(exc_info.value.details) > 0


# ---------------------------------------------------------------------------
# scalar passthroughs
# ---------------------------------------------------------------------------


def test_scalars_return_none_when_unset() -> None:
    options = Options({})
    assert options.seed() is None
    assert options.size() is None
    assert options.id_randomization() is None
    assert options.title() is None


def test_scalars_return_user_set_values() -> None:
    options = Options(
        {"seed": "abc", "size": 256, "idRandomization": True, "title": "My Avatar"}
    )
    assert options.seed() == "abc"
    assert options.size() == 256
    assert options.id_randomization() is True
    assert options.title() == "My Avatar"


# ---------------------------------------------------------------------------
# top-level normalization
# ---------------------------------------------------------------------------


def test_normalizes_scalar_list_to_one_element_list() -> None:
    assert Options({"flip": "horizontal"}).flip() == ["horizontal"]


def test_passes_list_array_through() -> None:
    assert Options({"flip": ["horizontal", "vertical"]}).flip() == [
        "horizontal",
        "vertical",
    ]


def test_normalizes_scalar_range_to_fixed_value() -> None:
    assert Options({"scale": 1.5}).scale() == {"min": 1.5, "max": 1.5}


def test_normalizes_range_tuple_to_object() -> None:
    assert Options({"scale": [0.8, 1.2]}).scale() == {"min": 0.8, "max": 1.2}


def test_single_element_range_array_is_a_fixed_value() -> None:
    # `[n]` behaves like the scalar `n`; an empty array is unset (default).
    assert Options({"scale": [2]}).scale() == {"min": 2, "max": 2}
    assert Options({"scale": []}).scale() is None


def test_returns_none_for_unset_range_options() -> None:
    options = Options({})
    assert options.scale() is None
    assert options.border_radius() is None
    assert options.rotate() is None
    assert options.translate_x() is None
    assert options.translate_y() is None


def test_returns_empty_array_for_unset_list_options() -> None:
    options = Options({})
    assert options.flip() == []
    assert options.font_family() == []
    assert options.font_weight() == []


# ---------------------------------------------------------------------------
# component_variant
# ---------------------------------------------------------------------------


def test_component_variant_returns_none_when_unset() -> None:
    assert Options({}).component_variant("eyes") is None


def test_component_variant_normalizes_string_to_weighted_map() -> None:
    assert Options({"eyesVariant": "open"}).component_variant("eyes") == {"open": 1}


def test_component_variant_normalizes_list_to_weighted_map() -> None:
    assert Options({"eyesVariant": ["open", "closed"]}).component_variant("eyes") == {
        "open": 1,
        "closed": 1,
    }


def test_component_variant_passes_weighted_record_through() -> None:
    assert Options({"eyesVariant": {"open": 5, "closed": 1}}).component_variant(
        "eyes"
    ) == {"open": 5, "closed": 1}


# ---------------------------------------------------------------------------
# component_probability
# ---------------------------------------------------------------------------


def test_component_probability_returns_none_when_unset() -> None:
    assert Options({}).component_probability("eyes") is None


def test_component_probability_returns_value() -> None:
    assert Options({"eyesProbability": 80}).component_probability("eyes") == 80


# ---------------------------------------------------------------------------
# color
# ---------------------------------------------------------------------------


def test_color_returns_none_when_unset() -> None:
    assert Options({}).color("skin") is None


def test_color_normalizes_single_hex() -> None:
    assert Options({"skinColor": "#f0c8a0"}).color("skin") == ["#f0c8a0"]


def test_color_passes_list_through() -> None:
    assert Options({"skinColor": ["#f0c8a0", "#d4a574"]}).color("skin") == [
        "#f0c8a0",
        "#d4a574",
    ]


# ---------------------------------------------------------------------------
# color_fill / color_angle / color_fill_stops
# ---------------------------------------------------------------------------


def test_color_meta_normalizes() -> None:
    options = Options(
        {
            "skinColorFill": "linear",
            "skinColorAngle": 45,
            "skinColorFillStops": [2, 4],
        }
    )
    assert options.color_fill("skin") == ["linear"]
    assert options.color_angle("skin") == {"min": 45, "max": 45}
    assert options.color_fill_stops("skin") == {"min": 2, "max": 4}


def test_color_meta_defaults_when_unset() -> None:
    options = Options({})
    assert options.color_fill("skin") == []
    assert options.color_angle("skin") is None
    assert options.color_fill_stops("skin") is None
