---
title: C# Avatar Library
description: >
  Use the DiceBear C# library to generate SVG profile pictures in .NET. Targets
  netstandard2.0 and net8.0 with an API identical to the JavaScript library.
---

# C# avatar library

Generate avatars in C#, from web backends to games.

The library targets `netstandard2.0` and `net8.0`, so it runs on .NET 8 and
newer and on .NET Framework 4.6.1 and newer. The API mirrors the
[JavaScript library](/integrations/javascript/), and the output is
byte-identical: the same seed and style produce the same SVG in every DiceBear
library.

Game engines have their own guides. In [Godot](/integrations/csharp/godot/) the
library runs only on a .NET build of the engine.
[Unity](/integrations/csharp/unity/) ships neither a NuGet client nor a runtime
SVG renderer, so you have to add both yourself.

## Installation

You need two packages: the core library `DiceBear.Core` and the avatar style
definitions `DiceBear.Styles`.

```sh
dotnet add package DiceBear.Core
dotnet add package DiceBear.Styles
```

The styles package embeds every style in the assembly, with no per-style opt-in.
Where the size matters, skip the package and load the one definition you need
from a file.

## Usage

Each style is exposed as a raw-JSON string (e.g. `Styles.Lorelei`) that you hand
to `Style.Parse`:

```csharp
using System.Text.Json.Nodes;
using DiceBear;

var style = Style.Parse(Styles.Lorelei);

var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "John",
    // ... other options
});

Console.WriteLine(avatar.ToSvg());
```

Every style has its own options, listed on its [style page](/styles/).

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Types

- `Style` is a validated, immutable wrapper around a style definition.
  `Style.Parse` decodes a raw JSON string, the constructor takes an already
  decoded `JsonNode`. Build it once and reuse it for every avatar of that style.
- `Avatar` renders one avatar from a `Style` and an optional `JsonObject` of
  options. `Avatar.FromJson(style, optionsJson)` takes the options as raw JSON
  text instead, which is convenient when they arrive from a request body or a
  config file.
- `OptionsDescriptor` describes all valid options of a style, for building UIs
  or validating user input: `new OptionsDescriptor(style).ToJson()`. See
  [Style options](/customize/style-options/).

## Methods

| Method                    | Returns                                                                      |
| ------------------------- | ---------------------------------------------------------------------------- |
| `ToSvg()` or `ToString()` | The SVG as a `string`, so an `Avatar` works directly in string interpolation |
| `ToJson()`                | JSON text with the SVG under `svg` and the resolved options under `options`  |
| `ResolvedOptions()`       | The resolved options as a `JsonObject`                                       |
| `ToDataUri()`             | The SVG as a [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme)       |

## Errors

Invalid input throws instead of returning a result type, which is what a .NET
caller expects. The other language libraries name these types `ValidationError`
after their own conventions.

| Exception                         | Thrown when                                 |
| --------------------------------- | ------------------------------------------- |
| `StyleValidationException`        | A style definition violates the schema      |
| `OptionsValidationException`      | The options violate the schema              |
| `CircularColorReferenceException` | A color in the definition references itself |

Both validation exceptions carry the individual field failures in `Details`,
each with the failing JSON pointer and the schema keyword that rejected it.

## Core options

These options are the same across every DiceBear core. See
[Core options](/customize/options/) for the full reference. Here are the options
in C# syntax:

```csharp
var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "Alice",
    ["flip"] = "horizontal", // "none", "horizontal", "vertical", "both"
    ["rotate"] = 10, // -360 to 360, or a [min, max] range
    ["scale"] = 0.9, // 0 to 10 (1 = original), or a [min, max] range
    ["borderRadius"] = 50, // 0-50 (50 = circle)
    ["size"] = 128,
    ["translateX"] = 0, // -1000 to 1000 (percent of canvas width)
    ["translateY"] = 0, // -1000 to 1000 (percent of canvas height)
    ["idRandomization"] = true,
    ["title"] = "User Avatar",
    ["fontFamily"] = "Arial", // or new JsonArray("Arial", "Helvetica")
    ["fontWeight"] = 700, // 1-1000
    ["backgroundColor"] = new JsonArray("#b6e3f4", "#c0aede"),
    ["backgroundColorFill"] = "solid", // "solid", "linear", "radial"
});
```

Dynamic component and color options also work the same way. See
[Dynamic component options](/customize/options/#dynamic-component-options) for
all available patterns.

## Examples

### Rendering in ASP.NET Core

An endpoint that returns the SVG directly:

```csharp
app.MapGet("/avatar/{seed}", (string seed) =>
{
    var avatar = new Avatar(style, new JsonObject { ["seed"] = seed });

    return Results.Content(avatar.ToSvg(), "image/svg+xml");
});
```

Build the `Style` once at startup and keep it in a field or a singleton service.
Validating and decomposing a definition is the expensive part, while rendering
an avatar from an existing `Style` is cheap.

### Multiple avatars on the same page

When you inline several avatars into one page, use `idRandomization` to keep
their SVG IDs from colliding:

```csharp
foreach (var seed in new[] { "alice", "bob", "charlie" })
{
    var avatar = new Avatar(style, new JsonObject
    {
        ["seed"] = seed,
        ["idRandomization"] = true,
    });

    Console.WriteLine(avatar.ToSvg());
}
```

### Weighted variant selection

A weight map makes some variants more likely than others. Here lorelei picks
`happy01` or `happy02` mouths twice as often as `sad01`:

```csharp
var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "Alice",
    ["mouthVariant"] = new JsonObject
    {
        ["happy01"] = 2,
        ["happy02"] = 2,
        ["sad01"] = 1,
    },
});
```
