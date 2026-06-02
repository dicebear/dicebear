"""Read-only view over a single render-tree element."""

from __future__ import annotations

from typing import Any, cast


class Element:
    """Read-only view over a single render-tree element from a style definition.

    The same node type covers SVG elements, text, and component references —
    :meth:`type` discriminates between them.
    """

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data
        self._children: list[Element] | None = None

    def type(self) -> str:
        """Return the element type discriminator (``element``, ``text``, …)."""
        return cast(str, self._data["type"])

    def name(self) -> str | None:
        """Return the element's tag/component name, or ``None`` when absent."""
        return cast("str | None", self._data.get("name"))

    def value(self) -> str | dict[str, Any] | None:
        """Return the element's textual value or template fragment, or ``None``."""
        return cast("str | dict[str, Any] | None", self._data.get("value"))

    def attributes(self) -> dict[str, Any] | None:
        """Return the element's raw attribute map, or ``None`` when undefined."""
        return cast("dict[str, Any] | None", self._data.get("attributes"))

    def children(self) -> list[Element]:
        """Return the element's children, lazily wrapped on first access."""
        if self._children is None:
            self._children = [
                Element(child) for child in self._data.get("children", [])
            ]

        return self._children
