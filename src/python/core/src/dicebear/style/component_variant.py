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

    def tags(self) -> list[str]:
        """Return the variant's descriptive tags (e.g. ``hairLength:long``), or
        an empty list when none are authored.

        Consumed by the ``tags`` render option to filter the variant pool.
        """
        return cast("list[str]", self._data.get("tags", []))

    def has_tag(self, category: str, value: str | None = None) -> bool:
        """Test this variant against a single tag-filter token's grammar.

        With no ``value``, it matches a whole category: the bare ``category``
        tag or any ``category:value`` tag. With a ``value``, it matches only the
        exact ``category:value`` tag. The resolver composes these checks into the
        allow/disallow filter structure.
        """
        if value is None:
            prefix = f"{category}:"

            return any(tag == category or tag.startswith(prefix) for tag in self.tags())

        return f"{category}:{value}" in self.tags()
