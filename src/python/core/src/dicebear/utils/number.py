"""Formats a number for SVG output, rounded to at most 5 decimal places.

Rounding to a fixed precision keeps the output bounded and identical across
the JS, PHP, and Python ports: every value becomes a multiple of 1e-5 in the
SVG coordinate range, which has no exponential form, so the result is built
from integer arithmetic — sidestepping Python's ``repr`` (which would emit
``"1e-05"`` and diverge from the JS reference). Five decimals is far below
sub-pixel precision for any realistic canvas.
"""

from __future__ import annotations

import math


class Number:
    """Formats numbers for SVG output with cross-language byte parity."""

    @staticmethod
    def format(value: float) -> str:
        """Return ``value`` rounded to at most 5 decimal places as a string."""
        if value != value:  # NaN
            return "NaN"

        if value == math.inf:
            return "Infinity"

        if value == -math.inf:
            return "-Infinity"

        scaled = Number.round_half_up(value * 100000)
        sign = "-" if scaled < 0 else ""
        scaled = abs(scaled)

        integer_part = scaled // 100000
        fraction = f"{scaled % 100000:05d}".rstrip("0")

        return f"{sign}{integer_part}{'.' + fraction if fraction else ''}"

    @staticmethod
    def round_half_up(value: float) -> int:
        """Round half toward +Infinity, matching JavaScript's ``Math.round``.

        Python's built-in ``round`` uses banker's rounding (half to even). The
        naive ``floor(value + 0.5)`` also diverges: for the largest double below
        0.5 (``0.49999999999999994``) the addition rounds up to ``1.0`` and
        yields ``1``, whereas ``Math.round`` returns ``0``. Comparing the
        fractional part against ``0.5`` reproduces ``Math.round`` exactly.
        """
        floor = math.floor(value)

        return floor if value - floor < 0.5 else floor + 1
