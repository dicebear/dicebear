"""Builds a descriptor of every option a given style accepts."""

from __future__ import annotations

import copy
from typing import Any

from .style import Style

_ROTATE_RANGE: dict[str, Any] = {"type": "range", "min": -360, "max": 360}
_TRANSLATE_RANGE: dict[str, Any] = {"type": "range", "min": -1000, "max": 1000}


class OptionsDescriptor:
    """Builds a descriptor of every option a given style accepts.

    Tooling such as the editor uses the result to render form controls and
    validation hints without having to introspect the style itself.
    """

    def __init__(self, style: Style) -> None:
        self._style = style
        self._descriptor: dict[str, Any] | None = None

    def to_json(self) -> dict[str, Any]:
        """Return the descriptor, building it lazily on first call.

        Each call returns an independent deep copy so callers can mutate the
        result without affecting the cached descriptor.
        """
        if self._descriptor is None:
            self._descriptor = self._build()

        return copy.deepcopy(self._descriptor)

    def _build(self) -> dict[str, Any]:
        """Walk the style's components and colors and assemble the field map."""
        result: dict[str, Any] = {
            "seed": {"type": "string"},
            "size": {"type": "number", "min": 1, "max": 4096},
            "idRandomization": {"type": "boolean"},
            "title": {"type": "string"},
            "flip": {
                "type": "enum",
                "values": ["none", "horizontal", "vertical", "both"],
                "list": True,
            },
            "fontFamily": {"type": "string", "list": True},
            "fontWeight": {"type": "number", "min": 1, "max": 1000, "list": True},
            "scale": {"type": "range", "min": 0, "max": 10},
            "borderRadius": {"type": "range", "min": 0, "max": 50},
            "rotate": dict(_ROTATE_RANGE),
            "translateX": dict(_TRANSLATE_RANGE),
            "translateY": dict(_TRANSLATE_RANGE),
        }

        for name, component in self._style.components().items():
            if component.extends_name() is not None:
                continue

            variants = sorted(component.variants().keys())

            result[f"{name}Variant"] = {
                "type": "enum",
                "values": variants,
                "list": True,
                "weighted": True,
            }
            result[f"{name}Probability"] = {"type": "number", "min": 0, "max": 100}

        colors = self._style.colors()
        color_names = [*colors.keys(), "background"]

        for name in color_names:
            color_field: dict[str, Any] = {"type": "color", "list": True}
            contrast_to = colors[name].contrast_to() if name in colors else None

            if contrast_to is not None:
                color_field["contrastTo"] = contrast_to

            result[f"{name}Color"] = color_field
            result[f"{name}ColorFill"] = {
                "type": "enum",
                "values": ["solid", "linear", "radial"],
                "list": True,
            }
            result[f"{name}ColorFillStops"] = {"type": "range", "min": 2}
            result[f"{name}ColorAngle"] = dict(_ROTATE_RANGE)

        return result
