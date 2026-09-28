---
title: Go Avatar Library
description: >
  Use the DiceBear Go library to generate SVG profile pictures on the server. Go
  1.23+ with an API identical to the JavaScript library.
---

# Go avatar library

Generate avatars right in your Go services (1.23 or higher), with no external
service involved.

The API mirrors the [JavaScript library](/integrations/javascript/), and the
output is byte-identical: the same seed and style produce the same SVG in every
DiceBear library.

## Installation

You need two modules: the core library `github.com/dicebear/dicebear-go/v11` and
the avatar style definitions `github.com/dicebear/styles/v11`. The module path
carries the major version, so import it with the `/v11` suffix.

```sh
go get github.com/dicebear/dicebear-go/v11
go get github.com/dicebear/styles/v11
```

## Usage

Each style is exposed as a raw-JSON string (e.g. `styles.Lorelei`) that you pass
to `NewStyle`:

```go
package main

import (
	"fmt"

	dicebear "github.com/dicebear/dicebear-go/v11"
	"github.com/dicebear/styles/v11"
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

Every style has its own options, listed on its [style page](/styles/).

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Types

- `Style` is a validated, immutable wrapper around a style definition. Build it
  once with `NewStyle` from the definition's JSON bytes and reuse it for every
  avatar of that style.
- `NewAvatar` takes a `*Style` and a `map[string]any` of options and returns
  `(*Avatar, error)`. Invalid options and circular color references come back as
  the `error`, and a `nil` options map counts as empty.
- `OptionsDescriptor` describes all valid options of a style, for building UIs
  or validating user input: `dicebear.NewOptionsDescriptor(style).ToJSON()`. See
  [Style options](/customize/style-options/).

## Methods

| Method                | Returns                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------ |
| `SVG()` or `String()` | The SVG as a `string`. `Avatar` implements `fmt.Stringer`, so `fmt.Println` and `fmt.Sprintf` work too |
| `JSON()`              | `[]byte` with the SVG under `svg` and the resolved options under `options`, and an `error`             |
| `ResolvedOptions()`   | The resolved options as a map                                                                          |
| `DataURI()`           | The SVG as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)                                 |

## Core options

These options are the same across every DiceBear core. See
[Core options](/customize/options/) for the full reference. Here are the options
in Go syntax:

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

Dynamic component and color options also work the same way. See
[Dynamic component options](/customize/options/#dynamic-component-options) for
all available patterns.

## Examples

### Multiple avatars on the same page

When you inline several avatars into one page, use `idRandomization` to keep
their SVG IDs from colliding:

```go
for _, seed := range []string{"alice", "bob", "charlie"} {
	avatar, _ := dicebear.NewAvatar(style, map[string]any{
		"seed":            seed,
		"idRandomization": true,
	})
	fmt.Println(avatar.SVG())
}
```

### Weighted variant selection

A weight map makes some variants more likely than others. Here one in five
[critters](/styles/critters/) has a single eye:

```go
style, _ := dicebear.NewStyle([]byte(styles.Critters))

avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed":        "Alice",
	"eyesVariant": map[string]any{"round": 4, "mono": 1},
})
```
