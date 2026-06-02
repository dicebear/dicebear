"""Validated, lazily-decomposed wrapper around a style definition."""

from __future__ import annotations

import copy
from typing import Any, cast

from .errors import ErrorDetail, StyleValidationError
from .style_def.canvas import Canvas
from .style_def.color import Color
from .style_def.component import Component
from .style_def.meta import Meta
from .validator import StyleValidator


class Style:
    """Validated, lazily-decomposed wrapper around a style definition.

    Construction runs the JSON Schema validator and stores a deep copy of the
    input so that later mutation of the source object cannot leak into the
    rendered avatar.
    """

    def __init__(self, data: Any) -> None:
        StyleValidator.validate(data)

        self._data: dict[str, Any] = copy.deepcopy(data)
        self._meta: Meta | None = None
        self._canvas: Canvas | None = None
        self._components: dict[str, Component] | None = None
        self._colors: dict[str, Color] | None = None

        self._validate_aliases()

    def id(self) -> str | None:
        """Return the definition's ``$id``, or ``None`` when not set."""
        return cast("str | None", self._data.get("$id"))

    def schema(self) -> str | None:
        """Return the definition's ``$schema`` URI, or ``None`` when not set."""
        return cast("str | None", self._data.get("$schema"))

    def comment(self) -> str | None:
        """Return the definition's ``$comment``, or ``None`` when not set."""
        return cast("str | None", self._data.get("$comment"))

    def meta(self) -> Meta:
        """Return the :class:`Meta` view, lazily constructed on first access."""
        if self._meta is None:
            self._meta = Meta(self._data.get("meta", {}))

        return self._meta

    def attributes(self) -> dict[str, Any]:
        """Return the root SVG attributes, defaulting to an empty dict."""
        return cast("dict[str, Any]", self._data.get("attributes", {}))

    def canvas(self) -> Canvas:
        """Return the :class:`Canvas` view, lazily constructed on first access."""
        if self._canvas is None:
            self._canvas = Canvas(self._data["canvas"])

        return self._canvas

    def components(self) -> dict[str, Component]:
        """Return a name → :class:`Component` map, built lazily on first access."""
        if self._components is not None:
            return self._components

        entries: dict[str, Any] = self._data.get("components", {})
        self._components = {}

        for name, data in entries.items():
            if not self._is_alias(data):
                self._components[name] = Component(name, data)

        for name, data in entries.items():
            if self._is_alias(data):
                self._components[name] = Component(
                    name, data, self._components.get(data["extends"])
                )

        return self._components

    def colors(self) -> dict[str, Color]:
        """Return a name → :class:`Color` map, built lazily on first access."""
        if self._colors is None:
            self._colors = {
                name: Color(data) for name, data in self._data.get("colors", {}).items()
            }

        return self._colors

    def _validate_aliases(self) -> None:
        """Verify every ``extends`` references an existing, non-alias component.

        The schema cannot enforce cross-references between sibling keys.
        """
        components: dict[str, Any] | None = self._data.get("components")

        if components is None:
            return

        errors: list[ErrorDetail] = []

        for name, data in components.items():
            if not self._is_alias(data):
                continue

            target = data["extends"]
            target_data = components.get(target)

            if target_data is None:
                errors.append(
                    {
                        "instancePath": f"/components/{name}/extends",
                        "message": f'references unknown component "{target}"',
                    }
                )

                continue

            if self._is_alias(target_data):
                errors.append(
                    {
                        "instancePath": f"/components/{name}/extends",
                        "message": (
                            f'references alias "{target}" — '
                            "alias chains are not allowed"
                        ),
                    }
                )

        if len(errors) > 0:
            raise StyleValidationError(errors)

    @staticmethod
    def _is_alias(data: dict[str, Any]) -> bool:
        return "extends" in data
