"""Read-only view over the ``meta.creator`` block of a style definition."""

from __future__ import annotations

from typing import Any, cast


class MetaCreator:
    """Read-only view over the ``meta.creator`` block of a style definition."""

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data

    def name(self) -> str | None:
        """Return the creator's display name, or ``None`` when not set."""
        return cast("str | None", self._data.get("name"))

    def url(self) -> str | None:
        """Return the creator's homepage URL, or ``None`` when not set."""
        return cast("str | None", self._data.get("url"))
