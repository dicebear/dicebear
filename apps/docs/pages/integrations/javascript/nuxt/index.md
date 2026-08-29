---
title: Nuxt Avatar Library – DiceBear Integration
description: >
  Use DiceBear SVG avatars in Nuxt 3. Server-side rendering, client-side
  rendering, and Nitro endpoint patterns for deterministic profile pictures.
---

# Nuxt avatar library: using DiceBear with Nuxt

DiceBear works with Nuxt's universal rendering model. The avatar can be
generated on the server during SSR, in a Nitro endpoint, or in a plain client
component. Pick whichever matches the page's
[rendering mode](https://nuxt.com/docs/guide/concepts/rendering).

## With the JS library

### Universal component

Wrap generation in `computed` and the avatar is produced on whichever side the
component renders on. Because the result is a data URI, the markup hydrates
without re-running the renderer on the client.

```vue
<!-- components/UserAvatar.vue -->
<script setup lang="ts">
import { computed } from 'vue';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

const props = defineProps<{ seed?: string }>();

const avatar = computed(() =>
  new Avatar(style, {
    seed: props.seed ?? 'Alice',
    size: 128,
    // ... other options
  }).toDataUri(),
);
</script>

<template>
  <img :src="avatar" alt="Avatar" width="128" height="128" />
</template>
```

::: warning Hydration & `idRandomization`

`idRandomization` is backed by the host's non-seeded RNG, so the IDs produced
during SSR will not match the client re-render, and Vue logs a hydration
mismatch. Keep `idRandomization: false` for SSR'd avatars, or wrap the component
in `<ClientOnly>` and accept the visual flash.

If you need unique IDs across multiple avatars on the same page, render the
entire page server-side and skip client hydration of the avatar subtree.

:::

### Nitro endpoint

Expose DiceBear behind your own URL when you want custom caching or seed
validation:

```ts
// server/api/avatar/[seed].get.ts
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

export default defineEventHandler((event) => {
  const seed = getRouterParam(event, 'seed') ?? '';

  setHeader(event, 'Content-Type', 'image/svg+xml');
  setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');

  return new Avatar(style, { seed, size: 128 }).toString();
});
```

Consume it from any component with `<img :src="`/api/avatar/${seed}`">`.

### Cache with `useAsyncData`

For per-request SSR caching (so the same seed isn't re-rendered when multiple
components ask for it), wrap generation in `useAsyncData`:

```vue
<script setup lang="ts">
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

const props = defineProps<{ seed: string }>();

const { data: avatar } = await useAsyncData(`avatar:${props.seed}`, () =>
  Promise.resolve(
    new Avatar(style, { seed: props.seed, size: 128 }).toDataUri(),
  ),
);
</script>

<template>
  <img :src="avatar ?? undefined" alt="Avatar" width="128" height="128" />
</template>
```

## With the HTTP API

The HTTP API needs no installation. The URL is the same on the server and in the
browser, so `<img>` works in any rendering mode:

```vue
<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{ seed?: string }>();

const src = computed(() => {
  const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
  url.searchParams.set('seed', props.seed ?? 'Alice');
  url.searchParams.set('size', '128');
  return url.href;
});
</script>

<template>
  <img :src="src" alt="Avatar" width="128" height="128" />
</template>
```
