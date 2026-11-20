"""Tests for making user text well-formed."""

from __future__ import annotations

import itertools
import json
from typing import Any

import pytest

from dicebear.errors import OptionsValidationError
from dicebear.options import Options
from dicebear.utils.text import MAX_DEPTH, Text

HIGH = "\ud83d"
LOW = "\ude00"
EMOJI = "\U0001f600"


def test_leaves_well_formed_text_as_it_is() -> None:
    for value in ["", "abc", "Zoë", EMOJI, "a" + EMOJI + "b"]:
        assert Text.well_formed(value) == value


def test_replaces_a_lone_high_or_low_surrogate() -> None:
    assert Text.well_formed(HIGH) == "�"
    assert Text.well_formed(LOW) == "�"
    assert Text.well_formed("Jo" + HIGH) == "Jo�"
    assert Text.well_formed(LOW + "Ann") == "�Ann"


def test_replaces_both_halves_of_a_reversed_pair() -> None:
    assert Text.well_formed(LOW + HIGH) == "��"


def test_joins_a_pair_of_surrogate_code_points() -> None:
    # The same two code units a JS string holds for the emoji.
    assert Text.well_formed(HIGH + LOW) == EMOJI
    assert Text.well_formed(HIGH + HIGH + LOW) == "�" + EMOJI


def test_matches_utf16_decoding_with_replacement() -> None:
    # Python's own UTF-16 decoder replaces each lone surrogate with U+FFFD and
    # keeps valid pairs, like JS toWellFormed.
    units = ["a", "\ud800", "\udbff", "\udc00", "\udfff", HIGH, LOW]

    for combo in itertools.product(units, repeat=3):
        value = "".join(combo)
        expected = value.encode("utf-16-le", "surrogatepass").decode(
            "utf-16-le", "replace"
        )
        assert Text.well_formed(value) == expected, repr(value)


def test_well_formed_deep_covers_keys_values_and_items() -> None:
    value = {"k" + HIGH: ["a" + LOW, {"x": HIGH}], "n": 1, "b": True}

    assert Text.well_formed_deep(value) == {
        "k�": ["a�", {"x": "�"}],
        "n": 1,
        "b": True,
    }


def test_well_formed_deep_leaves_the_input_untouched() -> None:
    value = {"seed": HIGH, "list": [LOW]}

    Text.well_formed_deep(value)

    assert value == {"seed": HIGH, "list": [LOW]}


def _nest(levels: int, leaf: Any) -> Any:
    value = leaf

    for _ in range(levels):
        value = [value]

    return value


def _holds_a_surrogate(value: Any) -> bool:
    while isinstance(value, (dict, list)):
        value = next(iter(value.values())) if isinstance(value, dict) else value[0]

    return value == HIGH


def test_well_formed_deep_passes_through_what_nests_deeper_than_max_depth() -> None:
    # The string sits in the innermost list, one level below the root.
    reached = Text.well_formed_deep({"seed": _nest(MAX_DEPTH - 1, HIGH)})
    too_deep = Text.well_formed_deep({"seed": _nest(MAX_DEPTH, HIGH)})

    assert not _holds_a_surrogate(reached)
    assert _holds_a_surrogate(too_deep)


def test_well_formed_deep_stops_at_a_value_that_contains_itself() -> None:
    value: dict[str, Any] = {"seed": HIGH, "list": [LOW]}
    value["a"] = value
    value["b"] = value
    value["list"] += [value["list"], value["list"]]

    result = Text.well_formed_deep(value)

    assert result["seed"] == "\ufffd"
    assert result["list"][0] == "\ufffd"
    assert result["a"] is value
    assert result["list"][1] is value["list"]


def test_well_formed_deep_walks_a_value_that_appears_twice_both_times() -> None:
    shared = [HIGH]

    assert Text.well_formed_deep({"x": shared, "y": shared}) == {
        "x": ["\ufffd"],
        "y": ["\ufffd"],
    }


def test_options_turn_down_deep_nesting_as_invalid_options() -> None:
    with pytest.raises(OptionsValidationError):
        Options({"seed": _nest(5000, "x")})


def test_options_turn_down_a_value_that_contains_itself_as_invalid_options() -> None:
    value: dict[str, Any] = {"seed": "x"}
    value["a"] = value
    value["b"] = value

    with pytest.raises(OptionsValidationError):
        Options(value)


def test_options_read_the_replaced_text() -> None:
    options = Options(json.loads('{"seed": "Jo\\ud83d", "title": "\\ude00"}'))

    assert options.seed() == "Jo�"
    assert options.title() == "�"
