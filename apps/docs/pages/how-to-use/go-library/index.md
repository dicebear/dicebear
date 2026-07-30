---
title: Go Avatar Library
description: >
  Use the DiceBear Go library to generate SVG profile pictures on the server. Go
  1.23+ with an API identical to the JavaScript library.
---

# Go avatar library

The Go library provides an API identical to the
[JavaScript library](/how-to-use/js-library/). It requires Go 1.23 or higher.
The same seed and style definition produce SVGs byte-identical to the JavaScript
reference.

## Installation

You need two modules: the core library `github.com/dicebear/dicebear-go/v10` and
the avatar style definitions `github.com/dicebear/styles/v10`. The module path
carries the major version, so import it with the `/v10` suffix.

```sh
go get github.com/dicebear/dicebear-go/v10
go get github.com/dicebear/styles/v10
```

## Usage

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/). Each style is exposed as a raw-JSON string
(e.g. `styles.Lorelei`) that you pass to `NewStyle`.

```go
package main

import (
	"fmt"

	dicebear "github.com/dicebear/dicebear-go/v10"
	"github.com/dicebear/styles/v10"
)

func main() {
	style, err := dicebear.NewStyle([]byte(styles.Lorelei))
	if err != nil {
		panic(err)
	}

	avatar, err := dicebear.NewAvatar(style, map[string]any{
		"seed": "John",
		// ... other options
	})
	if err != nil {
		panic(err)
	}

	svg := avatar.SVG()
	fmt.Println(svg)
}
```

Each avatar style comes with several options. You can find them on the details
page of each [avatar style](/styles/).

:::info

We provide a large number of avatar styles from different creators. The avatar
styles are licensed under different licenses that the creators can choose
themselves. For a quick overview we have created a
[license overview](/licenses/) for you.

:::

## Deterministic avatars

The `seed` option is the key to generating deterministic avatars. The same seed
always produces the same avatar:

```go
avatar1, _ := dicebear.NewAvatar(style, map[string]any{"seed": "user-123"})
avatar2, _ := dicebear.NewAvatar(style, map[string]any{"seed": "user-123"})

// avatar1.SVG() == avatar2.SVG()
```

## Types

### `Style`

A validated, immutable wrapper around a style definition. Build it once with
`NewStyle` (from the definition's JSON bytes), then reuse it when generating
multiple avatars.

```go
style, err := dicebear.NewStyle(definitionJSON)
if err != nil {
	panic(err)
}

avatar1, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})
avatar2, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Bob"})
```

### `Avatar`

The main type for generating avatars. `NewAvatar` takes a `*Style` and a
`map[string]any` of options, and returns `(*Avatar, error)` (invalid options and
circular color references surface as an `error`). A `nil` options map is treated
as empty.

```go
avatar, err := dicebear.NewAvatar(style, map[string]any{
	// ... options
})
```

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input.

```go
descriptor := dicebear.NewOptionsDescriptor(style).ToJSON()
```

## Methods

### `SVG()` / `String()`

**Return type:** `string`

Returns the avatar as SVG in XML format. `Avatar` also implements
`fmt.Stringer`, so it can be used directly in string contexts (`fmt.Println`,
`fmt.Sprintf`).

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})

svg := avatar.SVG()
// or
svg = avatar.String()
```

### `JSON()`

**Return type:** `[]byte` (JSON with keys `svg` and `options`), `error`

Returns the SVG and the resolved options as JSON.

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})

result, _ := avatar.JSON()

// result → {"svg":"<svg>...</svg>","options":{"flip":"none",...}}
```

The resolved options are also available directly as a map via
`avatar.ResolvedOptions()`.

### `DataURI()`

**Return type:** `string`

Returns the avatar as [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme).

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})

dataURI := avatar.DataURI()

// <img src="{dataURI}" alt="Avatar" />
```

## Core options

The core options are identical to the JavaScript library. See the
[JS Library core options](/how-to-use/js-library/#core-options) for the full
reference. Here are the options in Go syntax:

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":                "Alice",
	"flip":                "horizontal",            // "none", "horizontal", "vertical", "both"
	"rotate":              10,                       // -360 to 360, or [min, max] range
	"scale":               0.9,                      // 0 to 10 (1 = original), or [min, max] range
	"borderRadius":        50,                       // 0-50 (50 = circle)
	"size":                128,
	"translateX":          0,                        // -1000 to 1000 (percent of canvas width)
	"translateY":          0,                        // -1000 to 1000 (percent of canvas height)
	"idRandomization":     true,
	"title":               "User Avatar",
	"fontFamily":          "Arial",                  // or []string{"Arial", "Helvetica"}
	"fontWeight":          700,                      // 1-1000
	"backgroundColor":     []string{"#b6e3f4", "#c0aede"},
	"backgroundColorFill": "solid",                  // "solid", "linear", "radial"
})
```

Dynamic component and color options also work the same way. See the
[JS Library documentation](/how-to-use/js-library/#dynamic-component-options)
for all available patterns.

## Examples

### Avatar with custom background

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":            "Alice",
	"backgroundColor": []string{"#b6e3f4", "#c0aede", "#d1d4f9"},
})
```

### Fixed size avatar

```go
style, _ := dicebear.NewStyle([]byte(styles.Bottts))

avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":         "robot-42",
	"size":         128,
	"borderRadius": 50, // circular avatar
})
```

### Avatar with transformations

```go
style, _ := dicebear.NewStyle([]byte(styles.Avataaars))

avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":       "Jane",
	"flip":       "horizontal",
	"rotate":     10,
	"scale":      0.9,
	"translateY": 5,
})
```

### Multiple avatars on the same page

When rendering multiple avatars on the same page, use `idRandomization` to
prevent SVG ID conflicts:

```go
style, _ := dicebear.NewStyle([]byte(styles.Lorelei))

for _, seed := range []string{"alice", "bob", "charlie"} {
	avatar, _ := dicebear.NewAvatar(style, map[string]any{
		"seed":            seed,
		"idRandomization": true,
	})
	fmt.Println(avatar.SVG())
}
```

### Weighted variant selection

```go
avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":     "Alice",
	"topVariant": map[string]any{"short01": 2, "short02": 2, "long01": 1},
})
```
