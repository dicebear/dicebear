---
title: HTTP API – Generate SVG Avatars via URL
description: >
  Free avatar API and profile picture API by DiceBear. Generate random user
  avatars and user placeholder images with a simple URL. No authentication
  required.
---

<script setup>
import BrowserPreview from '@theme/components/ui/UiBrowserPreview.vue';
import DocsGrid from '@theme/components/docs/DocsGrid.vue';

const fileFormats = [
  {
    title: 'SVG',
    description: 'Recommended. Scales indefinitely, no size limit, higher rate limit.',
    badge: 'Recommended',
  },
  {
    title: 'PNG',
    description: 'Max. 256 × 256 px. Lower rate limit.',
  },
  {
    title: 'JPG',
    description: 'Max. 256 × 256 px. Lower rate limit.',
  },
  {
    title: 'WebP',
    description: 'Max. 256 × 256 px. Lower rate limit.',
  },
  {
    title: 'AVIF',
    description: 'Max. 256 × 256 px. Lower rate limit.',
  },
  {
    title: 'JSON',
    description: 'Returns avatar metadata as JSON instead of an image.',
  },
];
</script>

# HTTP API: generate SVG avatars via URL

Our HTTP API is the simplest way to use DiceBear as a profile picture API or
avatar placeholder API. No authentication is required.

## Usage

Use the following address and replace `<styleName>` with your preferred avatar
style. Style names are lowercase, with hyphens for multi-word styles, e.g.
`lorelei`, `pixel-art`, `adventurer-neutral`. Every official
[avatar style](/styles/) is supported.

```
https://api.dicebear.com/10.x/<styleName>/svg
```

### A few examples

<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg" />
<BrowserPreview url="https://api.dicebear.com/10.x/lorelei/svg" />

### Generate a consistent avatar from a user ID

Use a stable identifier as the `seed` and every user gets the same avatar on
every visit. A user ID works well, and the same seed always returns the same
image. That makes it a good default avatar for people who haven't uploaded a
photo yet, since the picture stays the same across pages and sessions.

```
https://api.dicebear.com/10.x/lorelei/svg?seed=user-8f3a2c
```

<BrowserPreview url="https://api.dicebear.com/10.x/lorelei/svg?seed=user-8f3a2c" />

If the seed contains spaces or other special characters, URL-encode it first.

:::info

We provide a large number of avatar styles from different creators. The avatar
styles are licensed under different licenses that the creators can choose
themselves. For a quick overview we have created a
[license overview](/licenses/) for you.

:::

## Listing available styles

To discover which avatar styles an instance supports, send a request to the
version root. It returns the available style names as JSON, sorted
alphabetically:

```
https://api.dicebear.com/10.x
```

```json
{
  "styles": ["adventurer", "adventurer-neutral", "avataaars", "..."]
}
```

::: info

This endpoint is available from version `10.x` onwards. Earlier versions do not
support listing styles.

:::

## Style definition and options

Each style also exposes two metadata endpoints. They are handy for building
tooling on top of the API, such as avatar editors:

```
https://api.dicebear.com/10.x/<styleName>/definition.json
https://api.dicebear.com/10.x/<styleName>/options.json
```

`definition.json` returns the raw style definition, the same JSON that is
shipped with the style's npm package.

`options.json` describes every option the style accepts as query parameter,
including field types, allowed enum values, and value ranges. An excerpt for
[Pixel Art](/styles/pixel-art/):

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

::: info

These endpoints are available from version `10.x` onwards. On self-hosted
instances they are disabled by default. See the
[self-hosting guide](/guides/host-the-http-api-yourself/#optional-style-metadata-endpoints).

:::

## Options

All [core options](/guides/core-options/) (such as `seed`, `flip`, `rotate`,
`scale`, `borderRadius`, `backgroundColor`, and `tags`) are available as
[query parameters](https://en.wikipedia.org/wiki/Query_string). Style-specific
options are listed on each [avatar style page](/styles/). For example:

<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=John" />
<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=Jane" />

:::tip

If you want to pass more options, you connect them with a `&` as usual with
query strings.

:::

::: warning

The options `idRandomization`, `fontFamily`, `fontWeight`, and `title` are not
supported by our public HTTP API. You can enable them by
[hosting your own instance](/guides/host-the-http-api-yourself/).

:::

### Array options

Array values are separated by a comma. For example, the URL could look like this
if you want to provide the PRNG with several hair styles in addition to the
seed. Note that the avatar styles provide different options. In this example, we
use the [Pixel Art](/styles/pixel-art/) avatar style.

<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=John&hairVariant=short01,short02,short03,short04,short05" />
<BrowserPreview url="https://api.dicebear.com/10.x/pixel-art/svg?seed=Jane&hairVariant=long01,long02,long03,long04,long05" />

The [`tags`](/guides/filter-variants-with-tags/) filter is an array too.
Separate the tags with a comma and prefix a tag with `!` to exclude it:

```
https://api.dicebear.com/10.x/planets/svg?seed=John&tags=animation
```

### Enum options

Enum values are passed as strings. For example, the `flip` option accepts
`none`, `horizontal`, `vertical`, or `both`:

<BrowserPreview url="https://api.dicebear.com/10.x/lorelei/svg?flip=horizontal" />
<BrowserPreview url="https://api.dicebear.com/10.x/lorelei/svg?flip=none" />

## File format

<DocsGrid :items="fileFormats" />

PNG, JPG, WebP and AVIF use the
[Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) font and currently
supports the following subsets: `cyrillic`, `cyrillic-ext`, `devanagari`,
`greek`, `greek-ext`, `japanese`, `korean`, `latin`, `latin-ext`,
`simplified-chinese`, `thai` and `vietnamese`.

<BrowserPreview url="https://api.dicebear.com/10.x/bottts/svg" />
<BrowserPreview url="https://api.dicebear.com/10.x/bottts/png" />
<BrowserPreview url="https://api.dicebear.com/10.x/bottts/jpg" />
<BrowserPreview url="https://api.dicebear.com/10.x/bottts/webp" />
<BrowserPreview url="https://api.dicebear.com/10.x/bottts/avif" />

## Versioning

You can set the version in the URL. Just replace the `10.x` from the previous
examples with the one you want.

| Version | Status     | End of Life    |
| ------- | ---------- | -------------- |
| `10.x`  | **Active** | None           |
| `9.x`   | **Active** | None           |
| `8.x`   | Deprecated | April 30, 2028 |
| `7.x`   | Deprecated | April 30, 2028 |
| `6.x`   | Deprecated | April 30, 2028 |
| `5.x`   | Deprecated | April 30, 2028 |

::: warning

Versions 5.x to 8.x will reach End of Life on April 30, 2028. After that date,
the HTTP API for these versions will be shut down and no longer available.
Please upgrade to the latest version. See the
[announcement](https://github.com/orgs/dicebear/discussions/491) for details.

:::

::: info

You can [host the API yourself](/guides/host-the-http-api-yourself/) to keep
using discontinued versions after their End of Life.

:::

## Self-hosted avatar API

Need a private or commercial setup? You can
[host the Avatar API yourself](/guides/host-the-http-api-yourself/) for full
control over availability, rate limits, and data privacy.

## Fair use & rate limits

Our API is free to use for non-commercial purposes, but please use it
responsibly. We reserve the right to block abusive users.

We currently limit requests per second to **50 for SVG** and **10 for PNG, JPG,
WebP, and AVIF**. Exceeding the limit returns HTTP `429 Too Many Requests`. We
reserve the right to change these limits at any time without notice.

For commercial use or higher limits, please
[set up your own instance](/guides/host-the-http-api-yourself/). We're happy to
answer questions: open a
[discussion](https://github.com/orgs/dicebear/discussions) on GitHub.

## Changes and availability

Please be aware that we reserve the right to update the API at any time. While
we will do our best to maintain backwards compatibility, we cannot guarantee
this. Even though we try to always return the same avatar, the design and
especially the source code may change. Additionally, we cannot guarantee that
the API will always be available. If you need consistent access to the API, we
recommend setting up [your own instance](/guides/host-the-http-api-yourself/).
