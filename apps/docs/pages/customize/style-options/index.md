---
title: Access All Available Style Options Programmatically
description: >
  Learn how to programmatically access all available options of a DiceBear
  avatar style using the OptionsDescriptor class.
---

# Access style options programmatically

Each avatar style has different options, depending on its components and colors.
The `OptionsDescriptor` class lists them at runtime, for example to build a UI
or to validate user input. The HTTP API serves the list as `options.json`, minus
the options the API doesn't accept.

::: code-group

```http [HTTP API]
https://api.dicebear.com/11.x/micah/options.json
```

```js [JavaScript]
import { Style, OptionsDescriptor } from '@dicebear/core';
import definition from '@dicebear/styles/micah.json' with { type: 'json' };

const style = new Style(definition);
const descriptor = new OptionsDescriptor(style);

console.log(descriptor.toJSON());
```

```php [PHP]
use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\OptionsDescriptor;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/micah.json'));

$descriptor = new OptionsDescriptor($style);

print_r($descriptor->toJSON());
```

```python [Python]
from importlib.resources import files

from dicebear import OptionsDescriptor, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("micah.json").read_text("utf-8")
)

descriptor = OptionsDescriptor(style)

print(descriptor.to_json())
```

```rust [Rust]
// cargo add dicebear-styles --features micah
use dicebear_core::{OptionsDescriptor, Style};

let style = Style::from_str(dicebear_styles::MICAH)?;
let descriptor = OptionsDescriptor::new(&style).to_json();

println!("{descriptor}");
```

```go [Go]
import (
	"fmt"

	dicebear "github.com/dicebear/dicebear-go/v11"
	"github.com/dicebear/styles/v11"
)

style, _ := dicebear.NewStyle([]byte(styles.Micah))
descriptor := dicebear.NewOptionsDescriptor(style).ToJSON()

fmt.Println(descriptor)
```

```dart [Dart]
import 'dart:convert';

import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/micah.dart';

final style = Style.parse(micah);
final descriptor = OptionsDescriptor(style);

print(jsonEncode(descriptor.toJson()));
```

```csharp [C#]
using DiceBear;

var style = Style.Parse(Styles.Micah);
var descriptor = new OptionsDescriptor(style).ToJson();

Console.WriteLine(descriptor.ToJsonString());
```

:::

## Field descriptor types

The descriptor maps each option name to a field descriptor. Each descriptor has
a `type` and further properties depending on the type:

| Type      | Properties                            | Example option           |
| --------- | ------------------------------------- | ------------------------ |
| `string`  | `list?`                               | `seed`, `fontFamily`     |
| `number`  | `min?`, `max?`, `list?`               | `fontWeight`             |
| `boolean` |                                       | `idRandomization`        |
| `enum`    | `values`, `list?`, `weighted?`        | `flip`, `*Variant`       |
| `color`   | `list?`, `contrastTo?`, `notEqualTo?` | `*Color`                 |
| `range`   | `min?`, `max?`                        | `rotate`, `borderRadius` |

- `list` means the option also accepts an array of values.
- `weighted` means an enum option also accepts a map of weights, such as
  `{ round: 4, mono: 1 }`.
- `contrastTo` names the color group this group is contrasted against, so a UI
  can show that the renderer picks this color for contrast rather than at
  random.
- `notEqualTo` lists the color groups this group must differ from. A UI that
  picks colors itself has to apply the same rule, because with a single explicit
  color per group the renderer has nothing left to filter.

`contrastTo` and `notEqualTo` only appear when the style definition declares
them. Component aliases (declared with `extends`) have no entries of their own
and share the options of their source component.
