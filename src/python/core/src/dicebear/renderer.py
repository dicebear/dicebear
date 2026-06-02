"""Walks a style's element tree and turns it into the final SVG markup."""

from __future__ import annotations

import random
import re
from typing import Any

from .prng import Fnv1a
from .resolver import Resolver
from .style import Style
from .style_def.canvas import Canvas
from .style_def.component import Component
from .style_def.element import Element
from .utils.initials import Initials
from .utils.license import License
from .utils.number import Number
from .utils.xml import Xml

_ID_PATTERN = re.compile(r'\bid="([^"]+)"')


class Renderer:
    """Walks a style's element tree and turns it into the final SVG markup.

    The renderer is single-use: it accumulates ``<defs>`` entries and per-render
    caches across method calls, so a fresh instance is required per avatar.
    """

    def __init__(self, style: Style, resolver: Resolver) -> None:
        self._style = style
        self._resolver = resolver
        self._defs: dict[str, str] = {}
        self._cached_seed_hash: str | None = None
        self._cached_initials: str | None = None

    def render(self) -> str:
        """Build the complete SVG document for the avatar."""
        canvas = self._style.canvas()
        background = self._render_background(canvas)
        body = self._render_elements(canvas.elements())

        # Order matters: scale and flip around center, then rotate, translate,
        # and finally clip with border radius (outermost wrapper).
        body = self._apply_scale(body, canvas)
        body = self._apply_flip(body, canvas)
        body = self._apply_rotate(body, canvas)
        body = self._apply_translate(body, canvas)
        body = self._apply_border_radius(background + body, canvas)

        metadata = License.xml(self._style.meta())
        defs = "<defs>" + "".join(self._defs.values()) + "</defs>" if self._defs else ""
        size = self._resolver.size()

        title = self._resolver.title()
        escaped_title = Xml.escape(title) if title is not None else None

        width = Number.format(canvas.width())
        height = Number.format(canvas.height())
        attrs = [
            'xmlns="http://www.w3.org/2000/svg"',
            f'viewBox="0 0 {width} {height}"',
        ]

        root_attributes = self._render_attributes(self._style.attributes())

        if root_attributes != "":
            attrs.append(root_attributes.lstrip())

        if escaped_title is not None:
            attrs.append('role="img"')
            attrs.append(f'aria-label="{escaped_title}"')
        else:
            attrs.append('aria-hidden="true"')

        if size is not None:
            attrs.append(f'width="{Number.format(size)}"')
            attrs.append(f'height="{Number.format(size)}"')

        title_element = (
            f"<title>{escaped_title}</title>" if escaped_title is not None else ""
        )

        svg = (
            "<svg "
            + " ".join(attrs)
            + ">"
            + metadata
            + defs
            + title_element
            + body
            + "</svg>"
        )

        if self._resolver.id_randomization():
            svg = self._randomize_ids(svg)

        return svg

    def _apply_flip(self, body: str, canvas: Canvas) -> str:
        """Wrap ``body`` in a flip transform when ``flip`` is not ``'none'``."""
        flip = self._resolver.flip()

        if flip == "none":
            return body

        w = Number.format(canvas.width())
        h = Number.format(canvas.height())

        transform = {
            "horizontal": f"translate({w}, 0) scale(-1, 1)",
            "vertical": f"translate(0, {h}) scale(1, -1)",
            "both": f"translate({w}, {h}) scale(-1, -1)",
        }[flip]

        return f'<g transform="{transform}">{body}</g>'

    def _apply_scale(self, body: str, canvas: Canvas) -> str:
        """Wrap ``body`` in a uniform scale around center when scale != 1."""
        scale = self._resolver.scale()

        if scale == 1:
            return body

        cx = canvas.width() / 2
        cy = canvas.height() / 2
        cx_value = Number.format(cx)
        cy_value = Number.format(cy)
        scale_value = Number.format(scale)
        neg_cx = Number.format(-cx)
        neg_cy = Number.format(-cy)

        return (
            f'<g transform="translate({cx_value}, {cy_value}) '
            f"scale({scale_value}) "
            f'translate({neg_cx}, {neg_cy})">{body}</g>'
        )

    def _apply_border_radius(self, body: str, canvas: Canvas) -> str:
        """Clip ``body`` to the (rounded) canvas rectangle via a ``clipPath``.

        The clip is always applied so transformed content cannot bleed past the
        canvas bounds, regardless of the consumer's overflow setting.
        """
        radius = self._resolver.border_radius()
        id_ = "clip-" + self._hash_seed()

        rx = Number.format((radius / 100) * canvas.width())
        ry = Number.format((radius / 100) * canvas.height())
        width = Number.format(canvas.width())
        height = Number.format(canvas.height())

        self._defs[id_] = (
            f'<clipPath id="{id_}"><rect width="{width}" height="{height}" '
            f'rx="{rx}" ry="{ry}"/></clipPath>'
        )

        return f'<g clip-path="url(#{id_})">{body}</g>'

    def _apply_rotate(self, body: str, canvas: Canvas) -> str:
        """Wrap ``body`` in a rotation around center when ``rotate`` is non-zero."""
        rotate = self._resolver.rotate()

        if rotate == 0:
            return body

        cx = Number.format(canvas.width() / 2)
        cy = Number.format(canvas.height() / 2)
        rotate_value = Number.format(rotate)

        return f'<g transform="rotate({rotate_value}, {cx}, {cy})">{body}</g>'

    def _apply_translate(self, body: str, canvas: Canvas) -> str:
        """Wrap ``body`` in a translate when translateX/translateY is non-zero.

        Offsets are interpreted as percentages of the canvas dimensions.
        """
        tx = self._resolver.translate_x()
        ty = self._resolver.translate_y()

        if tx == 0 and ty == 0:
            return body

        x = Number.format((tx / 100) * canvas.width())
        y = Number.format((ty / 100) * canvas.height())

        return f'<g transform="translate({x}, {y})">{body}</g>'

    def _render_background(self, canvas: Canvas) -> str:
        """Return a ``<rect>`` with the resolved background color, or ``''``."""
        colors = self._resolver.color("background")

        if len(colors) == 0:
            return ""

        fill = Xml.escape(self._resolve_color_reference("background"))
        width = Number.format(canvas.width())
        height = Number.format(canvas.height())

        return f'<rect width="{width}" height="{height}" fill="{fill}"/>'

    def _randomize_ids(self, svg: str) -> str:
        """Suffix every ``id`` declaration and reference with a random hex string.

        Uses ``random`` intentionally — a PRNG-derived suffix would produce the
        same ID for the same seed.
        """
        suffix = format(random.randint(0, 0xFFFFFF), "06x")

        ids = list(dict.fromkeys(_ID_PATTERN.findall(svg)))

        if len(ids) == 0:
            return svg

        escaped = [re.escape(i) for i in ids]
        pattern = re.compile(r'(id="|url\(#|href="#)(' + "|".join(escaped) + r')("|\))')

        return pattern.sub(
            lambda m: m.group(1) + m.group(2) + "-" + suffix + m.group(3), svg
        )

    def _render_elements(self, elements: list[Element]) -> str:
        """Render a list of elements and concatenate their markup."""
        return "".join(self._render_element(el) for el in elements)

    def _render_element(self, element: Element) -> str:
        """Dispatch a single element to the renderer for its type."""
        element_type = element.type()

        if element_type == "element":
            return self._render_svg_element(element)

        if element_type == "text":
            return self._render_text_element(element)

        if element_type == "component":
            return self._render_component_element(element)

        return ""

    def _render_svg_element(self, element: Element) -> str:
        """Render an SVG element; the special ``defs`` name diverts children.

        Element and attribute names are not escaped here — they are validated by
        StyleValidator against a strict allowlist schema. Values are escaped via
        :meth:`Xml.escape`.
        """
        name = element.name()

        if name is None:
            return ""

        if name == "defs":
            for child in element.children():
                rendered = self._render_element(child)

                if len(rendered) > 0:
                    attrs = child.attributes()
                    child_id = attrs.get("id") if attrs is not None else None
                    key = (
                        child_id
                        if isinstance(child_id, str)
                        else "_" + str(len(self._defs))
                    )
                    self._defs[key] = rendered

            return ""

        attrs_str = self._render_attributes(element.attributes())
        children = self._render_elements(element.children())

        if len(children) == 0:
            return f"<{name}{attrs_str}/>"

        return f"<{name}{attrs_str}>{children}</{name}>"

    def _render_text_element(self, element: Element) -> str:
        """Render a text element by escaping its resolved value."""
        value = element.value()

        return Xml.escape(self._resolve_value(value)) if value is not None else ""

    def _render_component_element(self, element: Element) -> str:
        """Resolve a component reference to a variant and emit a ``<use>``.

        Aliases of the same source component sharing a variant — and identical
        components referenced more than once — produce a single ``<defs>`` entry
        referenced by every ``<use>``. A user-supplied ``transform`` is prepended
        to the per-component transforms.
        """
        component_name = element.name()

        if not isinstance(component_name, str):
            return ""

        variant_name = self._resolver.variant(component_name)

        if variant_name is None:
            return ""

        component = self._style.components().get(component_name)

        if component is None:
            return ""

        variant = component.variants().get(variant_name)

        if variant is None:
            return ""

        id_ = f"{component.source_name()}-{variant_name}-{self._hash_seed()}"

        if id_ not in self._defs:
            body = self._render_elements(variant.elements())
            self._defs[id_] = f'<g id="{id_}">{body}</g>'

        transforms = self._build_transforms(component)
        user_attributes = element.attributes()
        merged_attributes: dict[str, Any] | None = user_attributes

        if len(transforms) > 0:
            user_transform = (
                user_attributes.get("transform") if user_attributes else None
            )
            if isinstance(user_transform, str) and user_transform != "":
                all_parts = [user_transform, *transforms]
            else:
                all_parts = transforms

            merged_attributes = {
                **(user_attributes or {}),
                "transform": " ".join(all_parts),
            }

        attrs_str = self._render_attributes(merged_attributes)

        return f'<use{attrs_str} href="#{id_}"/>'

    def _build_transforms(self, component: Component) -> list[str]:
        """Return the per-component SVG ``transform`` fragments.

        Ordered so that, joined into one ``transform`` attribute, the scale is
        the rightmost (innermost) transform — applied first, then rotate, then
        translate.
        """
        t = self._resolver.component_transform(component.name())
        rotate = t["rotate"]
        translate_x = t["translateX"]
        translate_y = t["translateY"]
        scale = t["scale"]

        if translate_x == 0 and translate_y == 0 and rotate == 0 and scale == 1:
            return []

        transforms: list[str] = []
        cx = component.width() / 2
        cy = component.height() / 2
        cx_value = Number.format(cx)
        cy_value = Number.format(cy)

        if translate_x != 0 or translate_y != 0:
            x = Number.format((translate_x / 100) * component.width())
            y = Number.format((translate_y / 100) * component.height())
            transforms.append(f"translate({x}, {y})")

        if rotate != 0:
            rotate_value = Number.format(rotate)
            transforms.append(f"rotate({rotate_value}, {cx_value}, {cy_value})")

        if scale != 1:
            scale_value = Number.format(scale)
            neg_cx = Number.format(-cx)
            neg_cy = Number.format(-cy)
            transforms.append(
                f"translate({cx_value}, {cy_value}) scale({scale_value}) "
                f"translate({neg_cx}, {neg_cy})"
            )

        return transforms

    def _render_attributes(self, attributes: dict[str, Any] | None) -> str:
        """Serialize an attribute map to a leading space-prefixed string."""
        if attributes is None:
            return ""

        parts: list[str] = []

        for key, value in attributes.items():
            if value is None:
                continue

            parts.append(
                f'{key}="' + Xml.escape(self._resolve_attribute_value(value)) + '"'
            )

        if len(parts) == 0:
            return ""

        return " " + " ".join(parts)

    def _resolve_attribute_value(self, value: str | dict[str, Any]) -> str:
        """Resolve a single attribute value: literals pass through; references
        are dereferenced through the option resolver.
        """
        if isinstance(value, str):
            return value

        if value.get("type") == "color":
            return self._resolve_color_reference(value["name"])

        return self._resolve_variable(value["name"])

    def _resolve_color_reference(self, name: str) -> str:
        """Resolve a named color into a hex string or a ``url(#…)`` gradient."""
        colors = self._resolver.color(name)
        fill = self._resolver.color_fill(name)

        if fill == "solid" or len(colors) <= 1:
            return colors[0] if len(colors) > 0 else "none"

        return self._build_gradient_def(name, colors, fill)

    def _build_gradient_def(self, name: str, colors: list[str], fill: str) -> str:
        """Build the linear/radial gradient, register it, return its reference."""
        rotation = self._resolver.color_angle(name)
        id_ = f"{name}-color-{self._hash_seed()}"
        tag = "linearGradient" if fill == "linear" else "radialGradient"
        rotate_attr = (
            f' gradientTransform="rotate({Number.format(rotation)}, 0.5, 0.5)"'
            if rotation != 0
            else ""
        )

        stops: list[str] = []
        count = len(colors)

        for i, color in enumerate(colors):
            offset = Number.format(i / (count - 1) * 100)
            stops.append(
                f'<stop offset="{offset}%" stop-color="' + Xml.escape(color) + '"/>'
            )

        self._defs[id_] = (
            f'<{tag} id="{id_}"{rotate_attr}>' + "".join(stops) + f"</{tag}>"
        )

        return f"url(#{id_})"

    def _resolve_value(self, value: str | dict[str, Any]) -> str:
        """Resolve an element value: literals pass through; variables resolved."""
        if isinstance(value, str):
            return value

        if value.get("type") == "variable":
            return self._resolve_variable(value["name"])

        return ""

    def _resolve_variable(self, name: str) -> str:
        """Resolve a built-in variable reference to its current value."""
        if name == "initial":
            return self._initials()[0:1]

        if name == "initials":
            return self._initials()

        if name == "fontWeight":
            return Number.format(self._resolver.font_weight())

        if name == "fontFamily":
            return self._resolver.font_family()

        return ""

    def _initials(self) -> str:
        """Return the seed-derived initials, cached after the first call."""
        if self._cached_initials is None:
            self._cached_initials = Initials.from_seed(self._resolver.seed())

        return self._cached_initials

    def _hash_seed(self) -> str:
        """Return the FNV-1a hex hash of the seed, cached after the first call."""
        if self._cached_seed_hash is None:
            self._cached_seed_hash = Fnv1a.hex(self._resolver.seed())

        return self._cached_seed_hash
