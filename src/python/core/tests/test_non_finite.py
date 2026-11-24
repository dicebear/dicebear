import math

import pytest

from dicebear import Avatar, OptionsValidationError, Style

STYLE = Style(
    {
        "canvas": {
            "width": 10,
            "height": 10,
            "elements": [{"type": "component", "name": "eyes"}],
        },
        "components": {
            "eyes": {
                "width": 10,
                "height": 10,
                "variants": {"a": {"elements": []}, "b": {"elements": []}},
            }
        },
    }
)


@pytest.mark.parametrize("value", [math.inf, math.nan])
def test_rejects_a_weight_that_is_not_finite(value: float) -> None:
    with pytest.raises(OptionsValidationError) as error:
        Avatar(STYLE, {"eyesVariant": {"a": value}})

    assert error.value.details[0]["instancePath"] == "/eyesVariant/a"


def test_rejects_a_negative_infinite_weight() -> None:
    with pytest.raises(OptionsValidationError):
        Avatar(STYLE, {"eyesVariant": {"a": -math.inf}})


def test_accepts_a_large_finite_weight() -> None:
    assert str(Avatar(STYLE, {"eyesVariant": {"a": 1e300}})).startswith("<svg")
