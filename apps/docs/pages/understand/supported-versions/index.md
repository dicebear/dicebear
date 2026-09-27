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

Coming from 10.x there is barely anything to change. Avatars render the same,
and [animations](/animated-avatars/) are new and stay off until you switch them
on. One exception: if you keep a style definition of your own and pin colors
with `{color}ColorOrder: 'fixed'`, 11.x draws from a palette in the order the
definition lists it, where 10.x sorted the values first. Sorting the palette in
the definition gives you the old result back.

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

You can [host the API yourself](/recipes/self-host-the-http-api/) to keep using
discontinued versions after their end of life.

:::
