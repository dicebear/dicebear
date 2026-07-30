---
title: Filter Avatar Variants with Tags
description: >
  Variant tags describe how a variant looks or behaves. The tags option filters
  the variant pool. Today that turns on the opt-in animation of the animated
  styles, and an upcoming release adds traits like mood and hair length.
---

# Filter avatar variants with tags

Avatar styles can describe their variants with **tags**. A tag is a short label
like `animation` or `hairLength:long` that says something about a variant. Tags
only describe, they never change the artwork. They let you narrow the pool of variants an
avatar is drawn from, and they work the same way across every style that
carries them.

## Filter with the `tags` option

`tags` is a [core option](/guides/core-options/), so it works
everywhere the avatar is generated. Pass the tags you want to keep:

```js
import { Style, Avatar } from '@dicebear/core';
import planets from '@dicebear/styles/planets.json' with { type: 'json' };

const style = new Style(planets);
const avatar = new Avatar(style, {
  seed: 'John',
  tags: ['animation'],
});
```

In the [HTTP API](/how-to-use/http-api/) the same filter is a comma-separated
query parameter:

```
https://api.dicebear.com/10.x/planets/svg?seed=John&tags=animation
```

## How the filter works

A tag token is `category` or `category:value`, optionally prefixed with `!`.
Each token narrows a component's pool of variants:

| Token            | Effect                                                                                                                      |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `category:value` | Keeps variants that carry this tag, plus variants with no tag in the category. Several values of one category act as "or".   |
| `category`       | Requires the category: drops variants that carry no tag in it. It binds only in components that use the category at all.     |
| `!category:value` | Drops every variant that carries exactly this tag.                                                                          |
| `!category`      | Drops every variant that carries any tag in the category.                                                                    |

A few rules tie the tokens together:

- A category only touches the components that use it, so you change one trait
  and the rest of the avatar stays varied.
- Different categories act as "and", and a disallow (`!`) always wins over an
  allow.
- A per-component variant option is more specific and takes precedence. When you
  set `animationVariant` directly, the `tags` filter is ignored for the
  animation and applies only to the other components.

::: tip

If a filter leaves a component with no matching variants, that component is not
drawn. Loosen the filter or check the tags the style actually provides on its
[style page](/styles/). Passing `tags` to a style that carries no tags does
nothing.

:::

## The tags DiceBear offers

Right now, DiceBear's own styles carry tags in one place: the opt-in animation
of the animated styles. An upcoming release adds a shared set for the character
styles with mood, hair length, hair style, headwear, facial hair, eyewear, and
accessory. Those definitions already live in
[How DiceBear tags variants](/guides/how-dicebear-tags-variants/).

| Category    | Values                    | Found on                                    |
| ----------- | ------------------------- | ------------------------------------------- |
| `animation` | (bare category, no values) | the animation component of animated styles  |

The animation is off by default, and the filter controls it like this:

| `tags`       | Result                                              |
| ------------ | --------------------------------------------------- |
| `animation`  | Turns the animation on, at a random speed per seed. |
| `!animation` | Keeps the avatar static, which is also the default. |

For a fixed speed, skip the filter and set the variant directly with the
`animationVariant` option (e.g. `animationVariant: 'slow'`), which is more
specific and always wins.

```js
// Turn on the opt-in animation of an animated style, at a random speed
// per seed.
const avatar = new Avatar(style, {
  seed: 'Alex',
  tags: ['animation'],
});
```

## Custom styles

Tags are not limited to this list. A [custom style](/guides/create-an-avatar-style-with-figma/)
can reuse these categories, add its own values, or define entirely different ones.
The only rule is the grammar: a tag is `category` or `category:value`, and each
segment is camelCase (for example `mouthExpression:smug` or `species:robot`).
There is no fixed vocabulary a style has to follow, so pick the categories that
describe your artwork.
