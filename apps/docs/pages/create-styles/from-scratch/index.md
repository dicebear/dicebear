---
title: Create an Avatar Style from Scratch
description: >
  Learn how to create a DiceBear avatar style from scratch by writing a JSON
  definition file. No Figma or design tools required.
---

# Create an avatar style from scratch

We highly recommend our
[Figma plugin](/create-styles/with-figma/) to create an avatar
style. Most of DiceBear's official avatar styles were created with the plugin.
But you can also create an avatar style by writing a JSON
[definition file](/create-styles/definition-schema/) by hand.

## Minimal example

A minimal style definition with a colored circle:

```json
{
  "canvas": {
    "width": 100,
    "height": 100,
    "elements": [
      {
        "type": "element",
        "name": "circle",
        "attributes": {
          "cx": "50",
          "cy": "50",
          "r": "45",
          "fill": { "type": "color", "name": "background" }
        }
      }
    ]
  },
  "colors": {
    "background": {
      "values": ["#f94144", "#f9c74f", "#90be6d", "#43aa8b", "#577590"]
    }
  }
}
```

Save this as `my-style.json` and test it:

```
dicebear ./my-style.json ./output --count 5
```

The PRNG picks a different background color for each seed.

## Adding components

Components are the randomizable parts of your avatar. Each component has
multiple variants that the PRNG can choose from.

Let's add a face component with two variants:

```json
{
  "canvas": {
    "width": 100,
    "height": 100,
    "elements": [
      {
        "type": "element",
        "name": "circle",
        "attributes": {
          "cx": "50",
          "cy": "50",
          "r": "45",
          "fill": { "type": "color", "name": "background" }
        }
      },
      {
        "type": "component",
        "name": "face"
      }
    ]
  },
  "components": {
    "face": {
      "width": 100,
      "height": 100,
      "variants": {
        "smile": {
          "elements": [
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "35", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "65", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "path",
              "attributes": {
                "d": "M 30 60 Q 50 80 70 60",
                "stroke": "#000",
                "stroke-width": "3",
                "fill": "none"
              }
            }
          ]
        },
        "neutral": {
          "elements": [
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "35", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "circle",
              "attributes": { "cx": "65", "cy": "40", "r": "4", "fill": "#000" }
            },
            {
              "type": "element",
              "name": "line",
              "attributes": {
                "x1": "35",
                "y1": "62",
                "x2": "65",
                "y2": "62",
                "stroke": "#000",
                "stroke-width": "3"
              }
            }
          ]
        }
      }
    }
  },
  "colors": {
    "background": {
      "values": ["#f94144", "#f9c74f", "#90be6d", "#43aa8b", "#577590"]
    }
  }
}
```

The `canvas.elements` array references the `face` component via
`{ "type": "component", "name": "face" }`. The PRNG selects either the `smile`
or `neutral` variant.

## Multiple components

You can add as many components as you like. Each component is independent: the
PRNG selects a variant for each one separately.

```json
{
  "components": {
    "eyes": {
      "width": 100,
      "height": 100,
      "variants": {
        "round": { "elements": [...] },
        "narrow": { "elements": [...] }
      }
    },
    "mouth": {
      "width": 100,
      "height": 100,
      "variants": {
        "smile": { "elements": [...] },
        "open": { "elements": [...] },
        "flat": { "elements": [...] }
      }
    },
    "accessories": {
      "width": 100,
      "height": 100,
      "probability": 30,
      "variants": {
        "glasses": { "elements": [...] },
        "hat": { "elements": [...] }
      }
    }
  }
}
```

### Probability

The `probability` property (0-100) controls how often a component appears. In
the example above, `accessories` only appears in ~30% of generated avatars.
Default is `100` (always visible).

### Variant weights

Control how often specific variants are selected:

```json
{
  "variants": {
    "common": { "weight": 3, "elements": [...] },
    "uncommon": { "weight": 1, "elements": [...] },
    "rare": { "weight": 0, "elements": [...] }
  }
}
```

Higher weight = more likely to be selected. Weight `0` is only chosen when all
other weights are also `0`. Default weight is `1`.

### Component transforms

Components can have default rotation, translation, and scale ranges that the
PRNG samples per render. All four fields use the same `{ min, max, step? }`
range object. See [Ranges](/create-styles/definition-schema/#ranges) for the
full reference.

```json
{
  "eyes": {
    "width": 80,
    "height": 40,
    "rotate": { "min": -5, "max": 5 },
    "scale": { "min": 0.95, "max": 1.05 },
    "translate": {
      "x": { "min": -2, "max": 2 },
      "y": { "min": -3, "max": 3 }
    },
    "variants": { ... }
  }
}
```

Set `min === max` for a fixed value, or add `"step": <n>` to quantize the range
to discrete buckets.

## Color palettes

Colors can be referenced from element attributes. The PRNG picks a value from
the palette for each avatar.

```json
{
  "colors": {
    "skin": {
      "values": ["#f5d6c3", "#d4a889", "#a67c5b", "#614335"]
    },
    "hair": {
      "values": ["#2c1b18", "#b58143", "#d6b370", "#724133"],
      "notEqualTo": ["skin"]
    },
    "text": {
      "values": ["#ffffff", "#000000"],
      "contrastTo": "background"
    }
  }
}
```

### Color references

Use color references in SVG attributes to apply dynamic colors:

```json
{
  "type": "element",
  "name": "circle",
  "attributes": {
    "fill": { "type": "color", "name": "skin" }
  }
}
```

### Color constraints

**`notEqualTo`** prevents two color groups from selecting the same color. In the
example above, `hair` will never be the same color as `skin`.

**`contrastTo`** picks the color with the highest contrast ratio against the
referenced color group. This is useful for ensuring text is readable against a
background.

## Metadata

Add metadata to your definition for license attribution:

```json
{
  "meta": {
    "license": {
      "name": "CC BY 4.0",
      "url": "https://creativecommons.org/licenses/by/4.0/",
      "text": "Full license text..."
    },
    "creator": {
      "name": "Your Name",
      "url": "https://your-website.com"
    },
    "source": {
      "name": "My Style",
      "url": "https://github.com/your/repo"
    }
  }
}
```

This metadata appears in:

- The `<metadata>` RDF block inside generated SVGs (Dublin Core terms; see the
  [Core implementation spec](/create-styles/implement-dicebear-core/#metadata-block))
- The CLI license banner
- The documentation (if your style is added to the official collection)

## Schema validation

Add the `$schema` property to enable validation in your editor:

```json
{
  "$schema": "https://cdn.hopjs.net/npm/@dicebear/schema@1.0.0/dist/definition.min.json",
  "canvas": { ... }
}
```

Most editors (VS Code, WebStorm, etc.) will provide autocompletion and inline
validation for your definition file.

## Testing

### With the CLI

```
dicebear ./my-style.json ./output --count 10
dicebear ./my-style.json ./output --seed "Alice" --format png
```

### With the JS Library

```js
import { Style, Avatar } from '@dicebear/core';
import definition from './my-style.json' with { type: 'json' };

const style = new Style(definition);
const avatar = new Avatar(style, { seed: 'test' });
console.log(avatar.toString());
```

### With the PHP Library

```php
use DiceBear\Avatar;
use DiceBear\Style;

$style = Style::fromJson(file_get_contents('./my-style.json'));
$avatar = new Avatar($style, ['seed' => 'test']);
echo (string) $avatar;
```

### With the Python Library

```python
from pathlib import Path

from dicebear import Avatar, Style

style = Style.from_json(Path("./my-style.json").read_text("utf-8"))
avatar = Avatar(style, {"seed": "test"})
print(avatar.to_string())
```

### With the Rust Library

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;
use std::fs;

let definition = fs::read_to_string("./my-style.json")?;
let style = Style::from_str(&definition)?;

let avatar = Avatar::new(&style, json!({ "seed": "test" }))?;
println!("{}", avatar.to_svg());
```

### With the Go Library

```go
import (
	"fmt"
	"os"

	dicebear "github.com/dicebear/dicebear-go/v10"
)

definition, _ := os.ReadFile("./my-style.json")
style, _ := dicebear.NewStyle(definition)

avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "test"})
fmt.Println(avatar.SVG())
```

### With the Dart Library

```dart
import 'dart:io';

import 'package:dicebear_core/dicebear_core.dart';

final style = Style.parse(File('./my-style.json').readAsStringSync());

final avatar = Avatar(style, {'seed': 'test'});
print(avatar.svg);
```

### With the C# Library

```csharp
using System.Text.Json.Nodes;
using DiceBear;

var style = Style.Parse(File.ReadAllText("./my-style.json"));

var avatar = new Avatar(style, new JsonObject { ["seed"] = "test" });
Console.WriteLine(avatar.ToSvg());
```

## Next steps

- See the [Definition Schema Reference](/create-styles/definition-schema/) for
  the complete specification
- Browse the [official definitions](https://github.com/dicebear/styles) for
  real-world examples
- Use the [Figma plugin](/create-styles/with-figma/) for a
  visual workflow
