---
title: Load All Avatar Styles at Once
description: >
  Load every official DiceBear avatar style at once, for a style picker, a
  gallery or a batch job. Examples for JavaScript, PHP, Python, Rust, Go, Dart
  and C#.
---

# Load all avatar styles

Most projects need one or two avatar styles. For a style picker, a gallery page
or a batch job you want all of them at once. The styles package of every
language ships all official styles, and each snippet loads them into a map from
style name to style:

::: code-group

```js [JavaScript]
import { Style, Avatar } from '@dicebear/core';
import { all, get } from '@dicebear/styles';

const styles = Object.fromEntries(
  await Promise.all(
    all().map(async (name) => [name, new Style(await get(name))]),
  ),
);

const avatar = new Avatar(styles.lorelei, { seed: 'Alice' });
```

```php [PHP]
<?php

use Composer\InstalledVersions;
use DiceBear\Avatar;
use DiceBear\Style;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$files    = glob($basePath . '/src/*.json');

$styles = [];
foreach ($files as $file) {
    $name = basename($file, '.json');

    $styles[$name] = Style::fromJson(file_get_contents($file));
}

$avatar = new Avatar($styles['lorelei'], ['seed' => 'Alice']);
```

```python [Python]
from importlib.resources import files

from dicebear import Avatar, Style

styles = {
    resource.name.removesuffix(".json"): Style.from_json(
        resource.read_text("utf-8")
    )
    for resource in files("dicebear_styles").iterdir()
    if resource.name.endswith(".json")
}

avatar = Avatar(styles["lorelei"], {"seed": "Alice"})
```

```rust [Rust]
// cargo add dicebear-styles --features all
use std::collections::HashMap;

use dicebear_core::{Avatar, Style};
use serde_json::json;

let mut styles = HashMap::new();
for name in dicebear_styles::all() {
    let definition = dicebear_styles::get(name).expect("style is embedded");
    styles.insert(name, Style::from_str(definition)?);
}

let avatar = Avatar::new(&styles["lorelei"], json!({ "seed": "Alice" }))?;
```

```go [Go]
import (
	dicebear "github.com/dicebear/dicebear-go/v11"
	"github.com/dicebear/styles/v11"
)

parsed := map[string]*dicebear.Style{}
for _, name := range styles.All() {
	definition, _ := styles.Get(name)
	style, err := dicebear.NewStyle([]byte(definition))
	if err != nil {
		panic(err)
	}
	parsed[name] = style
}

avatar, _ := dicebear.NewAvatar(parsed["lorelei"], map[string]any{"seed": "Alice"})
```

```dart [Dart]
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/dicebear_styles.dart' as styles;

final parsed = {
  for (final name in styles.all) name: Style.parse(styles.get(name)!),
};

final avatar = Avatar(parsed['lorelei']!, {'seed': 'Alice'});
```

```csharp [C#]
using System.Text.Json.Nodes;
using DiceBear;

var parsed = Styles
    .All()
    .ToDictionary(name => name, name => Style.Parse(Styles.Get(name)!));

var avatar = new Avatar(parsed["lorelei"], new JsonObject { ["seed"] = "Alice" });
```

:::

Loading every style also ships every style. The Go module and the C# package
embed all of them anyway. In Rust it takes the `all` feature, and in Dart the
umbrella library `package:dicebear_styles/dicebear_styles.dart` pulls every
style into the app. In JavaScript, `get()` imports a definition only when it
runs, and bundlers keep each one in a chunk of its own. Parsing all
%STYLE_COUNT% definitions up front costs time and memory too, so if you only
need a handful, load those directly as the
[library pages](/start/pick-your-integration/#the-libraries) show.
