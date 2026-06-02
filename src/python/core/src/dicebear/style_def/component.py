"""Read-only view over an entry in a style definition's ``components`` block."""

from __future__ import annotations

from typing import Any, cast

from .component_translate import ComponentTranslate
from .component_variant import ComponentVariant


class Component:
    """Read-only view over an entry in a style definition's ``components`` block.

    An entry is either a base component with its own dimensions and variants or
    an alias declared via ``extends``. Aliases are pure references — they inherit
    dimensions, variants, and all transforms from the source.
    """

    def __init__(
        self,
        name: str,
        data: dict[str, Any],
        source: Component | None = None,
    ) -> None:
        self._name = name
        self._data = data
        self._source = source
        self._translate: ComponentTranslate | None = None
        self._variants: dict[str, ComponentVariant] | None = None

    def name(self) -> str:
        """Return the entry's own name as declared in the style definition.

        For aliases this is the alias key, not the source component's name (use
        :meth:`source_name` for the canonical user-option key prefix).
        """
        return self._name

    def extends_name(self) -> str | None:
        """Return the source component name for an alias, or ``None`` for a base."""
        return cast("str | None", self._data.get("extends"))

    def source_name(self) -> str:
        """Return the canonical user-option key prefix.

        The source component's name when this entry is an alias, otherwise the
        entry's own name.
        """
        return self.extends_name() or self._name

    def width(self) -> int | float:
        """Return the component's intrinsic width (the source's, for aliases)."""
        if self._source is not None:
            return self._source.width()

        return cast("int | float", self._data["width"])

    def height(self) -> int | float:
        """Return the component's intrinsic height (the source's, for aliases)."""
        if self._source is not None:
            return self._source.height()

        return cast("int | float", self._data["height"])

    def probability(self) -> int | float:
        """Return the render probability (0–100). Aliases delegate; default 100."""
        if self._source is not None:
            return self._source.probability()

        return cast("int | float", self._data.get("probability", 100))

    def rotate(self) -> dict[str, Any] | None:
        """Return the rotation range, or ``None`` when unset (aliases delegate)."""
        if self._source is not None:
            return self._source.rotate()

        return cast("dict[str, Any] | None", self._data.get("rotate"))

    def scale(self) -> dict[str, Any] | None:
        """Return the scale range, or ``None`` when unset (aliases delegate)."""
        if self._source is not None:
            return self._source.scale()

        return cast("dict[str, Any] | None", self._data.get("scale"))

    def translate(self) -> ComponentTranslate:
        """Return the translate descriptor (aliases delegate to the source)."""
        if self._source is not None:
            return self._source.translate()

        if self._translate is None:
            self._translate = ComponentTranslate(self._data.get("translate", {}))

        return self._translate

    def variants(self) -> dict[str, ComponentVariant]:
        """Return a name → :class:`ComponentVariant` map (aliases delegate)."""
        if self._source is not None:
            return self._source.variants()

        if self._variants is None:
            self._variants = {
                name: ComponentVariant(data)
                for name, data in self._data["variants"].items()
            }

        return self._variants
