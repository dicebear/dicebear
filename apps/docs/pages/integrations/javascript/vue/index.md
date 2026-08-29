---
title: Vue Avatar Library – DiceBear Integration
description: >
  Add DiceBear SVG avatars to Vue 3 projects via the JavaScript avatar library
  or avatar API. Includes TypeScript support.
---

# Vue avatar library: using DiceBear with Vue

Wrap avatar generation in a `computed` property to keep profile pictures in sync
with reactive data. Use the JS library for full control, or the HTTP API for a
dependency-free approach.

## With the JS library

```vue
<script setup>
import { computed } from 'vue';
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);

const props = defineProps({
  seed: { type: String, default: 'Alice' },
});

const avatar = computed(() =>
  new Avatar(style, {
    seed: props.seed,
    size: 128,
    // ... other options
  }).toDataUri(),
);
</script>

<template>
  <img :src="avatar" alt="Avatar" />
</template>
```

## With the HTTP API

```vue
<script setup>
import { computed } from 'vue';

const props = defineProps({
  seed: { type: String, default: 'Alice' },
});

const src = computed(() => {
  const url = new URL('https://api.dicebear.com/10.x/lorelei/svg');
  url.searchParams.set('seed', props.seed);
  url.searchParams.set('size', '128');
  // ... other options
  return url.href;
});
</script>

<template>
  <img :src="src" alt="Avatar" />
</template>
```
