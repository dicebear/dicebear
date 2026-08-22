<h1><img src="https://www.dicebear.com/logo-readme.svg" width="28" /> DiceBear Core (C#)</h1>

[![stars](https://www.dicebear.com/badges/stars.svg)](https://github.com/dicebear/dicebear/stargazers)
[![license](https://www.dicebear.com/badges/license.svg)](https://github.com/dicebear/dicebear/blob/10.x/LICENSE)

.NET implementation of the DiceBear avatar library. Generates deterministic SVG
avatars from style definitions and a seed string.

DiceBear is available for multiple languages. All implementations share the same
PRNG and rendering pipeline, producing identical SVG output for the same seed,
style, and options, regardless of the language used.

[Playground](https://www.dicebear.com/playground) |
[Documentation](https://www.dicebear.com/how-to-use/csharp-library/)

## Installation

```sh
dotnet add package DiceBear.Core
dotnet add package DiceBear.Styles
```

Targets `netstandard2.0` and `net8.0`, so it runs on .NET 8 and newer, on Godot
4.2+ with .NET, on Unity, and on .NET Framework 4.6.1+.

## Usage

```csharp
using System.Text.Json.Nodes;
using DiceBear;

var style = Style.Parse(Styles.Lorelei);

var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "John",
    ["size"] = 128,
});

avatar.ToSvg();      // SVG string
avatar.ToDataUri();  // data:image/svg+xml;charset=utf-8,...
```

`Style.Parse` takes the definition as text, so a style outside the styles
package works the same way: read the JSON from a file or a request and hand it
over.

### Reusing a style

Validating and decomposing a definition is the expensive part, so build the
`Style` once and render as many avatars from it as you need.

```csharp
var style = Style.Parse(Styles.Lorelei);

var alice = new Avatar(style, new JsonObject { ["seed"] = "Alice" });
var bob = new Avatar(style, new JsonObject { ["seed"] = "Bob" });
```

### In Godot

Godot 4 renders SVG through `Image.LoadSvgFromString`, so an avatar becomes a
texture without any extra dependency.

Godot 4 renders SVG through `Image.LoadSvgFromString`, so an avatar becomes a
texture without any extra dependency.

```csharp
using Godot;
using System.Text.Json.Nodes;
using DiceBear;

var style = Style.Parse(Styles.Lorelei);

var svg = new Avatar(style, new JsonObject { ["seed"] = "John" }).ToSvg();

var image = new Image();
image.LoadSvgFromString(svg);

var texture = ImageTexture.CreateFromImage(image);
```

To keep the export small, skip `DiceBear.Styles` and ship only the definitions
you use as project assets. `FileAccess.Open("res://…")` reads them in an
exported game as well.

## Errors

Invalid input throws instead of returning a result type, which is what a .NET
caller expects. The other ports name these types `ValidationError` after their
own conventions.

| Exception                         | Thrown when                                 |
| --------------------------------- | ------------------------------------------- |
| `StyleValidationException`        | A style definition violates the schema      |
| `OptionsValidationException`      | The options violate the schema              |
| `CircularColorReferenceException` | A color in the definition references itself |

Both validation exceptions carry the individual field failures in `Details`.

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
