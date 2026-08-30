---
title: How DiceBear Tags Variants
description: >
  How DiceBear assigns variant tags to its own styles: the planned standard set
  for the character styles covering mood, hair length, headwear, facial hair,
  eyewear, and accessory.
---

# How DiceBear tags variants

DiceBear's own styles share one set of tags, so the [`tags`](/customize/tags/)
filter behaves the same from one style to the next. The categories below
arrive with an upcoming release.

DiceBear tags each variant by looking at how it renders, not at its name. Names
are not always reliable. A hair variant called `long04` can turn out short once
you look at it, so the rendered shape decides the tag.

A few principles keep the tags consistent:

- Tags only describe. A variant carries the labels that fit what it shows, and
  never a category outside the set below.
- A tag is added only when the trait is clear. An ambiguous or purely decorative
  variant is left untagged rather than guessed. Where a category has a bare
  form, as `headwear` does, the bare tag is still set and only the value is left
  off.
- Most variants carry no tag or one tag. A few carry two, such as hair with a
  visible hat.
- Variant tags only add information, they never remove a variant on their own.
  To leave something out at render time, use the `!` form of the
  [`tags` option](/customize/tags/). Disallowing lives in the filter, not in the
  data.

The tag grammar is `category` or `category:value`, each segment camelCase and
alphanumeric. A variant holds at most 32 tags.

## Planned categories

::: warning Not shipped yet

No DiceBear style carries the categories below, so filtering on them has no
effect for now.

:::

The categories below are the standard set for the character styles. We publish
the definitions ahead of time so custom styles can reuse them and stay
compatible with the filter examples in the docs.

### Mood

The `mood` category covers the parts of the face that carry expression: the
mouth, eyes, eyebrows, and any combined expression component. It has two values,
and a variant gets at most one.

- `negative` for a clearly unfriendly or distressed expression: angry, sad, or
  scared.
- `positive` for everything else, including happy, neutral, surprised, playful,
  and confused faces.

Only a clear negative is tagged `negative`. Anything friendly, neutral, or
ambiguous is `positive`, so filtering on `mood:positive` always leaves a usable
variant and never empties a component. The usual reason to filter mood is to
keep avatars friendly, and `mood:positive` does that.

Mood is deliberately coarse. A finer list of feelings would not survive
filtering, because a specific feeling like "sad" often has no matching variant
for every part of a face, so that part would drop out and the avatar would
render incomplete. Two values keep every filtered face complete.

A part with no expression at all, such as a face mask or a purely graphic shape,
is left without a mood.

### Hair length

The `hairLength` category covers hair components. It is optional and only set
when the length is actually visible.

- `bald` for no hair, or hair shaved to the scalp.
- `short` for hair above the ears, cropped or buzzed.
- `medium` for around ear-to-jaw length.
- `long` for hair past the jaw, shoulder length or longer.

When the hair is gathered or pinned up so the length cannot be read, such as a
bun or a top-knot, the length is left off. A ponytail or pigtails with a visible
hanging tail still gets a length. A variant that is really headwear gets a
`headwear` tag, and a variant showing both hair and a hat may carry both.

The cut and the texture of the hair carry no tags. Whether hair reads as wavy or
curly is a judgment call that would come out differently from one style to the
next, and the filter is there to steer the look in broad strokes, not to pick a
haircut. For a specific hairstyle, set the style's own hair variant option.

### Headwear

The `headwear` category covers anything worn on the head. Every such variant
carries at least the bare `headwear` tag, so `!headwear` removes all of them. A
value comes on top of it when the shape is unmistakable:

- `hat` for a crown with a brim all the way around, such as a sun hat or a
  fedora.
- `cap` for a brim at the front only, such as a baseball or a flat cap.
- `beanie` for a soft, close-fitting hat without a brim.
- `turban` for wrapped cloth that covers the hair and leaves the neck free.
- `headscarf` for wrapped cloth that covers the hair together with the neck or
  the shoulders.
- `headband` for a band alone, with the hair still visible.

The values name the shape of the garment, not the person wearing it. That is why
the two wrapped forms are told apart by the neck, and why the tag says
`headscarf` rather than naming a particular garment: the drawing shows cloth,
and the same cloth means different things to different people.

### Facial hair

The `facialHair` category covers beards, mustaches, and sideburns. Like
`animation` it is a bare category without values: a variant showing any facial
hair carries the plain `facialHair` tag, and a clean-shaven one carries none.

- `['!facialHair']` leaves facial hair out.
- `['facialHair']` drops the untagged variants of the components that use the
  category. Whether such a component is drawn at all is still up to its
  probability.

Where stubble ends and a beard begins is a call that would land differently from
one style to the next, and what the filter is good for is saying yes or no to
facial hair. For a specific beard, set the style's facial hair variant option.

### Eyewear

The `eyewear` category covers glasses.

- `glasses` for clear lenses or spectacles.
- `sunglasses` for filled or dark lenses.

### Accessory

The `accessory` category covers worn extras.

- `earrings` for ear jewelry.
- `mask` for a face covering worn over the mouth or face, such as a medical
  mask. A mask is a worn item, not an expression, so a masked mouth gets
  `accessory:mask` and no `mood`.

## Custom styles

This set is what DiceBear's own styles use, not a rule every style has to
follow. A [custom style](/create-styles/with-figma/) can reuse these categories,
add its own values, or define entirely different ones. As long as the grammar
holds, you are free to describe your artwork in whatever way fits it best.
