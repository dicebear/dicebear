"""Make user text well-formed before the core reads it."""

from __future__ import annotations

import re
from typing import Any

_SURROGATE = re.compile("[\ud800-\udfff]")

# How many levels of dicts, lists and tuples ``well_formed_deep`` walks. No valid
# options nest anywhere near this deep.
MAX_DEPTH = 64


class Text:
    """Replace lone surrogates with U+FFFD.

    A Python ``str`` can hold a lone surrogate, for example from
    ``json.loads('"\\ud83d"')`` or half of an emoji cut off by a slice. Ports
    that keep strings as UTF-8 can hold ill-formed bytes instead. Neither has a
    meaning another port could reproduce, so every port replaces them with
    U+FFFD first, the same as JS ``String.prototype.toWellFormed()``.
    """

    @staticmethod
    def well_formed(value: str) -> str:
        """Return ``value`` with every lone surrogate replaced by U+FFFD.

        A high surrogate directly followed by a low one is the pair a JS string
        would hold for that character, so it becomes that character. A
        well-formed string comes back unchanged.
        """
        if _SURROGATE.search(value) is None:
            return value

        result: list[str] = []
        i = 0

        while i < len(value):
            char = value[i]
            code = ord(char)

            if 0xD800 <= code <= 0xDBFF and i + 1 < len(value):
                low = ord(value[i + 1])

                if 0xDC00 <= low <= 0xDFFF:
                    pair = 0x10000 + ((code - 0xD800) << 10) + (low - 0xDC00)
                    result.append(chr(pair))
                    i += 2
                    continue

            result.append("�" if 0xD800 <= code <= 0xDFFF else char)
            i += 1

        return "".join(result)

    @staticmethod
    def well_formed_deep(value: Any) -> Any:
        """Apply :meth:`well_formed` to every string in a JSON-like value.

        Covers dict keys, dict values and list or tuple items. Returns a new
        value and leaves the input untouched; anything else is passed through.

        So is a dict, list or tuple nested deeper than ``MAX_DEPTH`` levels, or
        one that contains itself. The walk must not be what fails on such
        input: the validator turns it down with its own error.
        """
        return _deep(value, set(), 0)


def _deep(value: Any, path: set[int], depth: int) -> Any:
    """Walk ``value`` for :meth:`Text.well_formed_deep`.

    ``path`` holds the ids of the containers between the root and ``value``. A
    depth limit alone would not stop a cycle in time: a value that contains
    itself twice doubles the work on every level.
    """
    if isinstance(value, str):
        return Text.well_formed(value)

    if not isinstance(value, (dict, list, tuple)):
        return value

    marker = id(value)

    if depth >= MAX_DEPTH or marker in path:
        return value

    path.add(marker)

    try:
        if isinstance(value, dict):
            return {
                _deep(k, path, depth + 1): _deep(v, path, depth + 1)
                for k, v in value.items()
            }

        items = [_deep(item, path, depth + 1) for item in value]

        return items if isinstance(value, list) else tuple(items)
    finally:
        path.discard(marker)
