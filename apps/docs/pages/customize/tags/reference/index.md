---
title: How DiceBear Tags Variants
description: >
  How DiceBear assigns variant tags to its own styles: one set for the character
  styles, covering mood, hair length, headwear, facial hair, eyewear, and
  accessory.
---

# How DiceBear tags variants

DiceBear's own styles share one set of tags, so the [`tags`](/customize/tags/)
filter behaves the same from one style to the next. Custom styles are free to
use their own, see [Custom styles](/customize/tags/#custom-styles).

Each variant is tagged by how it renders, not by its name. A hair variant called
`long04` can turn out short once you look at it, so the rendered shape decides.
A few principles keep the tags consistent:

- Tags only describe. A variant carries the labels that fit what it shows, and
  never a category outside the set below. To leave something out at render time,
  use the `!` form of the [`tags` option](/customize/tags/).
- A tag is added only when the trait is clear. An ambiguous or purely decorative
  variant stays untagged rather than guessed. Where a category has a bare form,
  as `headwear` and `accessory` do, a variant whose value is unclear still gets
  the bare tag. A variant with a clear value carries the value tag alone, since
  it already counts for the whole category.
- Most variants carry no tag or one tag. A few carry two, such as hair with a
  visible hat.

The tag grammar is `category` or `category:value`, each segment camelCase and
alphanumeric. A variant holds at most 32 tags.

## Categories

### Mood

The `mood` category covers the parts of the face that carry expression: the
mouth, eyes, eyebrows, and any combined expression component. A variant gets at
most one value.

- `negative` for a clearly unfriendly or distressed expression: angry, sad, or
  scared.
- `positive` for everything else, including happy, neutral, surprised, playful,
  and confused faces.

Because anything that isn't clearly negative counts as positive, filtering on
`mood:positive` keeps avatars friendly and never empties a component. Mood is
deliberately coarse. With a finer list, a feeling like "sad" would often lack a
variant for some part of the face, and the avatar would render incomplete.

A part with no expression at all, such as a face mask or a purely graphic shape,
gets no mood.

### Hair length

The `hairLength` category covers hair components. It is only set when the length
is actually visible.

- `bald` for no hair, or hair shaved to the scalp.
- `short` for hair above the ears, cropped or buzzed.
- `medium` for around ear-to-jaw length.
- `long` for hair past the jaw, shoulder length or longer.

Hair gathered or pinned up so the length can't be read, such as a bun or a
top-knot, gets no length. A ponytail or pigtails with a visible hanging tail
still does. A variant that is really headwear gets a `headwear` tag, and a
variant showing both hair and a hat may carry both.

Cut and texture carry no tags, because whether hair reads as wavy or curly would
come out differently from one style to the next. For a specific hairstyle, set
the style's own hair variant option.

### Headwear

The `headwear` category covers anything worn on the head. A variant with an
unmistakable shape carries one of the values below, any other one the bare
`headwear` tag. Either way, `!headwear` removes it:

- `hat` for a crown with a brim all the way around, such as a sun hat or a
  fedora.
- `cap` for a brim at the front only, such as a baseball or a flat cap.
- `beanie` for a soft, close-fitting hat without a brim.
- `turban` for wrapped cloth that covers the hair and leaves the neck free.
- `headscarf` for wrapped cloth that covers the hair together with the neck or
  the shoulders.
- `headband` for a band alone, with the hair still visible.

Decorations worn in the hair, such as flowers, bows, pins, or a scrunchie, get
the bare tag as well. If the decoration belongs to a hair variant, `!headwear`
leaves out that hairstyle too.

The values name the shape of the garment, not the person wearing it. That is why
the two wrapped forms are told apart by the neck, and why the tag says
`headscarf` rather than naming a particular garment: the drawing shows cloth,
and the same cloth means different things to different people.

### Facial hair

The `facialHair` category covers beards, mustaches, and sideburns. It is a bare
category without values: a variant showing any facial hair carries the plain
`facialHair` tag, and a clean-shaven one carries none.

- `['!facialHair']` leaves facial hair out.
- `['facialHair']` drops the untagged variants of the components that use the
  category. Whether such a component is drawn at all is still up to its
  probability.

There are no values because where stubble ends and a beard begins would land
differently from one style to the next. For a specific beard, set the style's
facial hair variant option.

### Eyewear

The `eyewear` category covers glasses and eye patches.

- `glasses` for clear lenses or spectacles.
- `sunglasses` for filled or dark lenses.
- `eyepatch` for a patch over one eye.

### Accessory

The `accessory` category covers worn extras. Ear jewelry and masks carry one of
the values below, any other worn extra the bare `accessory` tag, such as a clown
nose, a pacifier, or a collar. Either way, `!accessory` removes it:

- `earrings` for ear jewelry.
- `mask` for a face covering worn over the mouth or face, such as a medical
  mask. A mask is a worn item, not an expression, so a masked mouth gets
  `accessory:mask` and no `mood`.
