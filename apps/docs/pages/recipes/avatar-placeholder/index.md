---
title: Using DiceBear as an Avatar Placeholder API
description: >
  Use DiceBear as a deterministic avatar placeholder API for user profiles.
  Generate consistent SVG profile pictures from user IDs or emails, with no
  image upload required.
---

<script setup>
import { useData } from 'vitepress';
import { Fingerprint, Zap, Server, Palette } from '@lucide/vue';
import BrowserPreview from '@theme/components/ui/UiBrowserPreview.vue';
import DocsHighlights from '@theme/components/docs/DocsHighlights.vue';
import DocsStyleGrid from '@theme/components/docs/DocsStyleGrid.vue';

const { theme } = useData();

const highlights = [
  {
    icon: Fingerprint,
    title: 'Deterministic',
    description:
      'The same seed always produces the same avatar. Use a user ID or email as the seed and the placeholder stays consistent across sessions and devices.',
    color: '#1689cc',
  },
  {
    icon: Zap,
    title: 'Zero upload required',
    description:
      'No images to store, no moderation needed. The avatar is generated on the fly, which works well for new users without a profile picture yet.',
    color: '#f59e0b',
  },
  {
    icon: Server,
    title: 'Self-hostable',
    description:
      'Run your own instance of the HTTP API for full control over availability and data retention.',
    color: '#22c55e',
  },
  {
    icon: Palette,
    title: `${theme.value.styleCount} styles`,
    description:
      'Pick the visual style that fits your product, from abstract geometric shapes to illustrated characters.',
    color: '#a855f7',
  },
];

const styles = [
  {
    name: 'Initials',
    styleName: 'initials',
    link: '/styles/initials/',
    bestFor: 'Apps where showing user initials is conventional',
  },
  {
    name: 'Identicon',
    styleName: 'identicon',
    link: '/styles/identicon/',
    bestFor: 'Developer tools, version control, technical platforms',
  },
  {
    name: 'Pixel Art',
    styleName: 'pixel-art',
    link: '/styles/pixel-art/',
    bestFor: 'Gaming, retro, or developer-focused communities',
  },
  {
    name: 'Thumbs',
    styleName: 'thumbs',
    link: '/styles/thumbs/',
    bestFor: 'Friendly consumer apps and social platforms',
  },
  {
    name: 'Shapes',
    styleName: 'shapes',
    link: '/styles/shapes/',
    bestFor: 'Abstract, neutral placeholder for any context',
  },
];
</script>

# Using DiceBear as an avatar placeholder API

An avatar placeholder replaces the generic default shown when a user hasn't
uploaded a profile picture yet. Instead of a gray silhouette, DiceBear generates
a unique, deterministic SVG avatar from any seed, so every user gets a distinct
picture from the moment they sign up.

## Why DiceBear as a placeholder?

<DocsHighlights :highlights="highlights" />

## With the HTTP API

The simplest approach: use a DiceBear API URL as the `src` of an `<img>` tag.
Use a stable identifier as the seed. A numeric user ID works well. For full
options and rate limit details, see the
[HTTP API documentation](/integrations/http-api/).

<BrowserPreview url="https://api.dicebear.com/11.x/initials/svg?seed=JD" />
<BrowserPreview url="https://api.dicebear.com/11.x/pixel-art/svg?seed=user-42" />

```html
<img
  src="https://api.dicebear.com/11.x/initials/svg?seed=JD"
  alt="User avatar"
  width="48"
  height="48"
/>
```

### Fallback on image error

Combine DiceBear with an `onerror` handler to fall back gracefully when a user's
uploaded photo fails to load:

```html
<img
  src="/uploads/user-123.jpg"
  onerror="this.src='https://api.dicebear.com/11.x/pixel-art/svg?seed=123'; this.onerror=null;"
  alt="User avatar"
/>
```

### Using a user ID as seed

Pass a stable, unique identifier as the seed to ensure each user always gets the
same placeholder:

```js
const userId = 'user-8f3a2c';
const avatarUrl = `https://api.dicebear.com/11.x/thumbs/svg?seed=${encodeURIComponent(userId)}`;
```

<BrowserPreview url="https://api.dicebear.com/11.x/thumbs/svg?seed=user-8f3a2c" />

## With the JavaScript library

Use the JS library for server-side rendering or to embed the SVG directly in
your markup without an additional HTTP request. For full installation and API
details, see the [JavaScript library documentation](/integrations/javascript/).

```js
import { Style, Avatar } from '@dicebear/core';
import thumbs from '@dicebear/styles/thumbs.json' with { type: 'json' };

const style = new Style(thumbs);

function getPlaceholderAvatar(userId) {
  return new Avatar(style, {
    seed: userId,
    size: 48,
    borderRadius: 50,
  }).toString();
}
```

## With the PHP library

Use the PHP library for server-side rendering without an additional HTTP
request. For full installation and API details, see the
[PHP library documentation](/integrations/php/).

```php
<?php

use Composer\InstalledVersions;
use DiceBear\Style;
use DiceBear\Avatar;

$basePath = InstalledVersions::getInstallPath('dicebear/styles');
$style = Style::fromJson(file_get_contents($basePath . '/src/thumbs.json'));

function getPlaceholderAvatar(Style $style, string $userId): string {
  return (string) new Avatar($style, [
    'seed' => $userId,
    'size' => 48,
    'borderRadius' => 50,
  ]);
}
```

## With the Python library

Use the Python library for server-side rendering without an additional HTTP
request. For full installation and API details, see the
[Python library documentation](/integrations/python/).

```python
from importlib.resources import files

from dicebear import Avatar, Style

style = Style.from_json(
    files("dicebear_styles").joinpath("thumbs.json").read_text("utf-8")
)

def get_placeholder_avatar(user_id: str) -> str:
    return Avatar(style, {
        "seed": user_id,
        "size": 48,
        "borderRadius": 50,
    }).to_string()
```

## With the Rust library

Use the Rust library for server-side rendering without an additional HTTP
request. For full installation and API details, see the
[Rust library documentation](/integrations/rust/).

```rust
use dicebear_core::{Avatar, Error, Style};
use serde_json::json;

let style = Style::from_str(dicebear_styles::THUMBS)?;

fn placeholder_avatar(style: &Style, user_id: &str) -> Result<String, Error> {
    let avatar = Avatar::new(style, json!({
        "seed": user_id,
        "size": 48,
        "borderRadius": 50,
    }))?;

    Ok(avatar.to_string())
}
```

## With the Go library

Use the Go library for server-side rendering without an additional HTTP request.
For full installation and API details, see the
[Go library documentation](/integrations/go/).

```go
import (
	dicebear "github.com/dicebear/dicebear-go/v11"
	"github.com/dicebear/styles/v11"
)

style, _ := dicebear.NewStyle([]byte(styles.Thumbs))

func placeholderAvatar(style *dicebear.Style, userID string) (string, error) {
	avatar, err := dicebear.NewAvatar(style, map[string]any{
		"seed":         userID,
		"size":         48,
		"borderRadius": 50,
	})
	if err != nil {
		return "", err
	}

	return avatar.SVG(), nil
}
```

## With the Dart library

Use the Dart library for server-side rendering without an additional HTTP
request. For full installation and API details, see the
[Dart library documentation](/integrations/dart/).

```dart
import 'package:dicebear_core/dicebear_core.dart';
import 'package:dicebear_styles/thumbs.dart';

final style = Style.parse(thumbs);

String getPlaceholderAvatar(String userId) {
  return Avatar(style, {
    'seed': userId,
    'size': 48,
    'borderRadius': 50,
  }).svg;
}
```

## With the C# library

Use the C# library for server-side rendering without an additional HTTP request.
For full installation and API details, see the
[C# library documentation](/integrations/csharp/).

```csharp
using System.Text.Json.Nodes;
using DiceBear;

var style = Style.Parse(Styles.Thumbs);

string GetPlaceholderAvatar(string userId) =>
    new Avatar(style, new JsonObject
    {
        ["seed"] = userId,
        ["size"] = 48,
        ["borderRadius"] = 50,
    }).ToSvg();
```

## Choosing a style

Different styles suit different use cases. Click a style to see all available
options.

<DocsStyleGrid :styles="styles" />

## Tip: always define a size

Specify a `size` or CSS dimensions to avoid layout shift while the avatar loads:

```js
// JS library
new Avatar(style, { seed: userId, size: 48, borderRadius: 50 });
```

```php
// PHP library
new Avatar($style, ['seed' => $userId, 'size' => 48, 'borderRadius' => 50]);
```

```python
# Python library
Avatar(style, {"seed": user_id, "size": 48, "borderRadius": 50})
```

```rust
// Rust library
Avatar::new(&style, json!({ "seed": user_id, "size": 48, "borderRadius": 50 }))?;
```

```go
// Go library
dicebear.NewAvatar(style, map[string]any{"seed": userID, "size": 48, "borderRadius": 50})
```

```dart
// Dart library
Avatar(style, {'seed': userId, 'size': 48, 'borderRadius': 50});
```

```csharp
// C# library
new Avatar(style, new JsonObject { ["seed"] = userId, ["size"] = 48, ["borderRadius"] = 50 });
```

```
// HTTP API
https://api.dicebear.com/11.x/thumbs/svg?seed=user-123&size=48&borderRadius=50
```
