"""Tests for the Avatar entry point."""

from __future__ import annotations

from typing import Any

from dicebear import Avatar, Style


def _minimal_style_data() -> dict[str, Any]:
    return {"canvas": {"width": 100, "height": 100, "elements": []}}


# ---------------------------------------------------------------------------
# constructor
# ---------------------------------------------------------------------------


def test_accepts_style_instance_and_raw_options() -> None:
    style = Style(_minimal_style_data())
    assert isinstance(Avatar(style, {"seed": "test"}), Avatar)


def test_accepts_raw_style_data() -> None:
    assert isinstance(Avatar(_minimal_style_data()), Avatar)


def test_accepts_raw_style_data_and_raw_options() -> None:
    assert isinstance(Avatar(_minimal_style_data(), {"seed": "test"}), Avatar)


def test_works_without_options() -> None:
    style = Style(_minimal_style_data())
    assert isinstance(Avatar(style), Avatar)


# ---------------------------------------------------------------------------
# to_string
# ---------------------------------------------------------------------------


def test_to_string_returns_string() -> None:
    style = Style(_minimal_style_data())
    assert isinstance(Avatar(style, {"seed": "test"}).to_string(), str)


def test_str_matches_to_string() -> None:
    style = Style(_minimal_style_data())
    avatar = Avatar(style, {"seed": "test"})
    assert str(avatar) == avatar.to_string()


# ---------------------------------------------------------------------------
# to_json
# ---------------------------------------------------------------------------


def test_to_json_returns_object_with_svg_and_options() -> None:
    style = Style(_minimal_style_data())
    result = Avatar(style, {"seed": "test"}).to_json()
    assert isinstance(result["svg"], str)
    assert isinstance(result["options"], dict)


def test_to_json_consistent_with_to_string() -> None:
    style = Style(_minimal_style_data())
    avatar = Avatar(style, {"seed": "test"})
    assert avatar.to_json()["svg"] == avatar.to_string()


def test_to_json_returns_deep_copy_of_options() -> None:
    style = Style(_minimal_style_data())
    avatar = Avatar(style, {"seed": "test"})
    json1 = avatar.to_json()
    json2 = avatar.to_json()
    json1["options"]["injected"] = "modified"
    assert "injected" not in json2["options"]


def test_to_json_does_not_include_seed() -> None:
    style = Style(_minimal_style_data())
    avatar = Avatar(style, {"seed": "test"})
    assert "seed" not in avatar.to_json()["options"]


# ---------------------------------------------------------------------------
# to_data_uri
# ---------------------------------------------------------------------------


def test_to_data_uri_returns_data_uri() -> None:
    style = Style(_minimal_style_data())
    assert (
        Avatar(style, {"seed": "test"})
        .to_data_uri()
        .startswith("data:image/svg+xml;charset=utf-8,")
    )


def test_to_data_uri_encodes_like_encodeuricomponent() -> None:
    # Independent of the implementation's quote() call: assert the actual
    # encodeURIComponent semantics the JS/PHP ports also produce, so a
    # regression (e.g. to quote_plus, or a wrong safe set) fails here.
    style = Style(_minimal_style_data())
    avatar = Avatar(style, {"seed": "test"})
    svg = avatar.to_string()
    prefix = "data:image/svg+xml;charset=utf-8,"
    payload = avatar.to_data_uri().removeprefix(prefix)

    # Structural XML characters must be percent-encoded, none left raw.
    assert "%3C" in payload and "%3E" in payload  # < >
    assert "%22" in payload  # "
    assert not any(c in payload for c in '<>"')
    # Spaces become %20 (never '+'); '#' (from url(#clip-…)) becomes %23.
    assert " " in svg and "%20" in payload and "+" not in payload
    assert "%23" in payload and "#" not in payload
    # encodeURIComponent leaves these unescaped; quote() must match.
    assert "(" in payload and ")" in payload and "%28" not in payload
