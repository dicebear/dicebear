---
title: Supported DiceBear versions
description: >
  Which DiceBear versions still get releases and which api.dicebear.com URLs
  still answer. 11.x is maintained, 9.x and 10.x get security fixes, everything
  older is end of life.
---

<script setup>
import DocsVersionTimeline from '@theme/components/docs/DocsVersionTimeline.vue';
</script>

# Supported versions

Libraries and the HTTP API age differently. A library line gets fixes for a
while and then stops, but its packages stay on the registries for good. The
[HTTP API](/integrations/http-api/) keeps old version prefixes online long after
their library line has gone quiet.

## Libraries

11.x is the maintained line, so new styles, new options and fixes land there
first. A line moves to security fixes only once the next major ships, which is
where 9.x and 10.x are now. Below that everything is done: 5.x to 8.x all got
their last fix in March 2026.

<DocsVersionTimeline track="libraries" />

An end of life release keeps working, and a lockfile that pins one keeps
installing it from npm, Packagist, PyPI, crates.io, pub.dev, or NuGet. Only the
fixes stop. 10.x gets them for a year after 11.0. 9.x has no announced end,
which makes it the line to stay on when an upgrade is not on your plate right
now.

All libraries share one version number and move to a new major together. Only
the JavaScript library goes back further than 10.x. The others arrived during
it, so 9.x and older concern JavaScript alone.

Coming from 10.x, most code keeps working, and most avatars look the same.
[Animations](/animated-avatars/) live in the style definitions now, and you
switch them on with `animation: true`. These are the changes to check:

- **Avatars:** Fixes change some drawings. Pixel Art shows dark beards in full,
  which 10.x drew barely visible, Stripes adds stripes at the edges, so nearly
  every Stripes avatar changes, Notionists closes a gap between hair and head in
  24 hair variants, and the natural unibrow of Avataaars takes the color of the
  other eyebrows. A seed with ill-formed text, such as an emoji cut in half by
  `slice()`, renders a different avatar. Under `/10.x/` the HTTP API draws the
  same images as before, and only the markup gains the `data-dicebear-component`
  attribute.
- **Animated styles:** The `animationVariant` option and the `animation` tag are
  gone. Pass `animation: true` instead.
- **`new Avatar()`** takes a `Style` and no longer a raw definition:
  `new Avatar(new Style(definition), options)`.
- **Color helpers:** `Color` is no longer exported in JavaScript, Python, Rust,
  Go and Dart.
- **Go:** Import `github.com/dicebear/dicebear-go/v11` and
  `github.com/dicebear/styles/v11`.
- **CLI:** Style names are no longer commands. `dicebear lorelei` is now
  `dicebear create lorelei`, which prints to stdout unless `-o` names a file or
  directory, and `--optimize` is now `dicebear optimize`. See
  [CLI](/integrations/cli/).
- **Own style definitions:** With `{color}ColorOrder: 'fixed'`, 11.x draws from
  a palette in the order the definition lists it, where 10.x sorted the values
  first. Sorting the palette in the definition gives you the old order back. A
  gradient now uses every palette color as a stop unless `{color}ColorFillStops`
  is set, and a color with `contrastTo` is no longer sorted by contrast.

Coming from 9.x it is a real port: `@dicebear/collection` became
[`@dicebear/styles`](/integrations/javascript/), `createAvatar()` became
`new Avatar(new Style(definition))`, and options named after a component now end
in `Variant`. The 9.x documentation stays online at
[v9.dicebear.com](https://v9.dicebear.com).

## HTTP API

Every version prefix from `5.x` to `11.x` still answers, which is why an avatar
URL you wrote three years ago still returns an avatar today. Older versions ran
on `avatars.dicebear.com`, a host that has been retired and now answers
`410 Gone`.

<DocsVersionTimeline track="http-api" />

::: warning

Versions `5.x` to `8.x` will reach end of life on April 30, 2028. After that
date the HTTP API shuts them down and the URLs stop working. See the
[announcement](https://github.com/orgs/dicebear/discussions/491) for details.

:::

::: info

To keep using `5.x` to `9.x` after their end of life, host the `dicebear/api:3`
image yourself, as described in the
[self-hosting guide](/recipes/self-host-the-http-api/).

:::
