"""Minimal XML escaping helper for SVG/XML text and attribute content."""

from __future__ import annotations

_ENTITIES = {
    "&": "&amp;",
    "'": "&apos;",
    '"': "&quot;",
    "<": "&lt;",
    ">": "&gt;",
}

_TABLE = str.maketrans(_ENTITIES)


class Xml:
    """Minimal XML escaping helper for SVG/XML text and attribute content."""

    @staticmethod
    def escape(value: str) -> str:
        """Return ``value`` with the five XML predefined entities escaped."""
        return value.translate(_TABLE)
