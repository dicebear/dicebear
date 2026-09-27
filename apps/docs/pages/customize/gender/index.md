---
title: How Do I Set a Gender?
description: >
  DiceBear has no single gender switch, but you can shape avatars to look more
  masculine or feminine by setting each style's options or by filtering variants
  with tags.
---

# How do I set a gender?

DiceBear has no `gender` switch, but you can make any avatar look more masculine
or feminine. Every feature is its own option, so you set the traits that fit the
look you want, such as the hair or facial hair, and leave the rest to the seed.

## Find and apply the options

The [Playground](/playground/) previews every option value and lets you combine
them. Every [style page](/styles/) lists the same options with previews, and the
[Editor](https://editor.dicebear.com) lets you adjust them without any code.

Pass the options you picked as
[query parameters in the HTTP API](/integrations/http-api/#options) or as
options in the [JS library](/integrations/javascript/) and the other libraries.
In Avataaars, for example, `facialHairProbability=0` turns facial hair off:

```http
https://api.dicebear.com/11.x/avataaars/svg?seed=Casey&facialHairProbability=0
```

The options differ from style to style, so check the page of the style you use.

## Filter by tags

Most character styles tag their variants with labels such as `hairLength:long`
or `headwear:headscarf`. The [`tags`](/customize/tags/) option keeps only the
variants you choose, for example long hair without facial hair:

```js
const avatar = new Avatar(style, {
  seed: 'Casey',
  tags: ['hairLength:long', '!facialHair'],
});
```

```http
https://api.dicebear.com/11.x/adventurer/svg?seed=Casey&tags=hairLength:long,!facialHair
```

Tags combine with the per-feature options, such as `facialHairProbability`.

## Why there is no gender option

Every DiceBear option names something that is drawn: a hairstyle, a beard,
glasses, a hat. None of those features belongs to a gender. Whether long hair, a
headscarf, or earrings read as masculine or feminine is a matter of convention,
and conventions differ by culture and by personal taste. A `male`/`female`
switch would impose one convention on a worldwide audience, and the library
would decide what a man or a woman looks like. That call belongs to your
project, not to us.

Even facial hair, the feature that comes closest to a signal, says little.
People grow a beard or shave it for reasons of taste, culture, and religion. No
option is tied to a gender unless a style's designer deliberately built it that
way.
