"""The nesting limit both validators check before anything else."""

from __future__ import annotations

from typing import Any

# How many levels of dicts and lists a style definition or the options may
# nest, counting the value itself as the first. The deepest style definition
# uses less than a quarter of that and valid options two levels; the limit
# matches the C# port.
MAX_DEPTH = 64

MAX_DEPTH_MESSAGE = f"nesting is deeper than the {MAX_DEPTH} levels this port reads"


def exceeds_max_depth(value: Any) -> bool:
    """Return whether ``value`` nests dicts and lists deeper than ``MAX_DEPTH``.

    A value that contains itself does. Both validators ask first: on Python
    3.10 and 3.11 the schema validator runs out of stack while it writes a
    deeply nested value into its error message.
    """
    return _exceeds_max_depth(value, 1, {})


def _exceeds_max_depth(value: Any, depth: int, checked: dict[int, int]) -> bool:
    """Search ``value``, found on level ``depth``, for :func:`exceeds_max_depth`.

    ``checked`` holds the deepest level each container was searched from. One
    met again no deeper than that needs no second search, so a part shared
    many times is searched once, not once per reference. One met again deeper
    is searched again, which is how a value that contains itself runs into the
    limit.
    """
    if not isinstance(value, (dict, list, tuple)):
        return False

    if depth > MAX_DEPTH:
        return True

    marker = id(value)

    if checked.get(marker, 0) >= depth:
        return False

    checked[marker] = depth

    if isinstance(value, dict):
        return any(
            _exceeds_max_depth(k, depth + 1, checked)
            or _exceeds_max_depth(v, depth + 1, checked)
            for k, v in value.items()
        )

    return any(_exceeds_max_depth(item, depth + 1, checked) for item in value)
