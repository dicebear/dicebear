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

::: tip

You do not have to start with an empty canvas. The plugin also imports a
definition file, so you can take an existing style into Figma and change it
there. See [Edit an avatar style with Figma](/create-styles/edit-a-style/).

:::

## Step 1

If you want DiceBear to dynamically change colors in your avatar, you have to
create the colors in Figma as
[locale style](https://help.figma.com/hc/en-us/articles/360039820134-Manage-and-share-styles).
Arrange the colors in
[groups](https://help.figma.com/hc/en-us/articles/360039820134-Manage-and-share-styles#Manage_styles).
Name them according to the following pattern: `<group>/<option-name>`. For
example, `skin/light`.

You will use the locale styles later to colorize paths. DiceBear will then
change the colors of the paths within a group depending on the seed and color
settings. For the names of `<group>` and `<option-name>` you can use
alphanumeric characters as well as hyphens.

In the following example you can see how this could look like:

<video src="/create-styles/with-figma/1.mp4" controls muted></video>

## Step 2

Now assign a color from the created groups to your paths that will be colored
dynamically. Which color from a group does not matter. The important thing is
that the group is correct.

<video src="/create-styles/with-figma/2.mp4" controls muted></video>

## Step 3

Create the individual parts of your avatar as
[components](https://help.figma.com/hc/en-us/articles/360038662654-Guide-to-components-in-Figma).
Again, use the `<group>/<option-name>` naming pattern to create groups.

Identical to the colors, DiceBear will later (taking into account the seed and
the settings) select a component from a group and put it into the avatar.

<video src="/create-styles/with-figma/3.mp4" controls muted></video>

## Step 4

Make sure that each component in a group has the same dimensions.

<video src="/create-styles/with-figma/4.mp4" controls muted></video>

## Step 5

Create as many color and component groups as you like. Then you can bring all
the components together.

To do this,
[create a frame](https://help.figma.com/hc/en-us/articles/360041539473-Frames-in-Figma)
and make sure that the width and height are identical. From the Assets tab, drag
one instance from each component group into the frame.

<video src="/create-styles/with-figma/5.mp4" controls muted></video>

## Step 6

Search now for the
[DiceBear Studio](https://www.figma.com/community/plugin/1005765655729342787)
plugin. Make sure you have selected the frame and start the plugin.

A dialog will open where you can make all kinds of settings. For example the
name of your avatar style, the license or the probability with which the
components will appear in your avatar later.

The settings are automatically saved to your frame. Once you are happy with your
settings, you can export your avatar style.

<video src="/create-styles/with-figma/6.mp4" controls muted></video>

::: tip

Make sure you select version **10.x** in the export settings. This guide covers
version 10.x.

![You can find the version option in the "General" tab](/create-styles/with-figma/version-hint.png)

:::

## Step 7

The plugin exports a JSON file: your
[style definition](/create-styles/definition-schema/). This file is ready to use
immediately, without a build step.

You can test your style right away with the [CLI](/integrations/cli/):

```
dicebear ./your-style.json ./test-output --count 10
```

This generates 10 sample avatars in the `./test-output` directory.

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

	dicebear "github.com/dicebear/dicebear-go/v10"
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
dicebear ./your-style.json ./avatars --seed "dicebear" --format png
```

::: tip

The CLI automatically detects all available options from your style definition.
Use `--help` with your definition file to see them:

```
dicebear ./your-style.json --help
```

:::
