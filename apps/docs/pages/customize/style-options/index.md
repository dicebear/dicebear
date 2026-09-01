---
title: Access All Available Style Options Programmatically
description: >
  Learn how to programmatically access all available options of a DiceBear
  avatar style using the OptionsDescriptor class.
---

# How to programmatically access all available options of an avatar style?

Each avatar style has different options depending on its components and colors.
The `OptionsDescriptor` class lets you discover all available options at
runtime.

## JavaScript

```js
import { Style, OptionsDescriptor } from '@dicebear/core';
import definition from '@dicebear/styles/micah.json' with { type: 'json' };

const style = new Style(definition);
const descriptor = new OptionsDescriptor(style);

console.log(descriptor.toJSON());
```

## PHP

```php
use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/micah.json'));

$descriptor = new OptionsDescriptor($style);

print_r($descriptor->toJSON());
```

## Python

```python
from importlib.resources import files

from dicebear import OptionsDescriptor, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("micah.json").read_text("utf-8")
)

descriptor = OptionsDescriptor(style)

print(descriptor.to_json())
```

## Go

```go
import (
	"fmt"

	dicebear "github.com/dicebear/dicebear-go/v11"
	"github.com/dicebear/styles/v11"
)

style, _ := dicebear.NewStyle([]byte(styles.Micah))
descriptor := dicebear.NewOptionsDescriptor(style).ToJSON()

fmt.Println(descriptor)
```

## Dart

```dart
import 'dart:convert';

import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/micah.dart';

final style = Style.parse(micah);
final descriptor = OptionsDescriptor(style);

print(jsonEncode(descriptor.toJson()));
```

## C#

```csharp
using DiceBear;

var style = Style.Parse(Styles.Micah);
var descriptor = new OptionsDescriptor(style).ToJson();

Console.WriteLine(descriptor.ToJsonString());
```

## Field descriptor types

The `toJSON()` method returns a map of option names to field descriptors. Each
descriptor has a `type` and additional properties depending on the type:

| Type      | Properties                            | Example option           |
| --------- | ------------------------------------- | ------------------------ |
| `string`  | `list?`                               | `seed`, `fontFamily`     |
| `number`  | `min?`, `max?`, `list?`               | `fontWeight`             |
| `boolean` |                                       | `idRandomization`        |
| `enum`    | `values`, `list?`, `weighted?`        | `flip`, `*Variant`       |
| `color`   | `list?`, `contrastTo?`, `notEqualTo?` | `*Color`                 |
| `range`   | `min?`, `max?`                        | `rotate`, `borderRadius` |

- `list` indicates the option also accepts an array of values.
- `weighted` (on enum fields) means the option additionally accepts a
  `Record<string, number>` weight map for PRNG selection.
- `contrastTo` (on color fields) names the color group the renderer will
  contrast against, so UIs can flag that this group's selection is
  contrast-driven rather than random. Only set when the style definition
  declares a `contrastTo` constraint on the group.
- `notEqualTo` (on color fields) lists the color groups this group must differ
  from. A UI that picks colors itself has to apply the same rule, because a
  single explicit color per group leaves the renderer nothing to filter. Only
  set when the style definition declares a `notEqualTo` constraint on the group.

Component aliases (declared via `extends` in the definition) do not contribute
their own `${alias}Variant` / `${alias}Probability` entries to the descriptor.
They share their source component's user options.
