---
title: How Do I Set a Gender?
description: >
  DiceBear has no single gender switch, but you can shape avatars to look more
  masculine or feminine by setting each style's options, and soon by filtering
  variants with tags. Here is how, plus where to share and reuse option sets.
---

# How do I set a gender?

DiceBear has no single `gender` switch, but you can shape any avatar to look
more masculine or feminine. Every feature is its own option you can set
directly, so you pick the traits that fit the look you want, such as the hair or
facial hair, and leave out the rest. An upcoming release adds descriptive
variant tags that turn the common cases into a one-liner.

## Find and apply the options

The [Playground](/playground/) shows a preview for every option value and lets
you combine them, with the avatar updating as you go. Every
[avatar style page](/styles/) lists the same options as a static reference, also
with previews, so you can look them up at any time. If you would rather not
write any code, the [Editor](https://editor.dicebear.com) lets you browse styles
and adjust options visually.

Once you know which options you want, pass them as
[query parameters in the HTTP API](/integrations/http-api/#options) or as
options in the [JS library](/integrations/javascript/) and the other libraries.
The Avataaars style, for example, lets you turn facial hair off with
`facialHairProbability=0`:

```
https://api.dicebear.com/11.x/avataaars/svg?seed=Casey&facialHairProbability=0
```

The options differ from style to style, so check the style page for the one you
use.

## Filter by tags

::: warning The character tags are not available yet

No DiceBear style carries tags such as `hairLength` or `facialHair` today, so
the filters in this section have no effect for now. Until they ship, set the
per-feature options described above.

:::

An upcoming release tags the character styles' variants with descriptive labels
such as `hairLength:long` or `headwear:headscarf`. The
[`tags`](/customize/tags/) option keeps only the variants you choose, which will
often be the quickest way to lean on the features that read as more masculine or
feminine. For example, keep long hair and leave out facial hair:

```js
const avatar = new Avatar(style, {
  seed: 'Casey',
  tags: ['hairLength:long', '!facialHair'],
});
```

The same filter works as a query parameter in the HTTP API:

```
https://api.dicebear.com/11.x/adventurer/svg?seed=Casey&tags=hairLength:long,!facialHair
```

Tags and the per-feature options work together, so you can combine a tag filter
with options such as `facialHairProbability`. See
[Filter variants with tags](/customize/tags/) for how the filter behaves and
which tags are already available.

## Share and reuse option sets

If you put together a set of options you like, share it under
[Show and tell](https://github.com/orgs/dicebear/discussions/categories/show-and-tell)
in our GitHub Discussions. Other people can then build on your work and adapt it
to their own needs, and you can reuse combinations that others have already
shared.

## Why there is no dedicated gender option

Every DiceBear option names something that is drawn: a hairstyle, a beard,
glasses, a hat. None of those features belongs to a gender. Whether long hair, a
headscarf, or earrings reads as masculine or feminine is a matter of convention,
and conventions differ by culture and by personal taste.

A `male`/`female` switch would have to settle on one such convention for
everyone. DiceBear is used all over the world, in every kind of project, so a
fixed mapping would be wrong for a good part of that audience, and the library
would be the one deciding what a man or a woman looks like. That call belongs to
your project, not to us.

Facial hair is the feature that comes closest to a signal, and it still says
little. People grow a beard or shave it for reasons of taste, culture, and
religion, so its presence describes the drawing rather than the person.

No option is tied to a gender unless the style's designer deliberately built it
that way. The options describe features such as hair or glasses, and what you
make of them is up to you.
