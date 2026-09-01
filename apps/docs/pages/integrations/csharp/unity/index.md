---
title: Unity Avatar Library
description: >
  Generate profile pictures in Unity with DiceBear. Load PNGs from the HTTP API
  with UnityWebRequest, or render avatars in the game with the C# library.
---

# Unity avatar library: using DiceBear with Unity

You can bring DiceBear avatars into Unity two ways. The
[HTTP API](/integrations/http-api/) returns finished PNGs that
`UnityWebRequestTexture` loads into a texture, and the
[C# library](/integrations/csharp/) generates the SVG inside the game.

The HTTP API needs no packages and works on every build target. The C# library
keeps everything local, so it works offline. It also asks more of you: Unity
ships neither a NuGet client nor a runtime SVG renderer, and the renderer you
end up adding covers less of SVG than the styles use. Read
[what the renderer leaves out](#what-the-renderer-leaves-out) before you build
on it.

## With the HTTP API

Request the `png` format and hand the URL to `UnityWebRequestTexture`:

```csharp
using System.Collections;
using UnityEngine;
using UnityEngine.Networking;
using UnityEngine.UI;

public class UserAvatar : MonoBehaviour
{
    public string seed = "John";
    public RawImage target;

    private IEnumerator Start()
    {
        var url = "https://api.dicebear.com/11.x/lorelei/png"
            + "?seed=" + UnityWebRequest.EscapeURL(seed)
            + "&size=128";

        using (var request = UnityWebRequestTexture.GetTexture(url))
        {
            yield return request.SendWebRequest();

            if (request.result != UnityWebRequest.Result.Success)
            {
                Debug.LogError(request.error);
                yield break;
            }

            target.texture = DownloadHandlerTexture.GetContent(request);
        }
    }
}
```

For a `SpriteRenderer` instead of a UI element, wrap the texture in a sprite:

```csharp
var texture = DownloadHandlerTexture.GetContent(request);

GetComponent<SpriteRenderer>().sprite = Sprite.Create(
    texture,
    new Rect(0, 0, texture.width, texture.height),
    new Vector2(0.5f, 0.5f));
```

The PNG format is capped at 256 × 256 pixels. Every option is a query parameter,
and the [HTTP API reference](/integrations/http-api/) has the full list. If you
would rather not depend on our servers, you can
[host the API yourself](/recipes/self-host-the-http-api/).

## With the C# library

### Installing the packages

DiceBear ships on NuGet, and Unity has no NuGet client of its own. Add
[NuGetForUnity](https://github.com/GlitchEnzo/NuGetForUnity) through the package
manager, using "Add package from git URL":

```
https://github.com/GlitchEnzo/NuGetForUnity.git?path=/src/NuGetForUnity
```

Then install `DiceBear.Core` and `DiceBear.Styles` from the NuGet window. That
pulls in System.Text.Json and the JSON Schema validator as well. Both DiceBear
packages target `netstandard2.0`, so leave the API compatibility level at .NET
Standard 2.1 in the player settings.

Rendering the SVG needs Unity's Vector Graphics renderer. Unity 6.3 and newer
ship it as a built-in module, where the package on top of it only adds sprite
editor and UGUI support. Before 6.3 the package is the renderer itself. It is
experimental and hidden from the package list, so add it to
`Packages/manifest.json` by hand:

```json
"com.unity.vectorgraphics": "2.0.0-preview.25"
```

### Preparing the SVG

Unity's SVG parser reads two things differently from what DiceBear writes, and
until both are fixed up the avatar comes out as a bare background. These members
belong in the component below:

```csharp
using System.Text.RegularExpressions;

private static readonly Regex RootTag = new Regex("^<svg[^>]*>");
private static readonly Regex InternalHref = new Regex(" href=\"#([^\"]+)\"");

private static string ForVectorGraphics(string svg)
{
    // The parser looks for the older xlink:href form on <use>.
    svg = InternalHref.Replace(svg, " href=\"#$1\" xlink:href=\"#$1\"");

    // It also loses the fill of shapes behind a nested <use> when the root
    // element carries fill="none".
    return RootTag.Replace(svg, root => root.Value
        .Replace("<svg ", "<svg xmlns:xlink=\"http://www.w3.org/1999/xlink\" ")
        .Replace(" fill=\"none\"", ""), 1);
}
```

Every official style paints its shapes explicitly, so dropping the root `fill`
changes nothing else.

### Rendering the avatar

`SVGParser` reads the string and `VectorUtils` turns the result into a sprite:

```csharp
using System.IO;
using System.Text.Json.Nodes;
using DiceBear;
using Unity.VectorGraphics;
using UnityEngine;

public class UserAvatar : MonoBehaviour
{
    public string seed = "John";

    private static readonly Style AvatarStyle = Style.Parse(Styles.Lorelei);

    private void Start()
    {
        var svg = new Avatar(AvatarStyle, new JsonObject
        {
            ["seed"] = seed,
            ["size"] = 128,
            // ... other options
        }).ToSvg();

        var scene = SVGParser.ImportSVG(new StringReader(ForVectorGraphics(svg)));

        var geometry = VectorUtils.TessellateScene(scene.Scene, new VectorUtils.TessellationOptions
        {
            StepDistance = 1.0f,
            MaxCordDeviation = 0.25f,
            MaxTanAngleDeviation = 0.05f,
            SamplingStepSize = 0.01f,
        });

        GetComponent<SpriteRenderer>().sprite = VectorUtils.BuildSprite(
            geometry, 100.0f, VectorUtils.Alignment.Center, Vector2.zero, 128);
    }
}
```

Parse the style once and keep it in a static field. Validating and decomposing a
definition is the expensive part, while rendering an avatar from an existing
`Style` is cheap. For the full API and the options each style accepts, see the
[C# library reference](/integrations/csharp/).

Styles with a gradient background need the package's gradient material on the
renderer. A solid `backgroundColor` avoids that.

### Trimming the build

`DiceBear.Styles` embeds every style in the assembly. To keep the build small,
skip the package and load the one definition you ship from `Resources`:

```csharp
var definition = Resources.Load<TextAsset>("lorelei");
var style = Style.Parse(definition.text);
```

Definitions are on [npm](https://www.npmjs.com/package/@dicebear/styles) and in
the [styles repository](https://github.com/dicebear/styles/tree/main/src). Save
one as `Assets/Resources/lorelei.txt` so Unity imports it as a `TextAsset`.

If avatars render in the editor but fail in a player build, check the managed
stripping level. The schema validator works through reflection, and stripping
removes the types it looks up.

## What the renderer leaves out

Unity's parser implements a subset of SVG. It handles `<clipPath>`, which is
what `borderRadius` uses, and leaves out `<text>`, `<filter>`, blend modes and
per-pixel masking. The
[package manual](https://docs.unity3d.com/Packages/com.unity.vectorgraphics@2.0/manual/index.html)
goes into more detail.

A good number of avatar styles use one of those, so render the ones you ship and
look at them before you build on this. The HTTP API rasterizes on the server, so
none of this applies there.
