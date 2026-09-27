---
title: Filter Avatar Variants with Tags
description: >
  Variant tags describe how a variant looks or behaves. The tags option filters
  the variant pool, for example by mood or hair length in the character styles,
  and custom styles can carry tags of their own.
---

# Filter avatar variants with tags

Avatar styles can describe their variants with tags, short labels like
`hairLength:long` or `facialHair`. Tags never change the artwork. They let you
narrow the pool of variants an avatar is drawn from, the same way in every style
that carries them.

Most of DiceBear's character styles carry tags for mood, hair length, headwear,
facial hair, eyewear, and accessory.
[How DiceBear tags variants](/customize/tags/reference/) explains each of them.

## Filter with the `tags` option

`tags` is a [core option](/customize/options/), so it works everywhere the
avatar is generated. Pass the tags you want to keep:

```js
import { Style, Avatar } from '@dicebear/core';
import adventurer from '@dicebear/styles/adventurer.json' with { type: 'json' };

const style = new Style(adventurer);
const avatar = new Avatar(style, {
  seed: 'John',
  tags: ['hairLength:long', 'mood:positive'],
});
```

In the [HTTP API](/integrations/http-api/) the same filter is a comma-separated
query parameter:

```http
https://api.dicebear.com/11.x/adventurer/svg?seed=John&tags=hairLength:long,mood:positive
```

## How the filter works

A tag token is `category` or `category:value`, optionally prefixed with `!`.
Each token narrows a component's pool of variants:

| Token             | Effect                                                                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `category:value`  | Keeps variants that carry this tag, plus variants with no tag in the category. Several values of one category act as "or". |
| `category`        | Requires the category: drops variants that carry no tag in it.                                                             |
| `!category:value` | Drops every variant that carries exactly this tag.                                                                         |
| `!category`       | Drops every variant that carries any tag in the category.                                                                  |

A few rules tie the tokens together:

- A category only touches the components that use it, so you change one trait
  and the rest of the avatar stays varied.
- Different categories act as "and", and a disallow (`!`) always wins over an
  allow.
- A per-component variant option is more specific and takes precedence. When you
  pin a component's variant directly, the `tags` filter is ignored for that
  component and applies only to the others.
- Only an unknown category is ignored. An unknown value is not. Because no
  variant matches it, every variant tagged in that category drops out. A typo in
  `hairLenght:long` changes nothing, while a typo in `hairLength:lng` removes
  the hair.

::: tip

If a filter leaves a component with no matching variants, that component is not
drawn. Loosen the filter or check the tags the style actually provides on its
[style page](/styles/). Passing `tags` to a style that carries no tags does
nothing.

:::

## Custom styles

A [custom style](/create-styles/with-figma/) can reuse the
[categories of the DiceBear styles](/customize/tags/reference/), add its own
values, or define entirely different ones. Reusing them keeps it compatible with
the filter examples in these docs. The only rule is the grammar: a tag is
`category` or `category:value`, and each segment is camelCase, for example
`mouthExpression:smug` or `species:robot`.
