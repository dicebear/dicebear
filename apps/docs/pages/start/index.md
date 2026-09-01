---
title: Your First Avatar – DiceBear Quickstart
description: >
  Create your first DiceBear avatar in under a minute. Start with a plain img
  tag and the free avatar API, then switch to the library when you need more.
---

<script setup>
import DocsSeedDemo from '@theme/components/docs/DocsSeedDemo.vue';
</script>

# Your first avatar

You don't need to install anything. Every DiceBear avatar has a URL, and any
`<img>` tag can show it:

```html
<img src="https://api.dicebear.com/11.x/lorelei/svg?seed=Alice" alt="avatar" />
```

Two things in that URL shape the avatar: the style, here `lorelei`, and the
`seed`. The style sets the look, the seed picks a unique avatar within it, and
the same seed always returns the same result. `Alice` gets the same face today,
tomorrow, and on every device. Type something into the field below, watch four
styles react, and click a tile to see its URL:

<DocsSeedDemo />

That's the whole idea. Use a username or user ID as the seed and every person in
your app gets a stable avatar, without uploads and without storing images.

## Pick a style

The four styles above are a taste of %STYLE_COUNT%, drawn by different artists,
from minimal geometric marks to fully illustrated characters and robots. No
other avatar library offers a collection like it, and switching is one word in
the URL:

```html
<img src="https://api.dicebear.com/11.x/bottts/svg?seed=Alice" alt="avatar" />
```

Take a stroll through the [style gallery](/styles/): every style has its own
page with live previews, and somewhere in there is the one that fits your
project.

## Make it yours

Styles come with options. Some are shared by all of them, like background color,
flip, and scale, and most styles add their own on top, like hair, eyes, or
accessories. Options ride along in the URL as query parameters:

```html
<img
  src="https://api.dicebear.com/11.x/lorelei/svg?seed=Alice&flip=true&backgroundColor=b6e3f4"
  alt="avatar"
/>
```

You'll find each style's options on its page in the gallery. Or skip the
reading: the [Playground](/playground/) lets you click a configuration together
and copy the finished URL.

## Generate avatars in your own code

If you'd rather create avatars locally, without a request to the API, use one of
the libraries. In JavaScript:

```
npm install @dicebear/core @dicebear/styles
```

```js
import { Style, Avatar } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };

const style = new Style(lorelei);
const avatar = new Avatar(style, { seed: 'Alice' });

const svg = avatar.toString();
```

The same libraries exist for PHP, Python, Rust, Go, Dart, and C#, all with the
same behavior: the seed `Alice` renders the same avatar in every language.
Unsure which route fits your project? The
[integration picker](/start/pick-your-integration/) sorts it out in three
questions.

## Where to next?

- Want motion? %ANIMATED_STYLE_COUNT% styles [animate](/animated-avatars/) with
  plain CSS and play in a normal `<img>` tag.
- Read up on [options](/customize/options/) like size, background, and flip.
- Building with a framework? There are guides for
  [React](/integrations/javascript/react/),
  [Vue](/integrations/javascript/vue/),
  [Svelte](/integrations/javascript/svelte/), and more.
