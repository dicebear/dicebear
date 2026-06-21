---
title: How Do I Set a Gender?
description: >
  DiceBear has no single gender switch, but you can shape avatars to look more
  masculine or feminine by filtering variants with tags or setting each style's
  options. Here is how, plus where to share and reuse option sets.
---

# How do I set a gender?

DiceBear has no single `gender` switch, but you can shape any avatar to look more
masculine or feminine. The quickest way is to filter the variants by tag. When you
want finer control, every feature is also its own option you can set directly.
Either way, you pick the traits that fit the look you want, such as the hair or
facial hair, and leave out the rest.

## Filter by tags

Some styles tag their variants with descriptive labels such as `facialHair:beard`
or `hairLength:long`. The [`tags`](/guides/filter-variants-with-tags/) option keeps
only the variants you choose, which is often the quickest way to lean on the
features that read as more masculine or feminine. For example, keep long hair and
leave out facial hair:

```js
const avatar = new Avatar(style, {
  seed: 'Casey',
  tags: ['hairLength:long', '!facialHair'],
});
```

The same filter works as a query parameter in the HTTP API:

```
https://api.dicebear.com/10.x/adventurer/svg?seed=Casey&tags=hairLength:long,!facialHair
```

See [Filter variants with tags](/guides/filter-variants-with-tags/) for the full
list of tags and how the filter behaves.

## Find and apply the options

Tags cover the common cases, but not every style is tagged, and sometimes you
want one specific variant rather than a whole category. For that, set the features
directly as options. The [Playground](/playground/) shows a preview for every
option value and lets you combine them, with the avatar updating as you go. Every
[avatar style page](/styles/) lists the same options as a static reference, also
with previews, so you can look them up at any time. If you would rather not write
any code, the [Editor](https://editor.dicebear.com) lets you browse styles and
adjust options visually.

Once you know which options you want, pass them as
[query parameters in the HTTP API](/how-to-use/http-api/#options) or as options
in the [JS library](/how-to-use/js-library/) and the other libraries. The
Avataaars style, for example, lets you turn facial hair off with
`facialHairProbability=0`:

```
https://api.dicebear.com/10.x/avataaars/svg?seed=Casey&facialHairProbability=0
```

Tags and the per-feature options work together, so you can combine a tag filter
with options such as `facialHairProbability`. The options differ from style to
style, so check the style page for the one you use.

## Share and reuse option sets

If you put together a set of options you like, share it under
[Show and tell](https://github.com/orgs/dicebear/discussions/categories/show-and-tell)
in our GitHub Discussions. Other people can then build on your work and adapt it
to their own needs, and you can reuse combinations that others have already
shared.

## Why there is no dedicated gender option

Most DiceBear styles draw a face or head, not a whole body. A face shows very
few features that clearly read as male or female, so there is no dependable set
of traits a `male`/`female` switch could flip. The closest thing to an exception
is facial hair, which grows mainly on men. Even that is a weak signal: many men
are clean-shaven by choice, culture, or religion, and in many populations men
naturally grow little facial hair, so a missing beard tells you nothing.

Beyond facial hair, what reads as "masculine" or "feminine" depends on culture
and personal taste. A hairstyle, a piece of clothing, or an accessory can mean
something different depending on where and who you are. A built-in switch would
have to settle on one fixed interpretation for everyone, and that would not fit
every project or audience.

DiceBear is used all over the world, in every kind of project, so it makes no
assumptions about what a male or female avatar should look like. No option is
tied to a gender unless the style's designer deliberately built it that way. The
options describe features such as hair or glasses, not a gender.
