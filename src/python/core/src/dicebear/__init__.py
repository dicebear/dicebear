"""DiceBear core — deterministic, customizable, vector-based avatars.

A faithful port of ``@dicebear/core`` (JS) and ``dicebear/core`` (PHP) that
produces byte-identical SVG output for the same style and options.
"""

from __future__ import annotations

from .avatar import Avatar
from .errors import (
    CircularColorReferenceError,
    OptionsValidationError,
    StyleValidationError,
    ValidationError,
)
from .options_descriptor import OptionsDescriptor
from .style import Style
from .utils.color import Color

# Public surface mirrors the JS index (Avatar, Style, Color, OptionsDescriptor)
# plus the exception types Python consumers catch. Internals — Options, Prng,
# Resolver, Renderer — remain importable from their submodules but are not
# re-exported here.
__all__ = [
    "Avatar",
    "CircularColorReferenceError",
    "Color",
    "OptionsDescriptor",
    "OptionsValidationError",
    "Style",
    "StyleValidationError",
    "ValidationError",
]
