"""JSON Schema validation against the shared draft-07 schemas.

The schemas are written for ECMA-262 regular expressions, and one anchor does
not carry over to :mod:`re` unchanged. It is translated before a validator is
built, see :func:`_compile`.
"""

from __future__ import annotations

import json
from importlib.resources import files
from typing import Any

from jsonschema import Draft7Validator
from jsonschema.exceptions import ValidationError as JsonSchemaError

from .errors import ErrorDetail, OptionsValidationError, StyleValidationError

_MAX_ERRORS = 10

_validators: dict[str, Draft7Validator] = {}

# Keys that map names to subschemas instead of being a subschema themselves. A
# member of one of these called `pattern` is a property name, not a keyword.
_SCHEMA_MAPS = frozenset(
    {"properties", "definitions", "$defs", "dependencies", "dependentSchemas"}
)

# Keys that hold instance values instead of subschemas. A `pattern` nested
# under one of these is data and has to come through the walk untouched.
_INSTANCE_DATA = frozenset({"const", "enum", "default", "examples"})


def _untranslatable(pattern: str, reason: str) -> ValueError:
    """Build the failure for a pattern the rewriter refuses to translate."""
    return ValueError(
        f"The schema pattern {pattern!r} cannot be translated because {reason}."
    )


def _translate(pattern: str) -> str:
    r"""Rewrite one ECMA-262 regular expression into the form :mod:`re` reads
    the same way. :func:`_compile` covers what diverges and why it matters.

    Raises :class:`ValueError` when the pattern uses something this cannot
    translate without guessing. The schemas ship with the port, so that is a
    bug in the port rather than anything a caller can provoke.
    """
    translated: list[str] = []
    in_class = False
    i = 0

    while i < len(pattern):
        current = pattern[i]

        if current == "\\":
            if i + 1 == len(pattern):
                raise _untranslatable(pattern, "it ends on a lone backslash")

            # Every escape reads the same in both engines, `\\` and `\$`
            # included. Copying the pair over keeps an escaped bracket from
            # opening or closing a class and an escaped dollar from being read
            # as the anchor.
            translated.append(pattern[i : i + 2])
            i += 2
            continue

        i += 1

        if current == "[" and not in_class:
            in_class = True
        elif current == "]" and in_class:
            in_class = False
        elif current == "$" and not in_class:
            # `\Z` is the Python spelling of the anchor ECMA-262 gives `$` while
            # the `m` flag is off. Inside a class `$` is a literal and stays one.
            translated.append(r"\Z")
            continue

        translated.append(current)

    if in_class:
        raise _untranslatable(pattern, "a character class is left open")

    return "".join(translated)


def _rewrite(node: Any) -> Any:
    """Return ``node`` with every ``pattern`` value and every
    ``patternProperties`` key replaced by its rewritten form.
    """
    if isinstance(node, list):
        return [_rewrite(item) for item in node]

    if not isinstance(node, dict):
        return node

    rewritten: dict[str, Any] = {}

    for key, value in node.items():
        if key == "pattern" and isinstance(value, str):
            rewritten[key] = _translate(value)
        elif key == "patternProperties" and isinstance(value, dict):
            rewritten[key] = {
                _translate(name): _rewrite(sub) for name, sub in value.items()
            }
        elif key in _SCHEMA_MAPS and isinstance(value, dict):
            rewritten[key] = {name: _rewrite(sub) for name, sub in value.items()}
        elif key in _INSTANCE_DATA:
            rewritten[key] = value
        else:
            rewritten[key] = _rewrite(value)

    return rewritten


def _compile(raw: str) -> Draft7Validator:
    r"""Parse one of the shared schemas, bring its anchors in line with
    ECMA-262, and build the validator for it.

    ``jsonschema`` hands every ``pattern`` straight to :mod:`re`, which matches
    ``$`` at the end of the string or right before a single trailing newline.
    ECMA-262 without the ``m`` flag matches only at the end of the input, and
    that is what the compiled validators of the JS reference do. Left alone,
    every anchored pattern here would accept a value carrying a trailing
    newline that the other ports reject, and that value would go on to be
    rendered into the SVG.

    The shared schemas cannot settle this by spelling the anchor out, because
    no spelling reads the same everywhere: ``\z`` is unknown to ECMA-262,
    ``\Z`` means "before a trailing newline" in several other engines, and
    ``(?![\s\S])`` needs a lookahead that not every engine has. So the port
    whose engine takes ``$`` the wide way translates it, and :mod:`re` offers
    no flag that would do it here.
    """
    return Draft7Validator(_rewrite(json.loads(raw)))


def _validator(filename: str) -> Draft7Validator:
    """Return the cached :class:`Draft7Validator` for a shared schema file.

    The two draft-07 schemas (``definition.json`` / ``options.json``) ship as
    the ``dicebear-schema`` package — the Python counterpart of the
    ``@dicebear/schema`` (npm) package — and are read via
    :func:`importlib.resources.files`.
    """
    if filename not in _validators:
        raw = files("dicebear_schema").joinpath(filename).read_text("utf-8")
        _validators[filename] = _compile(raw)

    return _validators[filename]


def _collect(error: JsonSchemaError, details: list[ErrorDetail]) -> None:
    """Flatten a jsonschema error tree into ``{message, instancePath}`` leaves."""
    if error.context:
        for sub in error.context:
            _collect(sub, details)

        return

    path = list(error.absolute_path)
    instance_path = "/" + "/".join(str(p) for p in path) if path else ""

    details.append({"message": str(error.validator), "instancePath": instance_path})


def _details(filename: str, data: Any) -> list[ErrorDetail]:
    """Return validation failures for ``data`` against the named schema."""
    errors = sorted(
        _validator(filename).iter_errors(data),
        key=lambda e: list(e.absolute_path),
    )

    details: list[ErrorDetail] = []

    for error in errors[:_MAX_ERRORS]:
        _collect(error, details)

    if errors and len(details) == 0:
        details.append({"message": "Validation failed"})

    return details


class StyleValidator:
    """Validates style definitions against the shared ``definition.json`` schema."""

    @staticmethod
    def validate(data: Any) -> None:
        details = _details("definition.json", data)

        if len(details) > 0:
            raise StyleValidationError(details)


class OptionsValidator:
    """Validates avatar options against the shared ``options.json`` schema."""

    @staticmethod
    def validate(data: Any) -> None:
        details = _details("options.json", data)

        if len(details) > 0:
            raise OptionsValidationError(details)
