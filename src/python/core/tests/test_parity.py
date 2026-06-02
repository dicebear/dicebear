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
from pathlib import Path
from typing import Any

import pytest

from dicebear import Avatar
from dicebear.prng import Fnv1a, Mulberry32, Prng
from dicebear.utils import Initials, Number

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
    style_data = _STYLE_CACHE.setdefault(style_name, _load(f"styles/{style_name}.json"))

    result = Avatar(style_data, entry["options"]).to_json()

    assert result["svg"] == entry["svg"]
    # Round-trip the resolved options through JSON so int-vs-float typing matches
    # the JS-generated fixture (Python 1.0 and JS 1 both become JSON 1).
    assert json.loads(json.dumps(result["options"])) == entry["resolvedOptions"]
