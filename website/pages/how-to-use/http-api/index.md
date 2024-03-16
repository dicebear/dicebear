---
description: >
  Our HTTP API is probably the easiest way to use DiceBear. Learn how to create
  avatars for your project using the HTTP API. It's free!
---

<script setup>
import BrowserPreview from '@theme/components/BrowserPreview.vue';
</script>

# HTTP-API

Our HTTP API is probably the easiest way to use DiceBear. Thanks to our sponsor
[bunny.net](https://bunny.net/) it is lightning fast worldwide. You can use our
official instance or run your own. Yes, the
[API is also OpenSource](https://github.com/dicebear/api)!

## Usage

Use the following address and replace `<styleName>` with your preferred avatar
style (camelCase). Every official [avatar style](/styles/) is supported.

```
https://api.dicebear.com/8.x/<styleName>/svg
```

### A few examples

<BrowserPreview url="https://api.dicebear.com/8.x/pixel-art/svg" />
<BrowserPreview url="https://api.dicebear.com/8.x/lorelei/svg" />

:::info

We provide a large number of avatar styles from different designers. The designs
are licensed under different licenses that the designers can choose themselves.
For a quick overview we have created an [license overview](/licenses/) for you.

:::

## Options

Options can be passed via the
[query string](https://en.wikipedia.org/wiki/Query_string). For example, you can
set a seed like this:

<BrowserPreview url="https://api.dicebear.com/8.x/pixel-art/svg?seed=John" />
<BrowserPreview url="https://api.dicebear.com/8.x/pixel-art/svg?seed=Jane" />

:::tip

If you want to pass more options, you connect them with a `&` as usual with
query strings.

:::

### Array options

Array values are separated by a comma. For example, the URL could look like this
if you want to provide the PRNG with several hair styles in addition to the
seed. Note that the avatar styles provide different options. In this example, we
use the [Pixel Art](/styles/pixel-art/) avatar style.

<BrowserPreview url="https://api.dicebear.com/8.x/pixel-art/svg?seed=John&hair=short01,short02,short03,short04,short05" />
<BrowserPreview url="https://api.dicebear.com/8.x/pixel-art/svg?seed=Jane&hair=long01,long02,long03,long04,long05" />

### Boolean options

Boolean values can be set as strings (`true` and `false`).

<BrowserPreview url="https://api.dicebear.com/8.x/lorelei/svg?flip=true" />
<BrowserPreview url="https://api.dicebear.com/8.x/lorelei/svg?flip=false" />

## File format

The API supports SVG, PNG, JPG and JSON. **We recommend using SVG if possible!**
SVG is the more modern format, scales indefinitely, and requires less traffic.
Because the PNG and JPG formats put more load on the API, the size is limited to
256x256. PNG and JPG also have a lower [rate limit](#rate-limits).

<BrowserPreview url="https://api.dicebear.com/8.x/bottts/svg" />
<BrowserPreview url="https://api.dicebear.com/8.x/bottts/png" />
<BrowserPreview url="https://api.dicebear.com/8.x/bottts/jpg" />

## Versioning

You can set the version in the URL. Just replace the `8.x` from the previous
examples with the one you want.

Supported versions: `5.x`, `6.x`, `8.x`

::: warning

We reserve the right to discontinue any version at any time without notice. You
can create your own instance of the API to be able to access discontinued
versions even afterwards.

:::

## Fair use

Our API is free to use, but we ask that you use it responsibly. We reserve the
right to block abusive users. Currently, we limit the number of requests. See
[Rate limits](#rate-limits) for more information. We also ask you to use the API
only for non-commercial purposes. If you want to use the API for commercial
purposes or need more requests per second, please
[set up your own instance](/guides/host-the-http-api-yourself/).

We are happy to answer any questions you may have. Just open an
[discussion](https://github.com/orgs/dicebear/discussions) on GitHub.

## Rate limits

We currently limit the number of requests per second to 50 for SVG and to 10 for
PNG and JPG. We reserve the right to change these limits at any time without
notice.

## Changes and Availability

Please be aware that we reserve the right to update the API at any time. While
we will do our best to maintain backwards compatibility, we cannot guarantee
this. Even though we try to always return the same avatar, the design and
especially the source code may change. Additionally, we cannot guarantee that
the API will always be available. If you need consistent access to the API, we
recommend setting up [your own instance](/guides/host-the-http-api-yourself/).
