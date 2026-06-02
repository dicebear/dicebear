"""Deterministic resolution of options against a style, with memoization."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any, TypeVar, cast

from .errors import CircularColorReferenceError
from .options import Options, Range
from .prng import Prng
from .style import Style
from .style_def.component import Component
from .utils.color import Color as ColorUtil

T = TypeVar("T")


class Resolver:
    """Bundles the :class:`Style`, validated :class:`Options`, and a seeded
    :class:`Prng`, exposing them as memoized named accessors.

    The memo also serves as the informational snapshot returned by
    :meth:`resolved` — every value the resolver picks during one resolution
    lands there, except for the raw seed.
    """

    def __init__(self, style: Style, options: Options) -> None:
        self._style = style
        self._options = options
        self._prng = Prng(self.seed())
        self._color_resolving: list[str] = []
        self._result: dict[str, Any] = {}

    def seed(self) -> str:
        # Deliberately not memoized — the seed is the only input kept out of the
        # resolved() snapshot, so a serialized avatar never leaks it.
        return self._options.seed() or ""

    def size(self) -> int | None:
        return self._memo("size", self._options.size)

    def id_randomization(self) -> bool:
        return self._memo(
            "idRandomization", lambda: self._options.id_randomization() or False
        )

    def title(self) -> str | None:
        return self._memo("title", self._options.title)

    def flip(self) -> str:
        return self._memo(
            "flip", lambda: self._prng.pick("flip", self._options.flip()) or "none"
        )

    def font_family(self) -> str:
        return self._memo(
            "fontFamily",
            lambda: (
                self._prng.pick("fontFamily", self._options.font_family())
                or "system-ui"
            ),
        )

    def font_weight(self) -> int | float:
        return self._memo(
            "fontWeight",
            lambda: self._prng.pick("fontWeight", self._options.font_weight()) or 400,
        )

    def scale(self) -> float:
        return self._memo_float("scale", self._options.scale(), 1.0)

    def border_radius(self) -> float:
        return self._memo_float("borderRadius", self._options.border_radius(), 0.0)

    def rotate(self) -> float:
        return self._memo_float("rotate", self._options.rotate(), 0.0)

    def translate_x(self) -> float:
        return self._memo_float("translateX", self._options.translate_x(), 0.0)

    def translate_y(self) -> float:
        return self._memo_float("translateY", self._options.translate_y(), 0.0)

    def variant(self, name: str) -> str | None:
        """Select a variant for the given component.

        With ``{name}Variant`` unset the PRNG picks from all style variants by
        weight; otherwise it picks using the user-supplied weighted map. Only
        variants that exist in the style definition are considered.
        """
        return self._memo(f"{name}Variant", lambda: self._resolve_variant(name))

    def _resolve_variant(self, name: str) -> str | None:
        component = self._style.components().get(name)

        if component is None or not self._is_visible(name, component):
            return None

        raw = self._options.component_variant(component.source_name())
        variants = component.variants()
        weights: dict[str, int | float] = {}

        if raw is None:
            for v, variant in variants.items():
                weights[v] = variant.weight()
        else:
            for v, weight in raw.items():
                if v in variants:
                    weights[v] = weight

        return self._prng.weighted_pick(f"{name}Variant", weights)

    def color(self, name: str) -> list[str]:
        return self._memo(f"{name}Color", lambda: self._resolve_color(name))

    def color_fill(self, name: str) -> str:
        return self._memo(
            f"{name}ColorFill",
            lambda: (
                self._prng.pick(f"{name}ColorFill", self._options.color_fill(name))
                or "solid"
            ),
        )

    def color_angle(self, name: str) -> float:
        return self._memo_float(
            f"{name}ColorAngle", self._options.color_angle(name), 0.0
        )

    def component_transform(self, name: str) -> dict[str, float]:
        """Pick the rotate/translateX/translateY/scale values for a component.

        Memoized per ``name``, so the four values land in :meth:`resolved` as
        ``{name}Rotate`` / ``{name}TranslateX`` / ``{name}TranslateY`` /
        ``{name}Scale`` for downstream introspection.
        """
        component = self._style.components().get(name)

        return {
            "rotate": self._memo_float(
                f"{name}Rotate",
                component.rotate() if component is not None else None,
                0.0,
            ),
            "translateX": self._memo_float(
                f"{name}TranslateX",
                component.translate().x() if component is not None else None,
                0.0,
            ),
            "translateY": self._memo_float(
                f"{name}TranslateY",
                component.translate().y() if component is not None else None,
                0.0,
            ),
            "scale": self._memo_float(
                f"{name}Scale",
                component.scale() if component is not None else None,
                1.0,
            ),
        }

    def resolved(self) -> dict[str, Any]:
        """Return an informational snapshot of every value the resolver picked.

        Unset entries (``None``) are filtered out so they disappear on JSON
        encode, mirroring the JS behavior. The raw seed is excluded.
        """
        return {k: v for k, v in self._result.items() if v is not None}

    def _probability(self, component: Component) -> int | float:
        """Return the visibility probability (0–100) for the component.

        Aliases read the source component's user-set probability so a single
        ``{source}Probability`` option propagates to every alias of the source.
        """
        raw = self._options.component_probability(component.source_name())

        return raw if raw is not None else component.probability()

    def _is_visible(self, name: str, component: Component) -> bool:
        return self._prng.bool(f"{name}Probability", self._probability(component))

    def _resolve_color(self, name: str) -> list[str]:
        """Resolve a named color to its final stop list, applying contrast
        sorting and ``notEqualTo`` filtering from the style definition.
        """
        user_colors = self._options.color(name)
        style_color = self._style.colors().get(name)

        if user_colors is not None:
            source = user_colors
        elif style_color is not None:
            source = style_color.values()
        else:
            source = []

        candidates = [ColorUtil.to_hex(c) for c in source]
        fill = self.color_fill(name)
        stops = 1 if fill == "solid" else self._color_fill_stops(name)

        if style_color is None:
            return self._prng.shuffle(f"{name}Color", candidates)[:stops]

        # Detect circular references (e.g. a.contrastTo = b, b.contrastTo = a).
        if name in self._color_resolving:
            raise CircularColorReferenceError([*self._color_resolving, name])

        self._color_resolving.append(name)
        contrast_to = style_color.contrast_to()
        not_equal_to = style_color.not_equal_to()

        try:
            if contrast_to is not None:
                ref = self.color(contrast_to)
                ref_color = ref[0] if len(ref) > 0 else None

                if ref_color is not None:
                    candidates = ColorUtil.sort_by_contrast(candidates, ref_color)

            if len(not_equal_to) > 0:
                excluded: list[str] = []

                for ref_name in not_equal_to:
                    excluded.extend(self.color(ref_name))

                candidates = ColorUtil.filter_not_equal_to(candidates, excluded)
        finally:
            self._color_resolving.pop()

        # Skip shuffle when sorted by contrast to preserve the ordering.
        ordered = (
            candidates
            if contrast_to is not None
            else self._prng.shuffle(f"{name}Color", candidates)
        )

        return ordered[:stops]

    def _color_fill_stops(self, name: str) -> int:
        range_ = self._options.color_fill_stops(name)

        return (
            2 if range_ is None else self._prng.integer(f"{name}ColorFillStops", range_)
        )

    def _memo_float(self, key: str, range_: Range | None, fallback: float) -> float:
        return self._memo(
            key, lambda: fallback if range_ is None else self._prng.float(key, range_)
        )

    def _memo(self, key: str, compute: Callable[[], T]) -> T:
        if key in self._result:
            return cast(T, self._result[key])

        value = compute()
        self._result[key] = value

        return value
