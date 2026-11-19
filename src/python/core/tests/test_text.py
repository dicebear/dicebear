"""Tests for making user text well-formed."""

from __future__ import annotations

import itertools
import json

from dicebear.options import Options
from dicebear.utils.text import Text

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


def test_options_read_the_replaced_text() -> None:
    options = Options(json.loads('{"seed": "Jo\\ud83d", "title": "\\ude00"}'))

    assert options.seed() == "Jo�"
    assert options.title() == "�"
