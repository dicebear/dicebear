"""Validation of avatar options."""

from __future__ import annotations

import math
from typing import Any

from ..errors import OptionsValidationError
from ._depth import MAX_DEPTH_MESSAGE, exceeds_max_depth
from ._schema import OptionsSchemaValidator


def _non_finite(value: Any, path: str = "") -> str | None:
    """JSON pointer of the first number in ``value`` that is not finite.

    JSON cannot carry Infinity or NaN, and the other ports turn such a value
    down. The schema leaves a variant weight without a maximum, so ``inf``
    passed it here. Runs after the depth check, so ``value`` nests at most a
    few levels.
    """
    if isinstance(value, float):
        return None if math.isfinite(value) else path

    if isinstance(value, dict):
        items: Any = value.items()
    elif isinstance(value, list):
        items = enumerate(value)
    else:
        return None

    for key, inner in items:
        pointer = f"{path}/{str(key).replace('~', '~0').replace('/', '~1')}"
        found = _non_finite(inner, pointer)

        if found is not None:
            return found

    return None


class OptionsValidator:
    """Validates avatar options: the nesting limit, the shared ``options.json``
    schema and that every number is finite, in that order.
    """

    @staticmethod
    def validate(data: Any) -> None:
        if exceeds_max_depth(data):
            raise OptionsValidationError([{"message": MAX_DEPTH_MESSAGE}])

        OptionsSchemaValidator.validate(data)

        non_finite = _non_finite(data)

        if non_finite is not None:
            raise OptionsValidationError(
                [
                    {
                        "instancePath": non_finite,
                        "message": "must be a finite number",
                    }
                ]
            )
