"""Make user text well-formed before the core reads it."""

from __future__ import annotations

import re

_SURROGATE = re.compile("[\ud800-\udfff]")


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
