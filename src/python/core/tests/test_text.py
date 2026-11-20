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


def test_options_read_the_seed_and_the_title_with_lone_surrogates_replaced() -> None:
    options = Options(json.loads('{"seed": "Jo\\ud83d", "title": "\\ude00"}'))

    assert options.seed() == "Jo\ufffd"
    assert options.title() == "\ufffd"


def test_options_leave_a_well_formed_seed_and_title_as_they_are() -> None:
    options = Options({"seed": "Jo\U0001f600", "title": "Zoë"})

    assert options.seed() == "Jo\U0001f600"
    assert options.title() == "Zoë"


def test_options_read_an_absent_seed_and_title_as_absent() -> None:
    options = Options({})

    assert options.seed() is None
    assert options.title() is None


def test_options_do_not_change_what_they_were_given() -> None:
    value = {"seed": HIGH}

    Options(value).seed()

    assert value == {"seed": HIGH}
