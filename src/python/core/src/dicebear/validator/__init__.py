"""Validation of style definitions and avatar options.

:class:`StyleValidator` and :class:`OptionsValidator` are the entry points.
Each checks the nesting limit, then the shared draft-07 schema through
:class:`StyleSchemaValidator` / :class:`OptionsSchemaValidator`, then what the
schema cannot express.
"""

from __future__ import annotations

from ._depth import MAX_DEPTH, MAX_DEPTH_MESSAGE, exceeds_max_depth
from ._options import OptionsValidator
from ._schema import OptionsSchemaValidator, StyleSchemaValidator
from ._style import StyleValidator

__all__ = [
    "MAX_DEPTH",
    "MAX_DEPTH_MESSAGE",
    "OptionsSchemaValidator",
    "OptionsValidator",
    "StyleSchemaValidator",
    "StyleValidator",
    "exceeds_max_depth",
]
