"""User-supplied option parsing and normalization."""

from __future__ import annotations

import copy
from typing import Any, cast

from .validator import OptionsValidator

Numeric = int | float
Range = dict[str, Numeric]


class Options:
    """Validates raw user options and exposes them through typed accessors.

    Each accessor returns the user's input in a normalized form (always a list
    for options that accept either a scalar or a list, or ``None`` when the
    option is not set), so consumers — chiefly :class:`Resolver` — never have to
    do their own normalization.

    Resolution against the style definition and the PRNG happens in
    :class:`Resolver`; this class is purely about reading user input.
    """

    def __init__(self, data: dict[str, Any] | None = None) -> None:
        data = data if data is not None else {}
        OptionsValidator.validate(data)

        # Deep-copy so later caller mutations cannot leak into resolution,
        # mirroring the JS core's structuredClone and Style's deep copy.
        self._data = copy.deepcopy(data)

    def seed(self) -> str | None:
        return cast("str | None", self._data.get("seed"))

    def size(self) -> int | None:
        return cast("int | None", self._data.get("size"))

    def id_randomization(self) -> bool | None:
        return cast("bool | None", self._data.get("idRandomization"))

    def title(self) -> str | None:
        return cast("str | None", self._data.get("title"))

    def flip(self) -> list[str]:
        return self._as_array(self._data.get("flip"))

    def font_family(self) -> list[str]:
        return self._as_array(self._data.get("fontFamily"))

    def font_weight(self) -> list[Numeric]:
        return self._as_array(self._data.get("fontWeight"))

    def scale(self) -> Range | None:
        return self._to_range(self._data.get("scale"))

    def border_radius(self) -> Range | None:
        return self._to_range(self._data.get("borderRadius"))

    def rotate(self) -> Range | None:
        return self._to_range(self._data.get("rotate"))

    def translate_x(self) -> Range | None:
        return self._to_range(self._data.get("translateX"))

    def translate_y(self) -> Range | None:
        return self._to_range(self._data.get("translateY"))

    def component_variant(self, name: str) -> dict[str, Numeric] | None:
        """Return the variant constraint for ``name`` as a weighted map, or
        ``None`` when ``{name}Variant`` is unset.

        A bare string or string list is normalized to a map weighted ``1`` each.
        """
        raw = self._data.get(name + "Variant")

        if raw is None:
            return None

        if isinstance(raw, str):
            return {raw: 1}

        if isinstance(raw, list):
            return dict.fromkeys(raw, 1)

        return cast("dict[str, Numeric]", raw)

    def component_probability(self, name: str) -> Numeric | None:
        return cast("Numeric | None", self._data.get(name + "Probability"))

    def color(self, name: str) -> list[str] | None:
        """Return ``None`` (not ``[]``) when ``{name}Color`` is unset so the
        resolver can fall back to the style definition's color values.
        """
        raw = self._data.get(name + "Color")

        return None if raw is None else self._as_array(raw)

    def color_fill(self, name: str) -> list[str]:
        return self._as_array(self._data.get(name + "ColorFill"))

    def color_angle(self, name: str) -> Range | None:
        return self._to_range(self._data.get(name + "ColorAngle"))

    def color_fill_stops(self, name: str) -> Range | None:
        return self._to_range(self._data.get(name + "ColorFillStops"))

    @staticmethod
    def _as_array(value: Any) -> list[Any]:
        if value is None:
            return []

        return value if isinstance(value, list) else [value]

    @staticmethod
    def _to_range(value: Any) -> Range | None:
        """Normalize a range option (bare number, ``[n]``, ``[min, max]``, or
        ``None``).

        A bare number ``n`` — or a single-element array ``[n]`` — becomes
        ``{'min': n, 'max': n}`` (a fixed value). An array's smaller/larger
        element is taken as min/max. An empty array is treated as unset
        (``None``), so the resolver applies the option's default.
        """
        if value is None:
            return None

        if isinstance(value, bool):
            return None

        if isinstance(value, (int, float)):
            return {"min": value, "max": value}

        if isinstance(value, list) and len(value) > 0:
            return {"min": min(value), "max": max(value)}

        return None
