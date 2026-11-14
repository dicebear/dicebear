---
title: HTTP API – Generate SVG Avatars via URL
description: >
  Free avatar API and profile picture API by DiceBear. Generate random user
  avatars and user placeholder images with a simple URL. No authentication
  required.
---

<script setup>
import BrowserPreview from '@theme/components/ui/UiBrowserPreview.vue';
</script>

# HTTP API: generate SVG avatars via URL

The HTTP API is the simplest way to use DiceBear as a profile picture or avatar
placeholder API. It's free and needs no authentication.

## Usage

Replace `<styleName>` with the name of an [avatar style](/styles/). Style names
are lowercase, with hyphens for multi-word styles, e.g. `lorelei`, `pixel-art`,
`adventurer-neutral`.

```http
https://api.dicebear.com/11.x/<styleName>/svg
```

<BrowserPreview url="https://api.dicebear.com/11.x/pixel-art/svg" />
<BrowserPreview url="https://api.dicebear.com/11.x/lorelei/svg" />

### Generate a consistent avatar from a user ID

Pass a stable identifier such as a user ID as the `seed`, and every user gets
the same avatar on every page and in every session. That makes it a good default
for people who haven't uploaded a photo yet.

```http
https://api.dicebear.com/11.x/lorelei/svg?seed=user-8f3a2c
```

<BrowserPreview url="https://api.dicebear.com/11.x/lorelei/svg?seed=user-8f3a2c" />

URL-encode seeds that contain spaces or other special characters.

:::info

The avatar styles come from many creators, and each creator chooses the license
for their own style. The [license overview](/licenses/) lists them all in one
place.

:::

## Listing available styles

The version root returns the available style names as JSON, sorted
alphabetically. It exists from `10.x` onwards.

```http
https://api.dicebear.com/11.x
```

```json
{
  "styles": ["adventurer", "adventurer-neutral", "avataaars", "..."]
}
```

## Style definition and options

Each style also has two metadata endpoints, handy for tooling such as avatar
editors:

```http
https://api.dicebear.com/11.x/<styleName>/definition.json
https://api.dicebear.com/11.x/<styleName>/options.json
```

`definition.json` returns the raw style definition, the same JSON the styles
package ships. `options.json` describes every option the style accepts as a
query parameter, with field types, allowed enum values, and value ranges. An
excerpt for [Pixel Art](/styles/pixel-art/):

```json
{
  "seed": { "type": "string" },
  "flip": {
    "type": "enum",
    "values": ["none", "horizontal", "vertical", "both"],
    "list": true
  },
  "backgroundColor": { "type": "color", "list": true },
  "hairVariant": {
    "type": "enum",
    "values": ["long01", "long02", "...", "short24"],
    "list": true,
    "weighted": true
  },
  "hairProbability": { "type": "number", "min": 0, "max": 100 }
}
```

Both endpoints exist from `10.x` onwards. Self-hosted instances turn them off by
default, see the
[self-hosting guide](/recipes/self-host-the-http-api/#optional-style-metadata-endpoints).

## Options

All [core options](/customize/options/), such as `seed`, `flip`, `rotate`,
`scale`, `borderRadius`, `backgroundColor`, and `tags`, work as
[query parameters](https://en.wikipedia.org/wiki/Query_string). Style-specific
options are listed on each [style page](/styles/).

::: warning

The options `idRandomization`, `fontFamily`, `fontWeight`, and `title` are not
supported by our public HTTP API. You can enable them by
[hosting your own instance](/recipes/self-host-the-http-api/).

:::

### Array options

Separate array values with commas. Here the seed picks from five hairstyles of
[Pixel Art](/styles/pixel-art/):

<BrowserPreview url="https://api.dicebear.com/11.x/pixel-art/svg?seed=John&hairVariant=short01,short02,short03,short04,short05" />
<BrowserPreview url="https://api.dicebear.com/11.x/pixel-art/svg?seed=Jane&hairVariant=long01,long02,long03,long04,long05" />

The [`tags`](/customize/tags/) filter is an array too. Prefix a tag with `!` to
exclude it:

<BrowserPreview url="https://api.dicebear.com/11.x/adventurer/svg?seed=John&tags=hairLength:long,!facialHair" />

### Enum options

Enum values are passed as strings. For example, `flip` accepts `none`,
`horizontal`, `vertical`, or `both`:

<BrowserPreview url="https://api.dicebear.com/11.x/lorelei/svg?flip=horizontal" />
<BrowserPreview url="https://api.dicebear.com/11.x/lorelei/svg?flip=none" />

### Weighted options

Options marked `weighted` in `options.json` also take weights that make some
variants rarer than others. Put the weight after each value, separated by a
colon. Variants missing from the list are left out. Here one in five
[critters](/styles/critters/) has a single eye:

<BrowserPreview url="https://api.dicebear.com/11.x/critters/svg?seed=Jane&eyesVariant=round:4,mono:1" />
<BrowserPreview url="https://api.dicebear.com/11.x/critters/svg?seed=Jack&eyesVariant=round:4,mono:1" />

### Animations

Styles that carry animations play them once you set `animation=true`.
`animationSpeed` sets the pace, and `animationDelay` shifts the start by
seconds. A range such as `animationDelay=0,5` gives every seed its own start, so
avatars side by side don't move in step. Only the SVG format moves. The raster
formats render the resting state.

<BrowserPreview url="https://api.dicebear.com/11.x/critters/svg?seed=Jane&animation=true" />

Every animation also has a switch, a speed, and a delay named after it, and each
wins over the global option. Here only the eyes blink:

<BrowserPreview url="https://api.dicebear.com/11.x/critters/svg?seed=Jane&blinkAnimation=true" />

The `11.x` line is the first one with animations. On `10.x` the option is
accepted and ignored. The [core options](/customize/options/) list all animation
options.

## File format

Replace `svg` in the URL with the format you need:

| Format                       | Notes                                               |
| ---------------------------- | --------------------------------------------------- |
| `svg`                        | Recommended. Scales to any size, higher rate limit  |
| `png`, `jpg`, `webp`, `avif` | Up to 256 × 256 px, lower rate limit                |
| `json`                       | Returns avatar metadata as JSON instead of an image |

PNG, JPG, WebP, and AVIF render text in
[Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) with the subsets
`cyrillic`, `cyrillic-ext`, `devanagari`, `greek`, `greek-ext`, `japanese`,
`korean`, `latin`, `latin-ext`, `simplified-chinese`, `thai`, and `vietnamese`.

<BrowserPreview url="https://api.dicebear.com/11.x/bottts/png" />

## Versioning

The version is part of the URL. Replace `11.x` with the one you want. Every
prefix from `5.x` to `11.x` still answers, and
[Supported versions](/understand/supported-versions/) shows how long each one
stays that way and which of them the libraries still cover.

::: warning

Versions `5.x` to `8.x` will reach end of life on April 30, 2028. After that
date the API shuts them down and the URLs stop working. See the
[announcement](https://github.com/orgs/dicebear/discussions/491) for details.

:::

## Fair use & rate limits

Our API is free for non-commercial use, but please use it responsibly. We
reserve the right to block abusive users.

Requests are limited to **50 per second for SVG** and **10 per second for PNG,
JPG, WebP, and AVIF**. Above that, the API answers `429 Too Many Requests`. We
may change these limits at any time without notice.

For commercial use, higher limits, or full control over availability and data
privacy, [host the API yourself](/recipes/self-host-the-http-api/). We're happy
to answer questions in the
[discussions](https://github.com/orgs/dicebear/discussions) on GitHub.

## Changes and availability

We reserve the right to update the API at any time. We try to keep it backwards
compatible and to return the same avatar for the same URL, but we can't
guarantee either: the design, and even more so the SVG source, may change. We
also can't guarantee that the API is always available. If you need consistent
access, [run your own instance](/recipes/self-host-the-http-api/).
