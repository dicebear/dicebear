"""Read-only view over an entry in a style definition's ``colors`` block."""

from __future__ import annotations

from typing import Any, cast


class Color:
    """Read-only view over an entry in a style definition's ``colors`` block."""

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data

    def values(self) -> list[str]:
        """Return the candidate color values, in definition order."""
        return cast("list[str]", self._data["values"])

    def not_equal_to(self) -> list[str]:
        """Return colors the resolver should avoid picking (empty when unset)."""
        return cast("list[str]", self._data.get("notEqualTo", []))

    def contrast_to(self) -> str | None:
        """Return the name of a color to contrast against, or ``None``."""
        return cast("str | None", self._data.get("contrastTo"))
