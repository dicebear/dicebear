"""FNV-1a 32-bit hash."""

from __future__ import annotations

import struct


class Fnv1a:
    """FNV-1a 32-bit hash.

    Offset basis: ``0x811c9dc5``, prime: ``0x01000193``.

    See https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function
    """

    @staticmethod
    def hash(value: str) -> int:
        """Return the unsigned 32-bit FNV-1a hash of ``value``.

        The input is decomposed into UTF-16 code units before hashing so the
        result is identical across language ports.
        """
        result = 0x811C9DC5

        for code in _utf16_code_units(value):
            result = ((result ^ code) * 0x01000193) & 0xFFFFFFFF

        return result

    @staticmethod
    def hex(value: str) -> str:
        """Return the FNV-1a hash of ``value`` as an 8-char lowercase hex string."""
        return format(Fnv1a.hash(value), "08x")


def _utf16_code_units(value: str) -> list[int]:
    """Convert a string to its UTF-16 code units, matching JS ``charCodeAt``.

    Iterating ``value`` directly would yield code points and break on non-BMP
    input (e.g. emoji), so encode to little-endian UTF-16 and read uint16 units.
    """
    if value == "":
        return []

    encoded = value.encode("utf-16-le")

    return list(struct.unpack(f"<{len(encoded) // 2}H", encoded))
