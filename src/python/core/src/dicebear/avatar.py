"""Top-level entry point for rendering an avatar from a style and options."""

from __future__ import annotations

import copy
from typing import Any
from urllib.parse import quote

from .options import Options
from .renderer import Renderer
from .resolver import Resolver
from .style import Style

# encodeURIComponent leaves A-Za-z0-9 and -_.!~*'() unescaped. Python's quote
# always keeps letters, digits, and _.-~; adding !*'() to ``safe`` reproduces
# the JS set exactly (and drops the default '/' so it is escaped like JS does).
_DATA_URI_SAFE = "!*'()"


class Avatar:
    """Top-level entry point for rendering an avatar from a style and options.

    Construction immediately resolves and renders the SVG; the various accessor
    methods return different serializations of that result.
    """

    def __init__(
        self, style_input: Any, options_input: dict[str, Any] | None = None
    ) -> None:
        style = style_input if isinstance(style_input, Style) else Style(style_input)
        options = Options(options_input)
        resolver = Resolver(style, options)

        self._svg = Renderer(style, resolver).render()
        self._resolved_options = resolver.resolved()

    def __str__(self) -> str:
        return self._svg

    def to_string(self) -> str:
        """Return the rendered SVG markup."""
        return self._svg

    def to_json(self) -> dict[str, Any]:
        """Return ``{"svg", "options"}`` — the SVG and the resolved options."""
        return {"svg": self._svg, "options": copy.deepcopy(self._resolved_options)}

    def to_data_uri(self) -> str:
        """Return the SVG encoded as a ``data:image/svg+xml`` URI."""
        return "data:image/svg+xml;charset=utf-8," + quote(
            self._svg, safe=_DATA_URI_SAFE
        )
