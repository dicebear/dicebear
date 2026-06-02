"""Read-only view over the ``meta.license`` block of a style definition."""

from __future__ import annotations

from typing import Any, cast


class MetaLicense:
    """Read-only view over the ``meta.license`` block of a style definition."""

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data

    def name(self) -> str | None:
        """Return the license name (e.g. ``"CC BY 4.0"``), or ``None``."""
        return cast("str | None", self._data.get("name"))

    def url(self) -> str | None:
        """Return the license URL, or ``None`` when not set."""
        return cast("str | None", self._data.get("url"))

    def text(self) -> str | None:
        """Return the full license text, or ``None`` when not set."""
        return cast("str | None", self._data.get("text"))
