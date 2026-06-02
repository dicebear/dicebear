"""Key-based pseudorandom number generator and its primitives."""

from __future__ import annotations

import builtins
import math
from collections.abc import Callable, Sequence
from typing import TypeVar

from ..utils.number import Number
from .fnv1a import Fnv1a
from .mulberry32 import Mulberry32

__all__ = ["Fnv1a", "Mulberry32", "Prng"]

T = TypeVar("T")

# The bool() / float() methods below shadow the builtins for the class scope, so
# signature annotations that need the builtin types reference them via builtins.
_Float = builtins.float
_Bool = builtins.bool

Numeric = int | float
Range = dict[str, Numeric]


class Prng:
    """Key-based pseudorandom number generator.

    Each method takes a key that, combined with the seed, produces a
    deterministic value. The same seed + key always yields the same result,
    regardless of call order.
    """

    def __init__(self, seed: str) -> None:
        self._seed = seed

    def pick(self, key: str, items: Sequence[T]) -> T | None:
        """Pick a single item from ``items`` deterministically.

        Returns ``None`` for an empty list. Duplicate values (by string
        representation) are collapsed before picking so that input order and
        duplication do not affect the result.
        """
        if len(items) == 0:
            return None

        if len(items) == 1:
            return items[0]

        unique = _unique_by_code_point(items)

        if len(unique) == 1:
            return unique[0]

        ordered = sorted(unique, key=_code_point_key)
        index = math.floor(self.get_value(key) * len(ordered))

        return ordered[index]

    def weighted_pick(self, key: str, weights: dict[str, Numeric]) -> str | None:
        """Pick a key from ``weights`` proportional to its weight.

        When all weights are zero, falls back to an unweighted :meth:`pick`.
        Returns ``None`` for an empty map.
        """
        if len(weights) == 0:
            return None

        keys = list(weights.keys())

        if len(keys) == 1:
            return str(keys[0])

        keys = sorted(keys, key=_code_point_key)

        # Sum in sorted-key order to match JS reduce-over-sorted parity — float
        # addition is non-associative, so iterating in insertion order would
        # diverge from JS for fractional weights.
        total_weight: float = 0.0
        for k in keys:
            total_weight += weights[k]

        if total_weight == 0.0:
            return self.pick(key, [str(k) for k in keys])

        threshold = self.get_value(key) * total_weight
        cumulative: float = 0

        for k in keys:
            cumulative += weights[k]

            if threshold < cumulative:
                return str(k)

        return str(keys[-1])

    def bool(self, key: str, likelihood: _Float = 50) -> _Bool:
        """Return ``True`` with the given probability (0–100, default 50)."""
        return self.get_value(key) * 100 < likelihood

    def float(self, key: str, range: Range) -> _Float:
        """Return a deterministic float in ``range``, rounded to four decimals.

        With ``range['step'] > 0``, the result is drawn uniformly from
        ``{ min + i*step | 0 <= i <= floor((max - min) / step) }``, so both
        endpoints of an evenly-divisible range are equally likely. Non-positive
        or absent step means continuous. ``min``/``max`` are sorted internally,
        so a reversed pair is tolerated.
        """
        low = min(range["min"], range["max"])
        high = max(range["min"], range["max"])
        step = range.get("step", 0)

        if step > 0:
            buckets = math.floor((high - low) / step) + 1
            i = math.floor(self.get_value(key) * buckets)
            value = low + i * step
        else:
            value = low + self.get_value(key) * (high - low)

        return Number.round_half_up(value * 10000) / 10000

    def integer(self, key: str, range: Range) -> int:
        """Return a deterministic integer in ``range``.

        ``min``/``max`` are sorted internally, so a reversed pair is tolerated.
        ``range['step']`` is accepted for symmetry with :meth:`float` but ignored.
        """
        low = int(min(range["min"], range["max"]))
        high = int(max(range["min"], range["max"]))

        return math.floor(self.get_value(key) * (high - low + 1)) + low

    def shuffle(self, key: str, items: Sequence[T]) -> list[T]:
        """Fisher-Yates shuffle with chained Mulberry32 state.

        Duplicate values (by string representation) are collapsed before
        shuffling, so a caller's slice off the front cannot accidentally produce
        a repeated value.
        """
        if len(items) <= 1:
            return list(items)

        result = sorted(_unique_by_code_point(items), key=_code_point_key)
        prng = Mulberry32(Fnv1a.hash(self._seed + ":" + key))

        for i in range(len(result) - 1, 0, -1):
            j = math.floor(prng.next_float() * (i + 1))
            result[i], result[j] = result[j], result[i]

        return result

    def get_value(self, key: str) -> _Float:
        """Return a single float in ``[0, 1)`` derived from ``seed:key``.

        The same seed/key pair always produces the same value.
        """
        return Mulberry32(Fnv1a.hash(self._seed + ":" + key)).next_float()


def _code_point_key(value: object) -> str:
    """Cross-language deterministic sort key.

    Compare by the string representation's code points, matching JS
    ``String(a) < String(b)`` and PHP ``strcmp`` for the ASCII values sorted in
    practice (variant names, hex colors).
    """
    return str(value)


def _unique_by_code_point(
    items: Sequence[T], key_fn: Callable[[T], str] = str
) -> list[T]:
    """Deduplicate by string representation, keeping the first occurrence."""
    seen: set[str] = set()
    result: list[T] = []

    for item in items:
        repr_ = key_fn(item)

        if repr_ not in seen:
            seen.add(repr_)
            result.append(item)

    return result
