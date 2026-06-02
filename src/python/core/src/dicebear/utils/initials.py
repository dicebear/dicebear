"""Derive display initials from a seed string."""

from __future__ import annotations

import re
import unicodedata

# Backtick, acute accent, apostrophe, and modifier letter apostrophe — stripped
# so names like "O'Brien" yield "OB" rather than "OB" split on the quote.
_QUOTES = re.compile(r"[`´'ʼ]")
_AT_TAIL = re.compile(r"@.*")


class Initials:
    """Derive display initials from a seed string."""

    @staticmethod
    def from_seed(seed: str, discard_at_symbol: bool = True) -> str:
        """Return one or two uppercase initials for the given seed.

        By default strips ``@...`` so email addresses yield a single initial
        instead of being treated as two words.
        """
        text = _AT_TAIL.sub("", seed) if discard_at_symbol else seed
        text = _QUOTES.sub("", text)

        words = _words(text)

        if len(words) == 0:
            return Initials.from_seed(seed, False) if discard_at_symbol else ""

        if len(words) == 1:
            return _clusters(words[0], 2).upper()

        first = _clusters(words[0], 1)
        last = _clusters(words[-1], 1)

        if first == "" or last == "":
            return ""

        return (first + last).upper()


def _is_letter(char: str) -> bool:
    """Whether ``char`` is a Unicode letter (PCRE ``\\p{L}``)."""
    return unicodedata.category(char)[0] == "L"


def _is_mark(char: str) -> bool:
    """Whether ``char`` is a Unicode combining mark (PCRE ``\\p{M}``)."""
    return unicodedata.category(char)[0] == "M"


def _words(text: str) -> list[str]:
    """Split into maximal runs that start with a letter and continue with
    letters or marks — the matches of ``(\\p{L}[\\p{L}\\p{M}]*)``.
    """
    words: list[str] = []
    current: list[str] = []

    for char in text:
        if current:
            if _is_letter(char) or _is_mark(char):
                current.append(char)
            else:
                words.append("".join(current))
                current = []
                if _is_letter(char):
                    current.append(char)
        elif _is_letter(char):
            current.append(char)

    if current:
        words.append("".join(current))

    return words


def _clusters(word: str, limit: int) -> str:
    """Return up to ``limit`` leading letter-plus-marks clusters of ``word``.

    Mirrors ``(?:\\p{L}\\p{M}*){limit}`` anchored at the start.
    """
    result: list[str] = []
    count = 0
    i = 0

    while i < len(word) and count < limit:
        if not _is_letter(word[i]):
            break

        result.append(word[i])
        i += 1

        while i < len(word) and _is_mark(word[i]):
            result.append(word[i])
            i += 1

        count += 1

    return "".join(result)
