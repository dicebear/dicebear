<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Core (Python)</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)

Python implementation of the DiceBear avatar library. Generates deterministic
SVG avatars from style definitions and a seed string.

DiceBear is available for multiple languages. All implementations share the same
PRNG and rendering pipeline, producing identical SVG output for the same seed,
style, and options, regardless of the language used.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/integrations/python/)

## Installation

```sh
pip install dicebear-core
```

Requires Python 3.10 or newer.

## Usage

```python
import json
from importlib.resources import files

from dicebear import Avatar

# From a style definition (here from the dicebear-styles package)
definition = json.loads(
    files("dicebear_styles").joinpath("lorelei.json").read_text("utf-8")
)

avatar = Avatar(definition, {"seed": "John Doe", "size": 128})

avatar.to_string()  # SVG string
avatar.to_data_uri()  # data:image/svg+xml;charset=utf-8,...
```

### Using the Style class

```python
from dicebear import Avatar, Style

style = Style(definition)

# Create multiple avatars from the same style
avatar1 = Avatar(style, {"seed": "Alice"})
avatar2 = Avatar(style, {"seed": "Bob"})
```

## Sponsors

Advertisement: Many thanks to our sponsors who provide us with free or
discounted products.

<a href="https://bunny.net/" target="_blank" rel="noopener noreferrer">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://www.dicebear.com/sponsors/bunny-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://www.dicebear.com/sponsors/bunny-dark.svg">
        <img alt="bunny.net" src="https://www.dicebear.com/sponsors/bunny-dark.svg" height="64">
    </picture>
</a>
