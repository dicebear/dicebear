"""DiceBear core — deterministic, customizable, vector-based avatars.

A faithful port of the reference JavaScript core (``@dicebear/core``), producing
byte-identical SVG output for the same style and options.
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

# Public surface mirrors the JS index (Avatar, Style, OptionsDescriptor) plus
# the exception types Python consumers catch. Internals (Options, Prng,
# Resolver, Renderer and the color helpers) remain importable from their
# submodules but are not re-exported here.
__all__ = [
    "Avatar",
    "CircularColorReferenceError",
    "OptionsDescriptor",
    "OptionsValidationError",
    "Style",
    "StyleValidationError",
    "ValidationError",
]
