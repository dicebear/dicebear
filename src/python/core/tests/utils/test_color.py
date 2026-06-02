"""Tests for the color utility helpers."""

from __future__ import annotations

from dicebear.utils.color import Color

# ---------------------------------------------------------------------------
# to_rgb_hex
# ---------------------------------------------------------------------------


def test_to_rgb_hex_normalizes_6_digit() -> None:
    assert Color.to_rgb_hex("#ff0000") == "#ff0000"


def test_to_rgb_hex_normalizes_3_digit() -> None:
    assert Color.to_rgb_hex("#f00") == "#ff0000"


def test_to_rgb_hex_strips_alpha_4_digit() -> None:
    assert Color.to_rgb_hex("#f008") == "#ff0000"


def test_to_rgb_hex_strips_alpha_8_digit() -> None:
    assert Color.to_rgb_hex("#ff000080") == "#ff0000"


def test_to_rgb_hex_lowercases() -> None:
    assert Color.to_rgb_hex("#FF0000") == "#ff0000"
    assert Color.to_rgb_hex("#F00") == "#ff0000"


def test_to_rgb_hex_handles_missing_prefix() -> None:
    assert Color.to_rgb_hex("ff0000") == "#ff0000"
    assert Color.to_rgb_hex("f00") == "#ff0000"


# ---------------------------------------------------------------------------
# parse_hex
# ---------------------------------------------------------------------------


def test_parse_hex_6_digit() -> None:
    assert Color.parse_hex("#ff0000") == (255, 0, 0)
    assert Color.parse_hex("#00ff00") == (0, 255, 0)
    assert Color.parse_hex("#0000ff") == (0, 0, 255)


def test_parse_hex_3_digit() -> None:
    assert Color.parse_hex("#f00") == (255, 0, 0)
    assert Color.parse_hex("#fff") == (255, 255, 255)


def test_parse_hex_4_digit() -> None:
    assert Color.parse_hex("#f008") == (255, 0, 0)


def test_parse_hex_8_digit() -> None:
    assert Color.parse_hex("#ff000080") == (255, 0, 0)


def test_parse_hex_case_insensitive() -> None:
    assert Color.parse_hex("#FF0000") == (255, 0, 0)


# ---------------------------------------------------------------------------
# luminance
# ---------------------------------------------------------------------------


def test_luminance_black_is_zero() -> None:
    assert Color.luminance("#000000") == 0.0


def test_luminance_white_is_one() -> None:
    assert Color.luminance("#ffffff") == 1.0


def test_luminance_mid_gray() -> None:
    lum = Color.luminance("#808080")
    assert 0.2 < lum < 0.25


def test_luminance_3_digit_hex() -> None:
    assert Color.luminance("#000") == 0.0
    assert Color.luminance("#fff") == 1.0


# ---------------------------------------------------------------------------
# sort_by_contrast
# ---------------------------------------------------------------------------


def test_sort_by_contrast_descending() -> None:
    result = Color.sort_by_contrast(["#ffffff", "#808080", "#000000"], "#ffffff")
    assert result[0] == "#000000"
    assert result[2] == "#ffffff"


def test_sort_by_contrast_colored_reference() -> None:
    result = Color.sort_by_contrast(["#000000", "#ffffff"], "#f0c8a0")
    assert result[0] == "#000000"


def test_sort_by_contrast_preserves_length() -> None:
    result = Color.sort_by_contrast(["#ff0000", "#00ff00", "#0000ff"], "#ffffff")
    assert len(result) == 3


# ---------------------------------------------------------------------------
# filter_not_equal_to
# ---------------------------------------------------------------------------


def test_filter_exact_matches() -> None:
    result = Color.filter_not_equal_to(["#ff0000", "#00ff00", "#0000ff"], ["#ff0000"])
    assert result == ["#00ff00", "#0000ff"]


def test_filter_case_insensitive() -> None:
    result = Color.filter_not_equal_to(["#ff0000", "#00ff00"], ["#FF0000"])
    assert result == ["#00ff00"]


def test_filter_matches_short_and_long_hex() -> None:
    result = Color.filter_not_equal_to(["#ff0000", "#00ff00"], ["#f00"])
    assert result == ["#00ff00"]


def test_filter_keeps_all_when_would_empty() -> None:
    result = Color.filter_not_equal_to(["#ff0000"], ["#ff0000"])
    assert result == ["#ff0000"]


def test_filter_multiple_exclusions() -> None:
    result = Color.filter_not_equal_to(
        ["#ff0000", "#00ff00", "#0000ff"], ["#ff0000", "#0000ff"]
    )
    assert result == ["#00ff00"]
