"""Domain error types raised by the core."""

from __future__ import annotations

from typing import TypedDict


class ErrorDetail(TypedDict, total=False):
    """A single schema-validation failure."""

    message: str
    instancePath: str


class ValidationError(RuntimeError):
    """Base class for schema validation errors.

    Carries the prefix in the exception message and the per-field failures in
    :attr:`details`.
    """

    def __init__(self, prefix: str, details: list[ErrorDetail]) -> None:
        parts: list[str] = []

        for detail in details:
            segments: list[str] = []

            instance_path = detail.get("instancePath", "")
            if instance_path != "":
                segments.append(instance_path)

            message = detail.get("message", "")
            if message != "":
                segments.append(message)

            parts.append(" ".join(segments))

        super().__init__(prefix + ": " + ", ".join(parts))
        self.details = details


class OptionsValidationError(ValidationError):
    """Raised when avatar options fail schema validation."""

    def __init__(self, details: list[ErrorDetail]) -> None:
        super().__init__("Invalid options", details)


class StyleValidationError(ValidationError):
    """Raised when a style definition fails schema validation."""

    def __init__(self, details: list[ErrorDetail]) -> None:
        super().__init__("Invalid style definition", details)


class CircularColorReferenceError(RuntimeError):
    """Raised when a color references itself, directly or indirectly.

    The :attr:`chain` field reproduces the resolution path.
    """

    def __init__(self, chain: list[str]) -> None:
        path = " → ".join(chain)

        super().__init__(f"Circular color reference: {path}")
        self.chain = chain
