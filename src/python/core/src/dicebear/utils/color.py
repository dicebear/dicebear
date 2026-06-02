"""Color helpers used by the renderer and option resolver."""

from __future__ import annotations


class Color:
    """Color helpers used by the renderer and option resolver."""

    @staticmethod
    def to_hex(hex_value: str) -> str:
        """Normalize any hex format to 6- or 8-digit lowercase with ``#`` prefix."""
        normalized = hex_value.lstrip("#").lower()

        if len(normalized) == 3:
            r, g, b = normalized[0], normalized[1], normalized[2]
            return f"#{r}{r}{g}{g}{b}{b}"

        if len(normalized) == 4:
            r, g, b, a = normalized[0], normalized[1], normalized[2], normalized[3]
            return f"#{r}{r}{g}{g}{b}{b}{a}{a}"

        return "#" + normalized

    @staticmethod
    def to_rgb_hex(hex_value: str) -> str:
        """Like :meth:`to_hex`, but strip the alpha channel (always 6-digit)."""
        full = Color.to_hex(hex_value)

        return full[:7] if len(full) > 7 else full

    @staticmethod
    def parse_hex(hex_value: str) -> tuple[int, int, int]:
        """Parse a hex color into an ``(r, g, b)`` triple of 8-bit channels."""
        digits = Color.to_hex(hex_value)[1:]

        return (
            int(digits[0:2], 16),
            int(digits[2:4], 16),
            int(digits[4:6], 16),
        )

    @staticmethod
    def luminance(hex_value: str) -> float:
        """WCAG 2.1 relative luminance with sRGB linearization.

        See https://www.w3.org/WAI/GL/wiki/Relative_luminance
        """
        r, g, b = Color.parse_hex(hex_value)

        return 0.2126 * _linearize(r) + 0.7152 * _linearize(g) + 0.0722 * _linearize(b)

    @staticmethod
    def sort_by_contrast(candidates: list[str], ref_color: str) -> list[str]:
        """Return a new list sorted by descending contrast against ``ref_color``.

        See https://www.w3.org/WAI/GL/wiki/Contrast_ratio
        """
        ref_lum = Color.luminance(ref_color)

        def ratio(color: str) -> float:
            lum = Color.luminance(color)
            return (max(lum, ref_lum) + 0.05) / (min(lum, ref_lum) + 0.05)

        # Stable sort by descending ratio, matching JS/PHP comparator parity:
        # equal ratios keep their original (already code-point-sorted) order.
        return sorted(candidates, key=ratio, reverse=True)

    @staticmethod
    def filter_not_equal_to(candidates: list[str], excluded: list[str]) -> list[str]:
        """Return a new list with excluded colors removed.

        Falls back to the original candidates when filtering would empty the list.
        """
        normalized = {Color.to_rgb_hex(color) for color in excluded}

        filtered = [
            color for color in candidates if Color.to_rgb_hex(color) not in normalized
        ]

        return filtered if len(filtered) > 0 else candidates


def _linearize(channel: int) -> float:
    """Convert an 8-bit sRGB channel value into linear-light space."""
    srgb = channel / 255

    if srgb <= 0.04045:
        return srgb / 12.92

    return float(((srgb + 0.055) / 1.055) ** 2.4)
