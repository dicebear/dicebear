"""JSON Schema validation against the shared draft-07 schemas."""

from __future__ import annotations

import json
from importlib.resources import files
from typing import Any

from jsonschema import Draft7Validator
from jsonschema.exceptions import ValidationError as JsonSchemaError

from .errors import ErrorDetail, OptionsValidationError, StyleValidationError

_MAX_ERRORS = 10

_validators: dict[str, Draft7Validator] = {}


def _validator(filename: str) -> Draft7Validator:
    """Return the cached :class:`Draft7Validator` for a shared schema file.

    The two draft-07 schemas (``definition.json`` / ``options.json``) ship as
    the ``dicebear-schema`` package — the Python counterpart of the
    ``@dicebear/schema`` (npm) / ``dicebear/schema`` (Composer) packages the
    JS/PHP ports pin — and are read via :func:`importlib.resources.files`.
    """
    if filename not in _validators:
        raw = files("dicebear_schema").joinpath(filename).read_text("utf-8")
        _validators[filename] = Draft7Validator(json.loads(raw))

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
