---
title: Load All Avatar Styles from @dicebear/styles
description: >
  Learn how to load every avatar style shipped with @dicebear/styles at once in
  Node.js, PHP, Python, Rust, Go, Dart and C#.
---

# How to load all avatar styles from `@dicebear/styles`?

The [DiceBear styles repository](https://github.com/dicebear/styles) ships every
official avatar style as a separate JSON file. It is distributed as
[`@dicebear/styles`](https://www.npmjs.com/package/@dicebear/styles) on npm,
[`dicebear/styles`](https://packagist.org/packages/dicebear/styles) on
Packagist, [`dicebear-styles`](https://pypi.org/project/dicebear-styles/) on
PyPI, [`dicebear-styles`](https://crates.io/crates/dicebear-styles) on
crates.io,
[`github.com/dicebear/styles/v10`](https://pkg.go.dev/github.com/dicebear/styles/v10)
as a Go module and [`dicebear_styles`](https://pub.dev/packages/dicebear_styles)
on pub.dev, and
[`DiceBear.Styles`](https://www.nuget.org/packages/DiceBear.Styles) on NuGet.
Most projects only need one or two styles, but sometimes (for a style picker, a
gallery page, or a batch job) you want to load all of them at once.

This guide shows how to do that in Node.js, PHP, Python, Rust, Go, Dart and C#.

## Node.js

In Node.js you can read the styles straight from the installed package on disk.
The package ships its source JSON files under `src/`.

```js
import { readdir, readFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { Avatar } from '@dicebear/core';

const require = createRequire(import.meta.url);
const stylesDir = path.join(
  path.dirname(require.resolve('@dicebear/styles/package.json')),
  'src',
);

const files = (await readdir(stylesDir)).filter((file) =>
  file.endsWith('.json'),
);

const styles = Object.fromEntries(
  await Promise.all(
    files.map(async (file) => {
      const definition = JSON.parse(
        await readFile(path.join(stylesDir, file), 'utf8'),
      );

      return [path.basename(file, '.json'), definition];
    }),
  ),
);

const avatar = new Avatar(styles.lorelei, { seed: 'Alice' });
```

## PHP

PHP can locate the installed package via Composer and iterate over the JSON
files in its `src/` directory.

```php
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

## Python

The `dicebear-styles` package ships the definitions as JSON resources under the
`dicebear_styles` import name. Iterate over them with `importlib.resources`.

```python
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

## Rust

The `dicebear-styles` crate embeds each style behind a Cargo feature of the same
name, so a binary only ships the styles it opts into. To load _all_ of them, add
the crate with the `all` feature:

```sh
cargo add dicebear-core serde_json
cargo add dicebear-styles --features all
```

`dicebear_styles::all()` lists every style compiled into the build, and
`dicebear_styles::get(name)` returns its raw JSON definition.

```rust
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

## Go

The `github.com/dicebear/styles/v10` module embeds every style. Unlike the Rust
crate, there is no per-style opt-in, so the whole set is available once the
module is added.

```sh
go get github.com/dicebear/dicebear-go/v10
go get github.com/dicebear/styles/v10
```

`styles.All()` lists every embedded style and `styles.Get(name)` returns its raw
JSON definition.

```go
import (
	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
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

## Dart

The `dicebear_styles` package ships each style in its own library, so a compiled
app only embeds the styles it imports. To load _all_ of them, import the
umbrella library `package:dicebear_styles/dicebear_styles.dart`, which
re-exports every style:

```sh
dart pub add dicebear_core dicebear_styles
```

`styles.all` lists every embedded style and `styles.get(name)` returns its raw
JSON definition.

```dart
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/dicebear_styles.dart' as styles;

final parsed = {
  for (final name in styles.all) name: Style.parse(styles.get(name)!),
};

final avatar = Avatar(parsed['lorelei']!, {'seed': 'Alice'});
```

## C#

The `DiceBear.Styles` package embeds every style in the assembly. Like the Go
module there is no per-style opt-in, so the whole set is available once the
package is added.

```sh
dotnet add package DiceBear.Core
dotnet add package DiceBear.Styles
```

`Styles.All()` lists every embedded style and `Styles.Get(name)` returns its raw
JSON definition.

```csharp
using System.Text.Json.Nodes;
using DiceBear;

var parsed = Styles
    .All()
    .ToDictionary(name => name, name => Style.Parse(Styles.Get(name)!));

var avatar = new Avatar(parsed["lorelei"], new JsonObject { ["seed"] = "Alice" });
```

Parsing all %STYLE_COUNT% definitions up front costs time and memory. If you
only need a handful, reach for the properties instead:
`Style.Parse(Styles.Lorelei)`.
