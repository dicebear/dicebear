"""Validated, lazily-decomposed wrapper around a style definition."""

from __future__ import annotations

import copy
import json
from collections.abc import Callable
from typing import Any, cast

from ..errors import ErrorDetail, StyleValidationError
from ..validator import StyleValidator
from .canvas import Canvas
from .color import Color
from .component import Component
from .meta import Meta


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
        self._has_animations: bool | None = None
        self._animation_names: list[str] | None = None

        self._validate_aliases()
        self._validate_animations()

    @classmethod
    def from_json(cls, raw: str) -> Style:
        """Parse and validate a style definition from its raw JSON string.

        The string counterpart to the constructor, for the common case where
        the definition is raw JSON, such as a file shipped by the
        ``dicebear-styles`` package. Raises :class:`json.JSONDecodeError` when
        ``raw`` is not valid JSON, and :class:`StyleValidationError` when the
        decoded value is not a valid style definition. Pass an already-decoded
        ``dict`` to the constructor instead.
        """
        return cls(json.loads(raw))

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

    def has_animations(self) -> bool:
        """Return whether any element in the definition carries declarative
        animations.

        Computed once and cached. Consumed by the options descriptor to
        advertise the ``animation`` options only where they have an effect.
        """
        if self._has_animations is None:
            found = False

            def visit(element: dict[str, Any], _path: str) -> None:
                nonlocal found

                if len(element.get("animations", [])) > 0:
                    found = True

            self._visit_elements(visit)
            self._has_animations = found

        return self._has_animations

    def animation_names(self) -> list[str]:
        """Return the sorted distinct names of the definition's animation
        timelines.

        Computed once and cached. The options descriptor advertises a switch,
        a speed and a delay option per name, and the renderer hashes every
        name's state into the animation class names. Sorted so every
        implementation reports the same order regardless of how it walks the
        definition.
        """
        if self._animation_names is None:
            names: set[str] = set()

            def visit(element: dict[str, Any], _path: str) -> None:
                for animation in element.get("animations", []):
                    name = animation.get("name")

                    if name is not None:
                        names.add(name)

            self._visit_elements(visit)
            self._animation_names = sorted(names)

        return self._animation_names

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

    def _validate_animations(self) -> None:
        """Verify every animation track lists its keyframes in strictly
        ascending ``at`` order.

        The schema cannot express ordering between array items. Step jumps are
        expressed with the ``hold`` easing rather than duplicate positions.
        """
        errors: list[ErrorDetail] = []

        def visit(element: dict[str, Any], path: str) -> None:
            for animation_index, animation in enumerate(element.get("animations", [])):
                for track_name, track in animation["tracks"].items():
                    keyframes = track["keyframes"]

                    for i in range(1, len(keyframes)):
                        if keyframes[i]["at"] <= keyframes[i - 1]["at"]:
                            errors.append(
                                {
                                    "instancePath": (
                                        f"{path}/animations/{animation_index}"
                                        f"/tracks/{track_name}/keyframes/{i}/at"
                                    ),
                                    "message": (
                                        "must be greater than the previous keyframe"
                                    ),
                                }
                            )

        self._visit_elements(visit)

        if len(errors) > 0:
            raise StyleValidationError(errors)

    def _visit_elements(self, visit: Callable[[dict[str, Any], str], None]) -> None:
        """Walk every element in the definition — the canvas tree and every
        component variant tree — and invoke ``visit`` with the element and its
        JSON pointer path.
        """

        def walk(elements: list[dict[str, Any]], path: str) -> None:
            for index, element in enumerate(elements):
                element_path = f"{path}/{index}"

                visit(element, element_path)
                walk(element.get("children", []), f"{element_path}/children")

        walk(self._data["canvas"]["elements"], "/canvas/elements")

        for name, component in self._data.get("components", {}).items():
            if self._is_alias(component):
                continue

            for variant_name, variant in component["variants"].items():
                walk(
                    variant["elements"],
                    f"/components/{name}/variants/{variant_name}/elements",
                )

    @staticmethod
    def _is_alias(data: dict[str, Any]) -> bool:
        return "extends" in data
