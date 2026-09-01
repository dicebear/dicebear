---
title: Svelte Avatar Library – DiceBear Integration
description: >
  Use DiceBear to generate SVG profile pictures in Svelte via the JavaScript
  avatar library or avatar API.
---

# Svelte avatar library: using DiceBear with Svelte

DiceBear works with both Svelte 4 and Svelte 5. Use `$derived` (Svelte 5) or
reactive statements (Svelte 4) to keep SVG profile pictures in sync with prop
changes, either via the JS library for client-side generation or the HTTP API
for a zero-dependency approach.

## With the JS library

::: code-group

```svelte [Svelte 5]
<script>
  import { Style, Avatar } from '@dicebear/core';
  import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

  const style = new Style(lorelei);

  let { seed = 'Alice' } = $props();

  const avatar = $derived(
    new Avatar(style, {
      seed,
      size: 128,
      // ... other options
    }).toDataUri()
  );
</script>

<img src={avatar} alt="Avatar" />
```

```svelte [Svelte 4]
<script>
  import { Style, Avatar } from '@dicebear/core';
  import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

  const style = new Style(lorelei);

  export let seed = 'Alice';

  $: avatar = new Avatar(style, {
    seed,
    size: 128,
    // ... other options
  }).toDataUri();
</script>

<img src={avatar} alt="Avatar" />
```

:::

## With the HTTP API

::: code-group

```svelte [Svelte 5]
<script>
  let { seed = 'Alice' } = $props();

  const src = $derived.by(() => {
    const url = new URL('https://api.dicebear.com/11.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... other options
    return url.href;
  });
</script>

<img src={src} alt="Avatar" />
```

```svelte [Svelte 4]
<script>
  export let seed = 'Alice';

  let src = '';

  $: {
    const url = new URL('https://api.dicebear.com/11.x/lorelei/svg');
    url.searchParams.set('seed', seed);
    url.searchParams.set('size', '128');
    // ... other options
    src = url.href;
  }
</script>

<img src={src} alt="Avatar" />
```

:::
