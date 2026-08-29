---
title: Godot Avatar Library
description: >
  Generate SVG profile pictures in Godot with DiceBear. Render avatars on the
  device with the C# library, or fetch them over the HTTP API from GDScript.
---

# Godot avatar library: using DiceBear with Godot

Godot renders SVG through `Image.LoadSvgFromString`, so an avatar becomes a
texture without any extra dependency. Where the SVG comes from depends on which
build you run. A .NET build can generate it in the game with the
[C# library](/integrations/csharp/), and any build can fetch a finished
avatar from the [HTTP API](/integrations/http-api/) with `HTTPRequest`.

The C# library keeps everything local, so it works offline and sends no
requests. The HTTP API needs no packages and is the only option in the standard
build, which runs GDScript alone.

## With the C# library

Add the core library and the style definitions to your project's `.csproj`:

```sh
dotnet add package DiceBear.Core
dotnet add package DiceBear.Styles
```

`Image.LoadSvgFromString` takes the SVG text, and `ImageTexture.CreateFromImage`
turns the result into something a `Sprite2D` can draw:

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
            // ... other options
        }).ToSvg();

        var image = new Image();
        image.LoadSvgFromString(svg);

        Texture = ImageTexture.CreateFromImage(image);
    }
}
```

Parse the style once and keep it in a field or an autoload. Validating and
decomposing a definition is the expensive part, while rendering an avatar from
an existing `Style` is cheap.

For the full API and the options each style accepts, see the
[C# library reference](/integrations/csharp/).

### Sizing the texture

The `size` option sets the `width` and `height` of the SVG, and Godot rasterizes
at that resolution. Without it the avatar carries only a `viewBox`, and Godot
falls back to those dimensions. Every style brings its own, so pass `size`
instead of relying on them.

The second argument of `LoadSvgFromString` scales on top of that. Passing `4.0`
to a 128 px avatar gives you a 512 px texture:

```csharp
image.LoadSvgFromString(svg, 4.0f);
```

Rasterize at the size you actually draw, since a texture larger than the sprite
spends memory on detail nobody sees.

### Shipping single definitions

`DiceBear.Styles` embeds every style in the assembly, so a project that ships it
carries the whole collection. To keep the export small, skip the package and add
the definitions you use as project assets:

```csharp
using var file = FileAccess.Open(
    "res://avatars/lorelei.json",
    FileAccess.ModeFlags.Read);

var style = Style.Parse(file.GetAsText());
```

The default export setting, "Export all resources in the project", packs those
JSON files into the PCK, and `FileAccess` reads them in an exported game the
same way.

Style definitions are on [npm](https://www.npmjs.com/package/@dicebear/styles)
and in the
[styles repository](https://github.com/dicebear/styles/tree/main/src).

## With the HTTP API

`HTTPRequest` fetches a finished avatar, and this path works in the standard
build too:

```gdscript
extends Sprite2D

@export var seed_value := "John"

func _ready() -> void:
	var request := HTTPRequest.new()
	add_child(request)
	request.request_completed.connect(_on_request_completed)

	var query := "?seed=%s&size=128" % seed_value.uri_encode()
	request.request("https://api.dicebear.com/10.x/lorelei/svg" + query)

func _on_request_completed(
	result: int,
	code: int,
	_headers: PackedStringArray,
	body: PackedByteArray,
) -> void:
	if result != HTTPRequest.RESULT_SUCCESS or code != 200:
		push_error("Avatar request failed")
		return

	var image := Image.new()
	image.load_svg_from_buffer(body, 1.0)

	texture = ImageTexture.create_from_image(image)
```

The response arrives as bytes, so `load_svg_from_buffer` is the one to use.
Every option is a query parameter. See the
[HTTP API reference](/integrations/http-api/) for the full list.

## What the renderer leaves out

Godot's SVG renderer ignores `<text>`, so a style that draws its avatar from
letters comes out as a plain colored square.

Blur renders, but a `clip-path` around blurred content is ignored. With a
`borderRadius` the blur spills past the rounded edge instead of being cut off.
The spill is faint, so whether it shows depends on what sits behind the avatar.

Masks, blend modes, gradients and nested references all draw the way they do in
a browser.
