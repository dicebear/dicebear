"""Deterministic resolution of options against a style, with memoization."""

from __future__ import annotations

from collections.abc import Callable
from typing import Any, TypeVar, cast

from .errors import CircularColorReferenceError
from .options import Options, Range
from .prng import Prng
from .style import Style
from .style.component import Component
from .style.component_variant import ComponentVariant
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

        The pool the PRNG draws from is built from the per-component
        ``{name}Variant`` option and the global ``tags`` filter (see
        :meth:`_variant_weights`). Only variants that exist in the style
        definition are considered.
        """
        return self._memo(f"{name}Variant", lambda: self._resolve_variant(name))

    def _resolve_variant(self, name: str) -> str | None:
        component = self._style.components().get(name)

        if component is None or not self._is_visible(name, component):
            return None

        return self._prng.weighted_pick(
            f"{name}Variant", self._variant_weights(component)
        )

    def _variant_weights(self, component: Component) -> dict[str, int | float]:
        """Build the name → weight map the PRNG draws a variant from.

        The per-component ``{name}Variant`` option is more specific than the
        global ``tags`` filter, so it takes precedence: when set, it fully
        governs the component's pool (its named variants, weighted by the option)
        and the tags filter is ignored for that component. The tags filter
        applies only where the user gave no explicit ``{name}Variant`` (see
        :meth:`_tag_filtered_names`), and falls back to every variant when
        neither is set.

        Names the style does not define are dropped, and an empty
        ``{name}Variant`` (or an empty tag result) yields no variant.
        """
        variants = component.variants()
        named = self._options.component_variant(component.source_name())
        weights: dict[str, int | float] = {}

        if named is not None:
            names: list[str] = list(named.keys())
        elif len(self._options.tags()) > 0:
            names = self._tag_filtered_names(variants)
        else:
            names = list(variants.keys())

        for v in names:
            variant = variants.get(v)

            if variant is not None:
                weights[v] = named[v] if named is not None else variant.weight()

        return weights

    def _tag_filtered_names(self, variants: dict[str, ComponentVariant]) -> list[str]:
        """Narrow a component's variants to the names satisfying the global
        ``tags`` filter, applying the parsed :meth:`Options.tags` tokens in one
        pass over the pool:

        - A positive ``cat:value`` token is an axis-scoped allow. Within each
          category some allow mentions, a variant is kept only if it carries no
          tag in that category (untouched) or matches one of the allowed values
          (OR within the category). Distinct allowed categories combine with
          AND, and a category no allow mentions is left unconstrained. A bare
          positive ``cat`` token carries no value, so it imposes no constraint (a
          no-op).
        - A negative ``!cat``/``!cat:value`` token disallows, dropping every
          variant carrying any tag in ``cat`` (bare) or the exact ``cat:value``
          tag. Disallows are checked alongside allows but always win.

        Returns the surviving variant names in definition order.
        """
        allows: dict[str, list[str]] = {}
        disallows: list[tuple[str, str | None]] = []

        for token in self._options.tags():
            if token.negated:
                disallows.append((token.category, token.value))
            elif token.value is not None:
                allows.setdefault(token.category, []).append(token.value)

        # Materialize the allow groups once, not on every variant.
        allow_groups = list(allows.items())

        names: list[str] = []

        for name, variant in variants.items():
            allowed = all(
                not variant.has_tag(category)
                or any(variant.has_tag(category, value) for value in values)
                for category, values in allow_groups
            )
            disallowed = any(
                variant.has_tag(category, value) for category, value in disallows
            )

            if allowed and not disallowed:
                names.append(name)

        return names

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
        encode, mirroring the JS behavior. Whole-number floats are emitted as
        ints (``1``, not ``1.0``) so ``to_json()`` is byte-identical to the JS
        and Rust ports. The raw seed is excluded.
        """
        return {k: _num_value(v) for k, v in self._result.items() if v is not None}

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


def _num_value(value: Any) -> Any:
    """Encode a numeric snapshot value the way the JS/Rust ports do.

    A whole-number float becomes a JSON integer (``1``, not ``1.0``) so the
    resolved-options snapshot is byte-identical across ports. ``bool`` is an
    ``int`` subclass but never a ``float``, so it is left untouched; non-floats,
    fractional floats, and non-finite floats (``NaN`` / ``inf``) pass through.
    """
    if isinstance(value, float) and value.is_integer() and abs(value) < 2**53:
        return int(value)

    return value
