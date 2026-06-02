"""Read-only view over an entry in a component's ``variants`` block."""

from __future__ import annotations

from typing import Any, cast

from .element import Element


class ComponentVariant:
    """Read-only view over an entry in a component's ``variants`` block."""

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data
        self._elements: list[Element] | None = None

    def elements(self) -> list[Element]:
        """Return the variant's elements, lazily wrapped on first access."""
        if self._elements is None:
            self._elements = [Element(el) for el in self._data["elements"]]

        return self._elements

    def weight(self) -> int | float:
        """Return the weighted-pick weight for this variant, defaulting to ``1``."""
        return cast("int | float", self._data.get("weight", 1))
