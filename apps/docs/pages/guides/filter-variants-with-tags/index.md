---
title: Filter Avatar Variants with Tags
description: >
  Variant tags describe each part of an avatar, such as the mood, hair length, or
  facial hair. The tags option filters the variant pool, so you can keep only
  friendly faces, long hair, or any other trait, across DiceBear styles.
---

# Filter avatar variants with tags

Many avatar styles describe their variants with **tags**. A tag is a short label
like `mood:positive` or `hairLength:long` that says something about how a variant
looks. Tags only describe, they never change the artwork. They let you narrow the
pool of variants an avatar is drawn from, and they work the same way across every
style that carries them.

## Filter with the `tags` option

`tags` is a [core option](/guides/core-options/), so it works
everywhere the avatar is generated. Pass the tags you want to keep:

```js
import { Style, Avatar } from '@dicebear/core';
import adventurer from '@dicebear/styles/adventurer.json' with { type: 'json' };

const style = new Style(adventurer);
const avatar = new Avatar(style, {
  seed: 'John',
  tags: ['mood:positive'],
});
```

In the [HTTP API](/how-to-use/http-api/) the same filter is a comma-separated
query parameter:

```
https://api.dicebear.com/10.x/adventurer/svg?seed=John&tags=mood:positive
```

## How the filter works

A tag has the form `category:value`. The filter reads the tags you pass and
narrows each component's pool of variants:

- Filtering by `mood:positive` keeps the positive mouths, eyes, and eyebrows but
  leaves the hair alone, because hair carries no `mood` tag. A category only touches
  the components that use it, so you change one trait and the rest stays varied.
- Values in the same category act as "or". `['hairLength:short', 'hairLength:medium']`
  keeps short or medium hair.
- Different categories act as "and". `['hairLength:long', 'mood:positive']` keeps long
  hair together with a friendly face.
- A leading `!` disallows. `['!mood:negative']` drops the negative faces, which is the
  same as allowing `mood:positive` here, and a bare category like `['!facialHair']`
  drops every variant that has a facial-hair tag. A disallow always wins over an
  allow.

A per-component variant option is more specific and takes precedence. When you set
`mouthVariant` directly, the `tags` filter is ignored for the mouth and applies
only to the other components.

::: tip

If a filter leaves a component with no matching variants, that component is not
drawn. Loosen the filter or check the tags the style actually provides on its
[style page](/styles/). Passing `tags` to a style that carries no tags does
nothing.

:::

## The tags DiceBear offers

DiceBear's own styles use a shared set of categories, so the same filter behaves
consistently from one style to the next. Not every style carries every category,
and an abstract style may carry none.

| Category     | Values                                                                                            | Found on                                          |
| ------------ | ------------------------------------------------------------------------------------------------- | ------------------------------------------------- |
| `mood`       | `positive`, `negative`                                                                            | mouth, eyes, eyebrows, expression                 |
| `hairLength` | `bald`, `short`, `medium`, `long`                                                                  | hair, top, front hair                             |
| `hairStyle`  | `straight`, `wavy`, `curly`, `afro`, `buzzcut`, `bob`, `updo`, `ponytail`, `braids`, `dreadlocks`, `mohawk`, `bangs` | hair, top, front hair          |
| `headwear`   | `hat`, `cap`, `beanie`, `turban`, `hijab`, `headband`                                              | hats, and hat-like hair variants                  |
| `facialHair` | `beard`, `mustache`, `goatee`, `stubble`, `sideburns`                                             | beard, mustache, sideburns                       |
| `eyewear`    | `glasses`, `sunglasses`                                                                            | glasses                                           |
| `accessory`  | `earrings`, `mask`                                                                                 | earrings, face masks                              |

For what each value means and how DiceBear decides which to apply, see
[How DiceBear tags variants](/guides/how-dicebear-tags-variants/).

A few more examples:

```js
// A clean-shaven look with long hair.
const avatar = new Avatar(style, {
  seed: 'Jane',
  tags: ['hairLength:long', '!facialHair'],
});

// Only friendly faces, in any style that tags its mood.
const avatar = new Avatar(style, {
  seed: 'Sam',
  tags: ['mood:positive'],
});
```

## Custom styles

Tags are not limited to this list. A [custom style](/guides/create-an-avatar-style-with-figma/)
can reuse these categories, add its own values, or define entirely different ones.
The only rule is the grammar: a tag is `category` or `category:value`, and each
segment is camelCase (for example `mouthExpression:smug` or `species:robot`).
There is no fixed vocabulary a style has to follow, so pick the categories that
describe your artwork.
