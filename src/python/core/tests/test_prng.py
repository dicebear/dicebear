"""Behavioral and edge-case tests for the PRNG.

Known-value vectors (Fnv1a, Mulberry32, get_value) live in
tests/fixtures/parity/ and are exercised by test_parity.py. This file keeps only
the Python-side behavioral and edge-case tests.
"""

from __future__ import annotations

import math

import pytest

from dicebear.prng import Fnv1a, Mulberry32, Prng

# ---------------------------------------------------------------------------
# fnv1a
# ---------------------------------------------------------------------------


def test_fnv1a_produces_different_hashes_for_different_inputs() -> None:
    assert Fnv1a.hash("abc") != Fnv1a.hash("abd")


def test_fnv1a_returns_unsigned_32bit_integers() -> None:
    for value in ["", "a", "hello", "test:flip", "some-long-seed:optionName"]:
        h = Fnv1a.hash(value)
        assert 0 <= h <= 0xFFFFFFFF


def test_fnv1a_hex_pads_to_8_characters() -> None:
    assert len(Fnv1a.hex("test")) == 8


# ---------------------------------------------------------------------------
# mulberry32
# ---------------------------------------------------------------------------


def test_mulberry32_returns_float_in_range() -> None:
    for seed in [0, 1, 42, 2166136261, 4294967295]:
        value = Mulberry32(seed).next_float()
        assert 0 <= value < 1


# ---------------------------------------------------------------------------
# get_value
# ---------------------------------------------------------------------------


def test_get_value_is_deterministic() -> None:
    assert Prng("seed").get_value("key") == Prng("seed").get_value("key")


def test_get_value_differs_for_different_seeds() -> None:
    assert Prng("seed-a").get_value("key") != Prng("seed-b").get_value("key")


def test_get_value_differs_for_different_keys() -> None:
    prng = Prng("test")
    assert prng.get_value("flip") != prng.get_value("scale")


def test_get_value_returns_float_in_range() -> None:
    prng = Prng("test")
    for key in ["a", "b", "flip", "scale", "rotate", "eyesVariant"]:
        value = prng.get_value(key)
        assert 0 <= value < 1


# ---------------------------------------------------------------------------
# pick
# ---------------------------------------------------------------------------


def test_pick_returns_none_for_empty_array() -> None:
    assert Prng("test").pick("key", []) is None


def test_pick_returns_single_item() -> None:
    assert Prng("test").pick("key", ["only"]) == "only"


def test_pick_is_deterministic() -> None:
    items = ["a", "b", "c", "d"]
    assert Prng("test").pick("key", items) == Prng("test").pick("key", items)


def test_pick_always_returns_valid_item() -> None:
    items = ["x", "y", "z"]
    for i in range(50):
        assert Prng(f"seed-{i}").pick("key", items) in items


def test_pick_collapses_duplicate_items() -> None:
    unique = ["a", "b", "c"]
    with_duplicates = ["a", "a", "b", "b", "b", "c"]
    for i in range(50):
        assert Prng(f"seed-{i}").pick("key", unique) == Prng(f"seed-{i}").pick(
            "key", with_duplicates
        )


def test_pick_treats_all_duplicates_as_single_item() -> None:
    assert Prng("test").pick("key", ["only", "only", "only"]) == "only"


# ---------------------------------------------------------------------------
# float
# ---------------------------------------------------------------------------


def test_float_returns_value_when_min_equals_max() -> None:
    assert Prng("test").float("key", {"min": 42, "max": 42}) == pytest.approx(
        42, abs=1e-10
    )


def test_float_interpolates_within_bounds() -> None:
    for i in range(50):
        value = Prng(f"seed-{i}").float("key", {"min": 10, "max": 20})
        assert 10 <= value <= 20


def test_float_handles_reversed_order() -> None:
    value = Prng("test").float("key", {"min": 20, "max": 10})
    assert 10 <= value <= 20


def test_float_quantizes_to_step() -> None:
    for i in range(50):
        value = Prng(f"seed-{i}").float("key", {"min": 0, "max": 100, "step": 5})
        assert 0 <= value <= 100
        assert math.fmod(value, 5) == pytest.approx(0.0, abs=1e-9)


def test_float_ignores_non_positive_step() -> None:
    for i in range(20):
        value = Prng(f"seed-{i}").float("key", {"min": 10, "max": 20, "step": 0})
        assert 10 <= value <= 20


def test_float_step_is_anchored_at_min() -> None:
    for i in range(50):
        value = Prng(f"seed-{i}").float("key", {"min": 3, "max": 23, "step": 5})
        assert 3 <= value <= 23
        assert math.fmod(value - 3, 5) == pytest.approx(0.0, abs=1e-9)


def test_float_reaches_max_endpoint_when_step_divides_range_evenly() -> None:
    max_seen = False
    for i in range(500):
        value = Prng(f"seed-{i}").float("key", {"min": 0, "max": 90, "step": 90})
        assert value == 0.0 or value == 90.0
        if value == 90.0:
            max_seen = True
    assert max_seen


def test_float_is_deterministic() -> None:
    assert Prng("test").float("key", {"min": 0, "max": 100}) == Prng("test").float(
        "key", {"min": 0, "max": 100}
    )


def test_float_rounds_to_four_decimal_places() -> None:
    value = Prng("test").float("scale", {"min": 0, "max": 1})
    decimals = str(value).split(".")[1] if "." in str(value) else ""
    assert len(decimals) <= 4


# ---------------------------------------------------------------------------
# bool
# ---------------------------------------------------------------------------


def test_bool_returns_bool() -> None:
    assert isinstance(Prng("test").bool("key"), bool)


def test_bool_always_true_for_likelihood_100() -> None:
    for i in range(20):
        assert Prng(f"seed-{i}").bool("key", 100) is True


def test_bool_always_false_for_likelihood_0() -> None:
    for i in range(20):
        assert Prng(f"seed-{i}").bool("key", 0) is False


def test_bool_is_deterministic() -> None:
    assert Prng("test").bool("key", 50) == Prng("test").bool("key", 50)


# ---------------------------------------------------------------------------
# integer
# ---------------------------------------------------------------------------


def test_integer_returns_value_when_min_equals_max() -> None:
    assert Prng("test").integer("key", {"min": 5, "max": 5}) == 5


def test_integer_within_bounds() -> None:
    for i in range(50):
        value = Prng(f"seed-{i}").integer("key", {"min": 1, "max": 10})
        assert 1 <= value <= 10
        assert value == math.floor(value)


def test_integer_handles_reversed_order() -> None:
    value = Prng("test").integer("key", {"min": 10, "max": 1})
    assert 1 <= value <= 10


def test_integer_ignores_step() -> None:
    value = Prng("test").integer("key", {"min": 3, "max": 10, "step": 5})
    assert 3 <= value <= 10
    assert value == math.floor(value)


def test_integer_is_deterministic() -> None:
    assert Prng("test").integer("key", {"min": 1, "max": 100}) == Prng("test").integer(
        "key", {"min": 1, "max": 100}
    )


# ---------------------------------------------------------------------------
# shuffle
# ---------------------------------------------------------------------------


def test_shuffle_returns_new_array() -> None:
    items = [1, 2, 3, 4, 5]
    result = Prng("test").shuffle("key", items)
    assert result is not items


def test_shuffle_contains_same_elements() -> None:
    items = [1, 2, 3, 4, 5]
    result = Prng("test").shuffle("key", items)
    assert sorted(result) == sorted(items)


def test_shuffle_does_not_modify_original() -> None:
    items = [1, 2, 3, 4, 5]
    copy_ = list(items)
    Prng("test").shuffle("key", items)
    assert items == copy_


def test_shuffle_is_deterministic() -> None:
    items = list(range(1, 11))
    assert Prng("test").shuffle("key", items) == Prng("test").shuffle("key", items)


def test_shuffle_produces_different_orderings_for_different_keys() -> None:
    items = list(range(1, 11))
    prng = Prng("test")
    assert prng.shuffle("key-a", items) != prng.shuffle("key-b", items)


def test_shuffle_handles_empty_array() -> None:
    assert Prng("test").shuffle("key", []) == []


def test_shuffle_handles_single_element() -> None:
    assert Prng("test").shuffle("key", [42]) == [42]


def test_shuffle_collapses_duplicates() -> None:
    result = Prng("test").shuffle("key", ["a", "a", "b", "b", "c", "c"])
    assert sorted(result) == ["a", "b", "c"]


# ---------------------------------------------------------------------------
# weighted_pick
# ---------------------------------------------------------------------------


def test_weighted_pick_returns_none_for_empty_map() -> None:
    assert Prng("test").weighted_pick("key", {}) is None


def test_weighted_pick_returns_single_key() -> None:
    assert Prng("test").weighted_pick("key", {"only": 1}) == "only"


def test_weighted_pick_falls_back_to_uniform_when_all_weights_zero() -> None:
    result = Prng("test").weighted_pick("key", {"a": 0, "b": 0, "c": 0})
    assert result in ["a", "b", "c"]


def test_weighted_pick_is_deterministic() -> None:
    weights = {"a": 1, "b": 5, "c": 2}
    assert Prng("test").weighted_pick("key", weights) == Prng("test").weighted_pick(
        "key", weights
    )


def test_weighted_pick_never_picks_weight_zero_key() -> None:
    weights = {"rare": 0, "common": 1}
    for i in range(100):
        assert Prng(f"seed-{i}").weighted_pick("key", weights) == "common"


def test_weighted_pick_favors_higher_weighted_keys() -> None:
    weights = {"heavy": 100, "light": 1}
    heavy_count = sum(
        1
        for i in range(200)
        if Prng(f"seed-{i}").weighted_pick("key", weights) == "heavy"
    )
    assert heavy_count > 150


def test_weighted_pick_produces_insertion_order_independent_results() -> None:
    result_a = Prng("test").weighted_pick("key", {"x": 1, "y": 5, "z": 2})
    result_b = Prng("test").weighted_pick("key", {"z": 2, "x": 1, "y": 5})
    assert result_a == result_b


def test_weighted_pick_always_returns_valid_key() -> None:
    weights = {"a": 1, "b": 1, "c": 1}
    for i in range(50):
        assert Prng(f"seed-{i}").weighted_pick("key", weights) in ["a", "b", "c"]
