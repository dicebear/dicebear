---
title: Using DiceBear as an Avatar Placeholder API
description: >
  Use DiceBear as a deterministic avatar placeholder API for user profiles.
  Generate consistent SVG profile pictures from user IDs or emails, with no
  image upload required.
---

<script setup>
import BrowserPreview from '@theme/components/ui/UiBrowserPreview.vue';
import DocsStyleGrid from '@theme/components/docs/DocsStyleGrid.vue';

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

An avatar placeholder is what users see before they upload a profile picture.
Instead of a gray silhouette, DiceBear generates a unique avatar from the user's
ID, so every user has a distinct picture from the moment they sign up. There are
no images to store and nothing to moderate.

## With the HTTP API

Use a DiceBear URL as the `src` of an `<img>` tag, with a stable identifier such
as the user ID as the seed. Setting `width` and `height` avoids a layout shift
while the avatar loads.

```html
<img
  src="https://api.dicebear.com/11.x/thumbs/svg?seed=user-8f3a2c"
  alt="User avatar"
  width="48"
  height="48"
/>
```

<BrowserPreview url="https://api.dicebear.com/11.x/thumbs/svg?seed=user-8f3a2c" />
<BrowserPreview url="https://api.dicebear.com/11.x/pixel-art/svg?seed=user-42" />

URL-encode the seed when you build the URL in code:

```js
const avatarUrl = `https://api.dicebear.com/11.x/thumbs/svg?seed=${encodeURIComponent(userId)}`;
```

The [HTTP API documentation](/integrations/http-api/) covers all options and the
rate limits.

### Fall back when an upload fails

An `onerror` handler switches to the DiceBear avatar when a user's uploaded
photo fails to load:

```html
<img
  src="/uploads/user-123.jpg"
  onerror="this.src='https://api.dicebear.com/11.x/pixel-art/svg?seed=123'; this.onerror=null;"
  alt="User avatar"
/>
```

## With a library

The libraries render the placeholder in your own code, without a request to the
API. Build the style once and reuse it for every user:

::: code-group

```js [JavaScript]
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

```php [PHP]
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

```python [Python]
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

```rust [Rust]
// cargo add dicebear-styles --features thumbs
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

```go [Go]
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

```dart [Dart]
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

```csharp [C#]
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

:::

Each [library page](/start/pick-your-integration/#the-libraries) covers
installation and the full API.

## Choosing a style

Different styles suit different products. Click a style to see all its options.

<DocsStyleGrid :styles="styles" />
