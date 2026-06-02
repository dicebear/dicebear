"""Read-only view over the ``meta.source`` block of a style definition."""

from __future__ import annotations

from typing import Any, cast


class MetaSource:
    """Read-only view over the ``meta.source`` block of a style definition."""

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data

    def name(self) -> str | None:
        """Return the source name (e.g. the original work title), or ``None``."""
        return cast("str | None", self._data.get("name"))

    def url(self) -> str | None:
        """Return the URL of the source, or ``None`` when not set."""
        return cast("str | None", self._data.get("url"))
