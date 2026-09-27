---
title: Python Avatar Library
description: >
  Use the DiceBear Python library to generate SVG profile pictures on the
  server. Python 3.10+ with an API identical to the JavaScript, PHP, Rust, and
  Go libraries.
---

# Python avatar library

Generate avatars right in your Python code (3.10 or higher), with no external
service involved.

The API mirrors the [JavaScript library](/integrations/javascript/), and the
output is byte-identical: the same seed and style produce the same SVG in every
DiceBear library.

## Installation

You need two packages: the core library `dicebear-core` and the avatar style
definitions `dicebear-styles`.

```sh
pip install dicebear-core dicebear-styles
```

## Usage

```python
from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("lorelei.json").read_text("utf-8")
)

avatar = Avatar(style, {
    "seed": "John",
    # ... other options
})

svg = avatar.to_string()
```

Every style has its own options, listed on its [style page](/styles/).

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Classes

- `Style` is an immutable wrapper around a style definition. `Style.from_json()`
  reads a JSON string, `Style(definition)` takes the decoded definition. Build
  it once and reuse it for every avatar of that style.
- `Avatar` renders one avatar from a `Style` and an optional dict of options.
- `OptionsDescriptor` describes all valid options of a style, for building UIs
  or validating user input: `OptionsDescriptor(style).to_json()`. See
  [Style options](/customize/style-options/).

## Methods

| Method                         | Returns                                                                    |
| ------------------------------ | -------------------------------------------------------------------------- |
| `to_string()` or `str(avatar)` | The SVG as a `str`                                                         |
| `to_json()`                    | A `dict` with the SVG under `svg` and the resolved options under `options` |
| `to_data_uri()`                | The SVG as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)     |

## Core options

These options are the same across every DiceBear core. See
[Core options](/customize/options/) for the full reference. Here are the options
in Python syntax:

```python
avatar = Avatar(style, {
    "seed": "Alice",
    "flip": "horizontal",            # "none", "horizontal", "vertical", "both"
    "rotate": 10,                    # -360 to 360, or [min, max] range
    "scale": 0.9,                    # 0 to 10 (1 = original), or [min, max] range
    "borderRadius": 50,              # 0-50 (50 = circle)
    "size": 128,
    "translateX": 0,                 # -1000 to 1000 (percent of canvas width)
    "translateY": 0,                 # -1000 to 1000 (percent of canvas height)
    "idRandomization": True,
    "title": "User Avatar",
    "fontFamily": "Arial",           # or ["Arial", "Helvetica"]
    "fontWeight": 700,               # 1-1000
    "backgroundColor": ["#b6e3f4", "#c0aede"],
    "backgroundColorFill": "solid",  # "solid", "linear", "radial"
})
```

Dynamic component and color options also work the same way. See
[Dynamic component options](/customize/options/#dynamic-component-options) for
all available patterns.

## Examples

### Multiple avatars on the same page

When you inline several avatars into one page, use `idRandomization` to keep
their SVG IDs from colliding:

```python
avatars = [
    Avatar(style, {"seed": user, "idRandomization": True}).to_string()
    for user in ["alice", "bob", "charlie"]
]
```

### Weighted variant selection

A weight map makes some variants more likely than others. Here lorelei picks
`happy01` or `happy02` mouths twice as often as `sad01`:

```python
avatar = Avatar(style, {
    "seed": "Alice",
    "mouthVariant": {"happy01": 2, "happy02": 2, "sad01": 1},
})
```
