"""Read-only view over a component's ``translate`` block."""

from __future__ import annotations

from typing import Any, cast


class ComponentTranslate:
    """Read-only view over a component's ``translate`` block (X/Y offset ranges)."""

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data

    def x(self) -> dict[str, Any] | None:
        """Return the X offset range, or ``None`` when unset."""
        return cast("dict[str, Any] | None", self._data.get("x"))

    def y(self) -> dict[str, Any] | None:
        """Return the Y offset range, or ``None`` when unset."""
        return cast("dict[str, Any] | None", self._data.get("y"))
