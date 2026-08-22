---
title: C# Avatar Library
description: >
  Use the DiceBear C# library to generate SVG profile pictures in .NET, Godot
  and Unity. Targets netstandard2.0 and net8.0 with an API identical to the
  JavaScript library.
---

# C# avatar library

The C# library provides an API identical to the
[JavaScript library](/how-to-use/js-library/). It targets `netstandard2.0` and
`net8.0`, so it runs on .NET 8 and newer, on .NET Framework 4.6.1 and newer, in
Godot 4.2+ with .NET, and in Unity. The same seed and style definition produce
SVGs byte-identical to the JavaScript reference.

## Installation

You need two packages: the core library `DiceBear.Core` and the avatar style
definitions `DiceBear.Styles`.

```sh
dotnet add package DiceBear.Core
dotnet add package DiceBear.Styles
```

The styles package embeds every style in the assembly. Like the Go module there
is no per-style opt-in, so a project that ships it carries the whole collection.
Where that matters, such as a game export, skip the package and load the one
definition you need from a file.

## Usage

We use the avatar style [lorelei](/styles/lorelei/) in our example. You can find
more avatar styles [here](/styles/). Each style is exposed as a raw-JSON string
(e.g. `Styles.Lorelei`) that you hand to `Style.Parse`.

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

`Style.Parse` decodes and validates the raw JSON string. If you already hold a
decoded definition as a `JsonNode`, pass it to the `Style` constructor instead.

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

```csharp
var first = new Avatar(style, new JsonObject { ["seed"] = "user-123" });
var second = new Avatar(style, new JsonObject { ["seed"] = "user-123" });

// first.ToSvg() == second.ToSvg()
```

## Types

### `Style`

A validated, immutable wrapper around a style definition. Build it once from the
definition JSON, then reuse it when generating multiple avatars. Invalid
definitions throw a `StyleValidationException`.

```csharp
var style = Style.Parse(Styles.Lorelei);

var alice = new Avatar(style, new JsonObject { ["seed"] = "Alice" });
var bob = new Avatar(style, new JsonObject { ["seed"] = "Bob" });
```

### `Avatar`

The main class for generating avatars. The constructor takes a `Style` and an
optional `JsonObject` of options. Invalid options throw an
`OptionsValidationException`, circular color references a
`CircularColorReferenceException`. Omitting the options is the same as passing
an empty object.

```csharp
var avatar = new Avatar(style, new JsonObject
{
    // ... options
});
```

`Avatar.FromJson(style, optionsJson)` takes the options as raw JSON text, which
is convenient when they arrive from a request body or a config file.

### `OptionsDescriptor`

Describes all valid options for a given style. Useful for building UIs or
validating user input.

```csharp
var descriptor = new OptionsDescriptor(style).ToJson();
```

## Methods

### `ToSvg()` / `ToString()`

**Return type:** `string`

Returns the avatar as SVG in XML format. `ToString()` returns the same string,
so an `Avatar` can be used directly in string interpolation.

```csharp
var avatar = new Avatar(style, new JsonObject { ["seed"] = "Alice" });

var svg = avatar.ToSvg();
// or
svg = avatar.ToString();
```

### `ToJson()`

**Return type:** `string` (a JSON object with the keys `svg` and `options`)

Returns the SVG and the resolved options as JSON text.

```csharp
var avatar = new Avatar(style, new JsonObject { ["seed"] = "Alice" });

var result = avatar.ToJson();

// result → {"svg":"<svg>...</svg>","options":{"flip":"none",...}}
```

The resolved options are also available directly as a `JsonObject` via
`avatar.ResolvedOptions()`.

### `ToDataUri()`

**Return type:** `string`

Returns the avatar as [data URI](https://en.wikipedia.org/wiki/Data_URI_scheme).

```csharp
var avatar = new Avatar(style, new JsonObject { ["seed"] = "Alice" });

var dataUri = avatar.ToDataUri();

// <img src="{dataUri}" alt="Avatar" />
```

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
[Core options](/guides/core-options/) for the full reference. Here are the
options in C# syntax:

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
[Dynamic component options](/guides/core-options/#dynamic-component-options) for
all available patterns.

## Examples

### Rendering in Godot

Godot 4 renders SVG through `Image.LoadSvgFromString`, so an avatar becomes a
texture without any extra dependency:

```csharp
using Godot;
using System.Text.Json.Nodes;
using DiceBear;

public partial class AvatarSprite : Sprite2D
{
    public override void _Ready()
    {
        var style = Style.Parse(Styles.Lorelei);

        var svg = new Avatar(style, new JsonObject
        {
            ["seed"] = "John",
            ["size"] = 128,
        }).ToSvg();

        var image = new Image();
        image.LoadSvgFromString(svg);

        Texture = ImageTexture.CreateFromImage(image);
    }
}
```

To keep the export small, skip `DiceBear.Styles` and add only the definitions
you ship as project assets. `FileAccess` reads them in an exported game as well:

```csharp
using var file = FileAccess.Open(
    "res://avatars/lorelei.json",
    FileAccess.ModeFlags.Read);

var style = Style.Parse(file.GetAsText());
```

This needs a .NET build of Godot. The standard build runs GDScript only, and
there the [HTTP API](/how-to-use/http-api/) is the way to go.

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

### Avatar with custom background

```csharp
var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "Alice",
    ["backgroundColor"] = new JsonArray("#b6e3f4", "#c0aede", "#d1d4f9"),
});
```

### Fixed size avatar

```csharp
var style = Style.Parse(Styles.Bottts);

var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "robot-42",
    ["size"] = 128,
    ["borderRadius"] = 50, // circular avatar
});
```

### Avatar with transformations

```csharp
var style = Style.Parse(Styles.Avataaars);

var avatar = new Avatar(style, new JsonObject
{
    ["seed"] = "Jane",
    ["flip"] = "horizontal",
    ["rotate"] = 10,
    ["scale"] = 0.9,
    ["translateY"] = 5,
});
```

### Multiple avatars on the same page

When rendering multiple avatars on the same page, use `idRandomization` to
prevent SVG ID conflicts:

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

A weighted object makes some variants more likely than others. The lorelei style
selects `happy01` or `happy02` mouths twice as often as `sad01` here:

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
