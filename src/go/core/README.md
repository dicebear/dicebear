<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Core (Go)</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)

Go implementation of the DiceBear avatar library. Generates deterministic SVG
avatars from style definitions and a seed string.

DiceBear is available for multiple languages. All implementations share the same
PRNG and rendering pipeline, producing identical SVG output for the same seed,
style, and options, regardless of the language used.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/integrations/go/)

## Installation

```sh
go get github.com/dicebear/dicebear-go/v11
```

Requires Go 1.23 or newer.

## Usage

```go
import (
	dicebear "github.com/dicebear/dicebear-go/v11"
	"github.com/dicebear/styles/v10"
)

// From a style definition (raw JSON, e.g. the pure-data styles module)
style, _ := dicebear.NewStyle([]byte(styles.Lorelei))

avatar, _ := dicebear.NewAvatar(style, map[string]any{
	"seed": "John Doe",
	"size": 128,
})

avatar.SVG()     // SVG string
avatar.DataURI() // data:image/svg+xml;charset=utf-8,...
```

### Using the Style type

```go
style, _ := dicebear.NewStyle([]byte(styles.Lorelei))

// Create multiple avatars from the same style
avatar1, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Alice"})
avatar2, _ := dicebear.NewAvatar(style, map[string]any{"seed": "Bob"})
```

## Sponsors

Advertisement: Many thanks to our sponsors who provide us with free or
discounted products.

<a href="https://bunny.net/" target="_blank" rel="noopener noreferrer">
    <picture>
        <source media="(prefers-color-scheme: dark)" srcset="https://www.dicebear.com/sponsors/bunny-light.svg">
        <source media="(prefers-color-scheme: light)" srcset="https://www.dicebear.com/sponsors/bunny-dark.svg">
        <img alt="bunny.net" src="https://www.dicebear.com/sponsors/bunny-dark.svg" height="64">
    </picture>
</a>
