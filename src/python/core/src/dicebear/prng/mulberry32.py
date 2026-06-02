"""Mulberry32 PRNG."""

from __future__ import annotations

_UINT32_MAX_PLUS_1 = 2**32


class Mulberry32:
    """Mulberry32 PRNG — stateful, matching the C reference by Tommy Ettinger.

    C original::

        uint32_t z = (x += 0x6D2B79F5UL);
        z = (z ^ (z >> 15)) * (z | 1UL);
        z ^= z + (z ^ (z >> 7)) * (z | 61UL);
        return z ^ (z >> 14);

    All arithmetic is unsigned 32-bit. Python ints are arbitrary precision, so
    every operation is masked with ``& 0xFFFFFFFF`` to emulate JS ``Math.imul``
    / ``>>>`` and keep parity with the JS reference.

    See https://gist.github.com/tommyettinger/46a874533244883189143505d203312c
    """

    def __init__(self, seed: int = 0) -> None:
        self._state = seed & 0xFFFFFFFF

    def next(self) -> int:
        """Advance the state and return the next unsigned 32-bit value."""
        z = (self._state + 0x6D2B79F5) & 0xFFFFFFFF
        self._state = z

        z = _mul(z ^ (z >> 15), z | 1)
        z ^= _add(z, _mul(z ^ (z >> 7), z | 61))

        return (z ^ (z >> 14)) & 0xFFFFFFFF

    def next_float(self) -> float:
        """Advance the state and return the next value in ``[0, 1)``."""
        return self.next() / _UINT32_MAX_PLUS_1

    def state(self) -> int:
        """Return the current state as a signed 32-bit value (for JS compat)."""
        if self._state >= 0x80000000:
            return self._state - _UINT32_MAX_PLUS_1

        return self._state


def _mul(a: int, b: int) -> int:
    """Unsigned 32-bit multiply (low 32 bits), matching JS ``Math.imul``."""
    return (a * b) & 0xFFFFFFFF


def _add(a: int, b: int) -> int:
    """Unsigned 32-bit add."""
    return (a + b) & 0xFFFFFFFF
