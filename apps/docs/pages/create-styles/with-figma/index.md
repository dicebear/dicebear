---
title: Create an Avatar Style with Figma
description: >
  Step-by-step guide to creating a custom DiceBear avatar style using the
  DiceBear Studio plugin for Figma.
---

# Create an avatar style with Figma

Our [Figma plugin](https://www.figma.com/community/plugin/1005765655729342787)
is the easiest way to create an avatar style for DiceBear. The following
tutorial requires basic knowledge about [Figma](https://www.figma.com/).

::: tip Looking for something else?

This guide draws a style from scratch. The plugin has two more guides:

- You want to change one of our styles instead of starting empty:
  [Edit an avatar style with Figma](/create-styles/edit-a-style/)
- You only want avatars in your designs, no style of your own:
  [Figma plugin](/integrations/figma/)

:::

The screenshots below build a small style called "shape-face" out of two
component groups, `face` and `eyes`, with a color group for each. Your style can
have as many groups as you like, the steps stay the same.

## Step 1

If you want DiceBear to change the colors of your avatar, create the colors as
[color styles](https://help.figma.com/hc/en-us/articles/360039820134-Manage-and-share-styles)
in Figma. With nothing selected, the Design panel shows a Styles section, and
its plus button creates a new style.

Name every color `<group>/<option-name>`, for example `face/yellow`. The slash
puts the colors into
[groups](https://help.figma.com/hc/en-us/articles/360039820134-Manage-and-share-styles#Manage_styles),
and each group becomes one color option of your style. DiceBear later picks a
color from the group, depending on the seed and the settings. For `<group>` and
`<option-name>` you can use letters, digits and hyphens.

![The Styles section of the Design panel with the color groups face and eyes](/create-styles/with-figma/1.webp)

## Step 2

Assign a color from one of the groups to every path that should be colored
dynamically. Which color of the group you pick does not matter, only the group
counts.

![A selected rectangle with the color style face/yellow as its fill](/create-styles/with-figma/2.webp)

## Step 3

Turn the individual parts of your avatar into
[components](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma).
Name them with the same `<group>/<option-name>` pattern, for example
`face/rectangle`, then right-click and choose Create component.

A component group works like a color group: DiceBear picks one component from it
for every avatar, depending on the seed and the settings.

![The context menu of a layer named face/rectangle, with Create component highlighted](/create-styles/with-figma/3.webp)

## Step 4

Every component of a group needs the same width and height. The fastest way is
to select all components of a group and set the size once, which changes all of
them together.

## Step 5

Create as many color and component groups as you like, then bring everything
together in one
[frame](https://help.figma.com/hc/en-us/articles/360041539473-Frames-in-Figma).
Its width and height must be identical, and Clip content should be on.

![A new 100 by 100 frame with Clip content turned on](/create-styles/with-figma/4.webp)

Open the Assets panel and drag one instance from each component group into the
frame. The plugin reads the group from the instance, so which variant you pick
does not matter.

![The Assets panel with the components of the file, and the frame holding one face and one eyes instance](/create-styles/with-figma/5.webp)

The frame now holds one instance per group.

![The Layers panel with the frame and its two instances](/create-styles/with-figma/6.webp)

## Step 6

Select the frame, then start the
[DiceBear Studio](https://www.figma.com/community/plugin/1005765655729342787)
plugin. The quickest way is the Actions search in the toolbar.

![The Actions search in Figma with "dicebear studio" typed in](/create-styles/with-figma/7.webp)

The plugin opens on the tab you used last. Switch to the Style tab in the rail
on the left. With your frame selected, the tab shows the settings of your style:
the title, the license, and one entry per component group and color group.
Everything you change here is saved on your frame, so it is there again the next
time you open the plugin.

![The Style tab of the plugin with the General settings of the frame](/create-styles/with-figma/8.webp)

Every component group has four tabs. Settings holds the probability with which
the component appears at all, and the ranges for rotation, translation and scale
that DiceBear picks from. Weights make one variant more likely than another.
Tags describe a variant, for example `mood:positive`, so that a user of your
style can filter variants when rendering. Normalize trims every variant of the
group to the same frame size and keeps the drawing where it is. A color group
has two settings: whether its color must contrast with another group, and which
groups it must not share a color with.

![The Settings tab of the eyes component group, with the four tabs of a component group](/create-styles/with-figma/9.webp)

When you are happy with your settings, click Export definition.

## Step 7

The plugin exports a JSON file: your
[style definition](/create-styles/definition-schema/). This file is ready to use
immediately, without a build step.

You can test your style right away with the [CLI](/integrations/cli/):

```
dicebear create ./your-style.json -o ./test-output --count 10
```

This generates 10 sample avatars in the `./test-output` directory.

To use the style in Figma itself, upload the definition to the library of the
plugin's Generate tab. It is then available in every file you open, see
[Use your own styles](/integrations/figma/#use-your-own-styles).

## Step 8

Congratulations! You can now use your avatar style with the
[JS Library](/integrations/javascript/), the [PHP Library](/integrations/php/),
the [Python Library](/integrations/python/), the
[Rust Library](/integrations/rust/), the [Go Library](/integrations/go/), the
[Dart Library](/integrations/dart/), [C# Library](/integrations/csharp/), or the
[CLI](/integrations/cli/).

### With the JS Library

```js
import { Style, Avatar } from '@dicebear/core';
import definition from './your-style.json' with { type: 'json' };

const style = new Style(definition);
const avatar = new Avatar(style, {
  seed: 'dicebear',
  // ... other options
});
```

### With the PHP Library

```php
use DiceBear\Avatar;
use DiceBear\Style;

$style = Style::fromJson(file_get_contents('./your-style.json'));

$avatar = new Avatar($style, [
  'seed' => 'dicebear',
  // ... other options
]);
```

### With the Python Library

```python
from pathlib import Path

from dicebear import Avatar, Style

style = Style.from_json(Path("./your-style.json").read_text("utf-8"))

avatar = Avatar(style, {
    "seed": "dicebear",
    # ... other options
})
```

### With the Rust Library

```rust
use dicebear_core::{Avatar, Style};
use serde_json::json;
use std::fs;

let definition = fs::read_to_string("./your-style.json")?;
let style = Style::from_str(&definition)?;

let avatar = Avatar::new(&style, json!({
    "seed": "dicebear",
    // ... other options
}))?;
```

### With the Go Library

```go
import (
	"os"

	dicebear "github.com/dicebear/dicebear-go/v11"
)

definition, _ := os.ReadFile("./your-style.json")
style, _ := dicebear.NewStyle(definition)

avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed": "dicebear",
	// ... other options
})
```

### With the Dart Library

```dart
import 'dart:io';

import 'package:dicebear_core/dicebear_core.dart';

final style = Style.parse(File('./your-style.json').readAsStringSync());

final avatar = Avatar(style, {
  'seed': 'dicebear',
  // ... other options
});
```

### With the C# Library

```csharp
using System.Text.Json.Nodes;
using DiceBear;

var style = Style.Parse(File.ReadAllText("./your-style.json"));

var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "dicebear",
    // ... other options
});
```

### With the CLI

```
dicebear create ./your-style.json -o ./avatar.png --seed "dicebear"
```

::: tip

The CLI automatically detects all available options from your style definition.
Use `--help` with your definition file to see them:

```
dicebear create ./your-style.json --help
```

:::
