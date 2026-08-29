---
title: Python Avatar Library
description: >
  Use the DiceBear Python library to generate SVG profile pictures on the
  server. Python 3.10+ with an API identical to the JavaScript, PHP, Rust, and
  Go libraries.
---

# Python avatar library

Generate avatars right in your Python code (3.10 or higher), with no external
service involved. The API mirrors the
[JavaScript library](/integrations/javascript/), and the output is
byte-identical: the same seed and style produce the same SVG in every DiceBear
library.

## Installation

You need two packages: the core library `dicebear-core` and the avatar style
definitions `dicebear-styles`.

```bash
pip install dicebear-core dicebear-styles
```

## Usage

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/).

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

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Deterministic avatars

The `seed` option is the key to generating deterministic avatars. The same seed
will always produce the same avatar:

```python
avatar1 = Avatar(style, {"seed": "user-123"})
avatar2 = Avatar(style, {"seed": "user-123"})

avatar1.to_string() == avatar2.to_string()  # True
```

## Classes

### `Avatar`

The main class for generating avatars. Pass a `Style` instance and optional
options.

```python
from dicebear import Avatar

avatar = Avatar(style, {
    # ... options
})
```

### `Style`

An immutable wrapper around a style definition. Reuse it when generating
multiple avatars from the same style.

```python
from dicebear import Avatar, Style

style = Style(definition)

avatar1 = Avatar(style, {"seed": "Alice"})
avatar2 = Avatar(style, {"seed": "Bob"})
```

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input.

```python
from dicebear import OptionsDescriptor, Style

descriptor = OptionsDescriptor(Style(definition))
fields = descriptor.to_json()
```

## Methods

### `to_string()` / `str(avatar)`

**Return type:** `str`

Returns the avatar as SVG in XML format. The `__str__` method allows using the
avatar directly in string contexts.

```python
avatar = Avatar(style, {"seed": "Alice"})

svg = avatar.to_string()
# or
svg = str(avatar)
```

### `to_json()`

**Return type:** `dict` with keys `svg` and `options`

Returns a dict with the SVG and the resolved options.

```python
avatar = Avatar(style, {"seed": "Alice"})

result = avatar.to_json()

# result["svg"]     → '<svg>...</svg>'
# result["options"] → {"seed": "Alice", ...}
```

### `to_data_uri()`

**Return type:** `str`

Returns the avatar as [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme).

```python
avatar = Avatar(style, {"seed": "Alice"})

data_uri = avatar.to_data_uri()

# <img src="{data_uri}" alt="Avatar" />
```

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

### Avatar with custom background

```python
avatar = Avatar(style, {
    "seed": "Alice",
    "backgroundColor": ["#b6e3f4", "#c0aede", "#d1d4f9"],
})
```

### Fixed size avatar

```python
from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("bottts.json").read_text("utf-8")
)

avatar = Avatar(style, {
    "seed": "robot-42",
    "size": 128,
    "borderRadius": 50,  # circular avatar
})
```

### Avatar with transformations

```python
from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("avataaars.json").read_text("utf-8")
)

avatar = Avatar(style, {
    "seed": "Jane",
    "flip": "horizontal",
    "rotate": 10,
    "scale": 0.9,
    "translateY": 5,
})
```

### Multiple avatars on the same page

When rendering multiple avatars on the same page, use `idRandomization` to
prevent SVG ID conflicts:

```python
from dicebear import Avatar, Style

style = Style(definition)
users = ["alice", "bob", "charlie"]

avatars = [
    Avatar(style, {"seed": user, "idRandomization": True}).to_string()
    for user in users
]
```

### Weighted variant selection

```python
avatar = Avatar(style, {
    "seed": "Alice",
    "topVariant": {"short01": 2, "short02": 2, "long01": 1},
})
```
