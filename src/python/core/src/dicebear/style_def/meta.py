"""Lazily-constructed view over a style definition's ``meta`` block."""

from __future__ import annotations

from typing import Any

from .meta_creator import MetaCreator
from .meta_license import MetaLicense
from .meta_source import MetaSource


class Meta:
    """Lazily-constructed view over a style definition's ``meta`` block.

    Exposes the license, creator, and source descriptors.
    """

    def __init__(self, data: dict[str, Any]) -> None:
        self._data = data
        self._license: MetaLicense | None = None
        self._creator: MetaCreator | None = None
        self._source: MetaSource | None = None

    def license(self) -> MetaLicense:
        """Return the license descriptor, defaulting to an empty object."""
        if self._license is None:
            self._license = MetaLicense(self._data.get("license", {}))

        return self._license

    def creator(self) -> MetaCreator:
        """Return the creator descriptor, defaulting to an empty object."""
        if self._creator is None:
            self._creator = MetaCreator(self._data.get("creator", {}))

        return self._creator

    def source(self) -> MetaSource:
        """Return the source descriptor, defaulting to an empty object."""
        if self._source is None:
            self._source = MetaSource(self._data.get("source", {}))

        return self._source
