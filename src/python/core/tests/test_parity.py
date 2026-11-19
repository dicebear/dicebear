"""Cross-language parity tests.

Reads the shared fixtures at ``tests/fixtures/parity/`` and asserts that the
Python implementation produces exactly the values committed there. The JS suite
(``src/js/core/tests/Parity.test.js``) and the PHP suite
(``src/php/core/tests/ParityTest.php``) read the same fixtures, so any
divergence between implementations surfaces as a failure on whichever side
drifts.

To regenerate the fixtures: ``npm run fixtures:parity`` (from repo root).
"""

from __future__ import annotations

import json
import struct
from pathlib import Path
from typing import Any

import pytest

from dicebear import Avatar, OptionsDescriptor, Style
from dicebear.errors import CircularColorReferenceError, ValidationError
from dicebear.prng import Fnv1a, Mulberry32, Prng
from dicebear.utils import Initials, Number
from dicebear.utils.color import Color

FIXTURES_DIR = Path(__file__).parents[4] / "tests" / "fixtures" / "parity"


def _load(rel_path: str) -> Any:
    return json.loads((FIXTURES_DIR / rel_path).read_text("utf-8"))


# ---------------------------------------------------------------------------
# Fnv1a
# ---------------------------------------------------------------------------

_FNV1A = _load("fnv1a.json")


@pytest.mark.parametrize("entry", _FNV1A, ids=[repr(e["input"]) for e in _FNV1A])
def test_fnv1a(entry: dict[str, Any]) -> None:
    assert Fnv1a.hash(entry["input"]) == entry["hash"]
    assert Fnv1a.hex(entry["input"]) == entry["hex"]


# ---------------------------------------------------------------------------
# Mulberry32
# ---------------------------------------------------------------------------

_MULBERRY32 = _load("mulberry32.json")


@pytest.mark.parametrize(
    "entry", _MULBERRY32, ids=[f"seed-{e['seed']}" for e in _MULBERRY32]
)
def test_mulberry32(entry: dict[str, Any]) -> None:
    mulberry = Mulberry32(entry["seed"])

    for i, expected in enumerate(entry["sequence"]):
        assert mulberry.next_float() == expected["float"], f"step {i} float"
        assert mulberry.state() == expected["state"], f"step {i} state"


# ---------------------------------------------------------------------------
# Prng
# ---------------------------------------------------------------------------

_PRNG = _load("prng.json")


def _prng_params(method: str) -> dict[str, Any]:
    cases = _PRNG[method]
    return {
        "argvalues": cases,
        "ids": [f"#{i}-{c['seed']}-{c['key']}" for i, c in enumerate(cases)],
    }


@pytest.mark.parametrize("c", **_prng_params("getValue"))
def test_prng_get_value(c: dict[str, Any]) -> None:
    assert Prng(c["seed"]).get_value(c["key"]) == c["result"]


@pytest.mark.parametrize("c", **_prng_params("pick"))
def test_prng_pick(c: dict[str, Any]) -> None:
    assert Prng(c["seed"]).pick(c["key"], c["items"]) == c["result"]


@pytest.mark.parametrize("c", **_prng_params("weightedPick"))
def test_prng_weighted_pick(c: dict[str, Any]) -> None:
    assert Prng(c["seed"]).weighted_pick(c["key"], c["weights"]) == c["result"]


@pytest.mark.parametrize("c", **_prng_params("bool"))
def test_prng_bool(c: dict[str, Any]) -> None:
    assert Prng(c["seed"]).bool(c["key"], float(c["likelihood"])) == c["result"]


@pytest.mark.parametrize("c", **_prng_params("float"))
def test_prng_float(c: dict[str, Any]) -> None:
    assert Prng(c["seed"]).float(c["key"], c["range"]) == float(c["result"])


@pytest.mark.parametrize("c", **_prng_params("integer"))
def test_prng_integer(c: dict[str, Any]) -> None:
    assert Prng(c["seed"]).integer(c["key"], c["range"]) == c["result"]


@pytest.mark.parametrize("c", **_prng_params("shuffle"))
def test_prng_shuffle(c: dict[str, Any]) -> None:
    assert Prng(c["seed"]).shuffle(c["key"], c["items"]) == c["result"]


# ---------------------------------------------------------------------------
# Ill-formed text
# ---------------------------------------------------------------------------

# Lone surrogates in the options become U+FFFD before anything reads them.
# Inputs are UTF-16 code-unit arrays; the ``utf8`` cases are for the ports whose
# strings are bytes. See generate.mjs.
_ILL_FORMED = _load("ill-formed-text.json")["utf16"]
_INITIALS_STYLE = Style(_load("styles/initials.json"))


def _from_code_units(units: list[int]) -> str:
    """Build the str a JS string with these code units corresponds to.

    Decoding (not ``chr`` per unit) joins a valid pair into one code point;
    ``surrogatepass`` keeps a lone surrogate as it is.
    """
    return struct.pack(f"<{len(units)}H", *units).decode("utf-16-le", "surrogatepass")


@pytest.mark.parametrize(
    "c", _ILL_FORMED, ids=[f"#{i}" for i in range(len(_ILL_FORMED))]
)
def test_ill_formed_text(c: dict[str, Any]) -> None:
    text = _from_code_units(c["input"])
    avatar = Avatar(_INITIALS_STYLE, {"seed": text, "title": text})

    assert str(avatar) == c["svg"]


# ---------------------------------------------------------------------------
# Number formatting
# ---------------------------------------------------------------------------

_NUMBERS = _load("numbers.json")


@pytest.mark.parametrize(
    "entry", _NUMBERS, ids=[f"#{i}-{e['output']}" for i, e in enumerate(_NUMBERS)]
)
def test_number_formatting(entry: dict[str, Any]) -> None:
    assert Number.format(entry["input"]) == entry["output"]


# ---------------------------------------------------------------------------
# Initials
# ---------------------------------------------------------------------------

_INITIALS = _load("initials.json")


@pytest.mark.parametrize(
    "entry", _INITIALS, ids=[f"#{i}-{e['result']}" for i, e in enumerate(_INITIALS)]
)
def test_initials(entry: dict[str, Any]) -> None:
    assert Initials.from_seed(entry["seed"]) == entry["result"]


# ---------------------------------------------------------------------------
# Avatar
# ---------------------------------------------------------------------------


def _avatar_cases() -> list[tuple[str, dict[str, Any]]]:
    cases: list[tuple[str, dict[str, Any]]] = []

    for path in sorted((FIXTURES_DIR / "avatars").glob("*.json")):
        style_name = path.stem
        for entry in _load(f"avatars/{style_name}.json"):
            cases.append((style_name, entry))

    return cases


_AVATARS = _avatar_cases()
_STYLE_CACHE: dict[str, Any] = {}


@pytest.mark.parametrize(
    ("style_name", "entry"),
    _AVATARS,
    ids=[f"{name}/{entry['id']}" for name, entry in _AVATARS],
)
def test_avatar(style_name: str, entry: dict[str, Any]) -> None:
    style = _STYLE_CACHE.setdefault(
        style_name, Style(_load(f"styles/{style_name}.json"))
    )

    avatar = Avatar(style, entry["options"])
    result = avatar.to_json()

    assert result["svg"] == entry["svg"]
    # Compare the serialized options, not just structural equality: Python treats
    # ``1.0 == 1`` as True, so a plain ``==`` would hide int-vs-float drift in
    # to_json(). The resolver normalizes whole-number floats to ints (matching
    # JS/Rust), so the JSON is byte-identical to the JS-generated fixture.
    assert json.dumps(result["options"]) == json.dumps(entry["resolvedOptions"])

    # Only select cases carry a dataUri — it pins the percent-encoding contract
    # (encodeURIComponent) without bloating every fixture.
    if "dataUri" in entry:
        assert avatar.to_data_uri() == entry["dataUri"]


# ---------------------------------------------------------------------------
# Color
# ---------------------------------------------------------------------------

_COLORS = _load("colors.json")


@pytest.mark.parametrize(
    "entry", _COLORS["toHex"], ids=[e["input"] for e in _COLORS["toHex"]]
)
def test_color_to_hex(entry: dict[str, Any]) -> None:
    assert Color.to_hex(entry["input"]) == entry["result"]


@pytest.mark.parametrize(
    "entry", _COLORS["toRgbHex"], ids=[e["input"] for e in _COLORS["toRgbHex"]]
)
def test_color_to_rgb_hex(entry: dict[str, Any]) -> None:
    assert Color.to_rgb_hex(entry["input"]) == entry["result"]


@pytest.mark.parametrize(
    "entry", _COLORS["parseHex"], ids=[e["input"] for e in _COLORS["parseHex"]]
)
def test_color_parse_hex(entry: dict[str, Any]) -> None:
    assert list(Color.parse_hex(entry["input"])) == entry["result"]


@pytest.mark.parametrize(
    "entry", _COLORS["luminance"], ids=[e["input"] for e in _COLORS["luminance"]]
)
def test_color_luminance(entry: dict[str, Any]) -> None:
    assert Color.luminance(entry["input"]) == entry["result"]


@pytest.mark.parametrize("entry", _COLORS["sortByContrast"])
def test_color_sort_by_contrast(entry: dict[str, Any]) -> None:
    result = Color.sort_by_contrast(entry["candidates"], entry["refColor"])

    assert result == entry["result"]


@pytest.mark.parametrize("entry", _COLORS["filterNotEqualTo"])
def test_color_filter_not_equal_to(entry: dict[str, Any]) -> None:
    result = Color.filter_not_equal_to(entry["candidates"], entry["excluded"])

    assert result == entry["result"]


# ---------------------------------------------------------------------------
# Validation
# ---------------------------------------------------------------------------
#
# Only the accept/reject outcome is shared across languages — error messages
# are language-specific. The circular color reference cases additionally pin
# the reported resolution chain.

_VALIDATION = _load("validation.json")
_MINIMAL_STYLE = next(
    e["definition"] for e in _VALIDATION["styles"] if e["id"] == "minimal"
)


@pytest.mark.parametrize(
    "entry", _VALIDATION["styles"], ids=[e["id"] for e in _VALIDATION["styles"]]
)
def test_validation_style(entry: dict[str, Any]) -> None:
    if entry["valid"]:
        Style(entry["definition"])
    else:
        with pytest.raises(ValidationError):
            Style(entry["definition"])


@pytest.mark.parametrize(
    "entry", _VALIDATION["options"], ids=[e["id"] for e in _VALIDATION["options"]]
)
def test_validation_options(entry: dict[str, Any]) -> None:
    if entry["valid"]:
        Avatar(Style(_MINIMAL_STYLE), entry["options"])
    else:
        with pytest.raises(ValidationError):
            Avatar(Style(_MINIMAL_STYLE), entry["options"])


@pytest.mark.parametrize(
    "entry",
    _VALIDATION["circularColors"],
    ids=[e["id"] for e in _VALIDATION["circularColors"]],
)
def test_validation_circular_colors(entry: dict[str, Any]) -> None:
    with pytest.raises(CircularColorReferenceError) as exc_info:
        Avatar(Style(entry["style"]), entry["options"])

    assert exc_info.value.chain == entry["chain"]


# ---------------------------------------------------------------------------
# OptionsDescriptor
# ---------------------------------------------------------------------------

_DESCRIPTOR_STYLES = sorted(
    path.stem for path in (FIXTURES_DIR / "descriptors").glob("*.json")
)


@pytest.mark.parametrize("style_name", _DESCRIPTOR_STYLES)
def test_options_descriptor(style_name: str) -> None:
    style_data = _load(f"styles/{style_name}.json")
    expected = _load(f"descriptors/{style_name}.json")

    result = OptionsDescriptor(Style(style_data)).to_json()

    # Serialized compare: pins key order and int-vs-float typing, like the
    # avatar resolved-options assertion above.
    assert json.dumps(result) == json.dumps(expected)
