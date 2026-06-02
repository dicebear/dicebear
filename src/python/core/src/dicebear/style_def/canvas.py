"""Read-only view over a style definition's ``canvas`` block."""

from __future__ import annotations

from typing import Any, cast

from .element import Element


class Canvas:
    """Read-only view over a style definition's ``canvas`` block.

    Exposes the drawing-area dimensions and the top-level element list.
    """

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data
        self._elements: list[Element] | None = None

    def width(self) -> int | float:
        """Return the canvas width — the viewBox ``width``."""
        return cast("int | float", self._data["width"])

    def height(self) -> int | float:
        """Return the canvas height — the viewBox ``height``."""
        return cast("int | float", self._data["height"])

    def elements(self) -> list[Element]:
        """Return the top-level elements, lazily wrapped on first access."""
        if self._elements is None:
            self._elements = [Element(el) for el in self._data["elements"]]

        return self._elements
