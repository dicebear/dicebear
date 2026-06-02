# DiceBear Core (Python)

Deterministic, customizable, vector-based avatars — the Python port of the
DiceBear core engine. It produces **byte-identical** SVG output to the
JavaScript (`@dicebear/core`) and PHP (`dicebear/core`) implementations for the
same style definition and options.

This package contains only the rendering engine. Avatar **style definitions**
ship separately as language-agnostic JSON via
[`dicebear-styles`](https://pypi.org/project/dicebear-styles/) (or any other
source of a DiceBear style definition).

## Installation

```bash
pip install dicebear-core
```

Requires Python 3.10 or newer.

## Usage

```python
import json
from importlib.resources import files

from dicebear import Avatar

# Load a style definition (here from the dicebear-styles package).
style = json.loads(
    files("dicebear_styles").joinpath("adventurer.json").read_text("utf-8")
)

avatar = Avatar(style, {"seed": "John"})

avatar.to_string()    # the SVG markup
avatar.to_data_uri()  # data:image/svg+xml;charset=utf-8,...
avatar.to_json()      # {"svg": ..., "options": {...resolved options...}}
```

`Avatar` accepts either a raw style-definition dict or a `Style` instance, plus
an optional options dict:

```python
from dicebear import Avatar, Style

style = Style(style_data)
Avatar(style, {"seed": "John", "size": 128, "backgroundColor": ["b6e3f4"]})
```

## Development

This package lives in the
[DiceBear monorepo](https://github.com/dicebear/dicebear) under
`src/python/core`. See `CONTRIBUTING.md` in the repository root for the full
workflow.

```bash
cd src/python/core
pip install -e ".[dev]"
ruff check .
mypy src
pytest
```

The decisive check is `tests/test_parity.py`, which asserts byte-identical
output against the shared fixtures in `tests/fixtures/parity/` (generated from
the JavaScript reference).

## License

[MIT](https://github.com/dicebear/dicebear/blob/10.x/src/python/core/LICENSE)
