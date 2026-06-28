---
title: How DiceBear Tags Variants
description: >
  How DiceBear assigns variant tags to its own styles, and what each tag in the
  standard set means: mood, hair length, hair style, headwear, facial hair,
  eyewear, and accessory.
---

# How DiceBear tags variants

DiceBear's own styles share one set of tags, so the
[`tags`](/guides/filter-variants-with-tags/) filter behaves the same from one
style to the next. DiceBear tags each variant by looking at how it renders, not at
its name. Names are not always reliable. A hair variant called `long04` can turn
out short once you look at it, so the rendered shape decides the tag.

A few principles keep the tags consistent:

- Tags only describe. A variant carries the labels that fit what it shows, and
  never a category outside the set below.
- A tag is added only when the trait is clear. An ambiguous or purely decorative
  variant is left untagged rather than guessed.
- Most variants carry no tag or one tag. A few carry two, such as hair with a
  visible hat, or a beard together with a mustache.
- Variant tags only add information, they never remove a variant on their own. To
  leave something out at render time, use the `!` form of the
  [`tags` option](/guides/filter-variants-with-tags/). Disallowing lives in the
  filter, not in the data.

The tag grammar is `category` or `category:value`, each segment camelCase and
alphanumeric. A variant holds at most 32 tags.

## Mood

The `mood` category covers the parts of the face that carry expression: the
mouth, eyes, eyebrows, and any combined expression component. It has two values,
and a variant gets at most one.

- `negative` for a clearly unfriendly or distressed expression: angry, sad, or
  scared.
- `positive` for everything else, including happy, neutral, surprised, playful, and
  confused faces.

Only a clear negative is tagged `negative`. Anything friendly, neutral, or
ambiguous is `positive`, so filtering on `mood:positive` always leaves a usable
variant and never empties a component. The usual reason to filter mood is to keep
avatars friendly, and `mood:positive` does that.

Mood is deliberately coarse. A finer list of feelings would not survive filtering,
because a specific feeling like "sad" often has no matching variant for every part
of a face, so that part would drop out and the avatar would render incomplete. Two
values keep every filtered face complete.

A part with no expression at all, such as a face mask or a purely graphic shape, is
left without a mood.

## Hair length

The `hairLength` category covers hair components. It is optional and only set when
the length is actually visible.

- `bald` for no hair, or hair shaved to the scalp.
- `short` for hair above the ears, cropped or buzzed.
- `medium` for around ear-to-jaw length.
- `long` for hair past the jaw, shoulder length or longer.

When the hair is gathered or pinned up so the length cannot be read, the length is
left off and the variant is tagged `hairStyle:updo` instead. A ponytail or pigtails
with a visible hanging tail still gets a length. A variant that is really headwear
gets a `headwear` tag, and a variant showing both hair and a hat may carry both.

## Hair style

The `hairStyle` category covers the same components as the length and runs
alongside it. A variant may carry one texture value and one shape value when both
read clearly, for example a curly updo is both `curly` and `updo`.

Texture, how the hair falls:

- `straight` for smooth hair with no curl.
- `wavy` for loose waves or kinks.
- `curly` for defined curls, ringlets, or spirals.
- `afro` for dense, afro-textured volume.

Cut or shape, how it is worn:

- `buzzcut` for shaved or very short all-over hair.
- `bob` for a chin-to-jaw bob.
- `updo` for hair gathered and pinned up, such as a bun, top-knot, or French
  twist. The length is hidden, so an `updo` variant carries no `hairLength`.
- `ponytail` for a ponytail, pigtails, or a tied tail that hangs down.
- `braids` for braids, plaits, or cornrows.
- `dreadlocks` for locs or dreads.
- `mohawk` for shaved sides with a central crest.
- `bangs` for a fringe over the forehead.

A bald variant carries only `hairLength:bald` and no `hairStyle`, since there is no
hair to style.

## Headwear

The `headwear` category covers hats and hat-like variants.

- `hat` for a brimmed or general hat, including a winter or sun hat.
- `cap` for a baseball or flat cap.
- `beanie` for a knitted, close-fitting hat.
- `turban` and `hijab` for wrapped headwear.
- `headband` for a band only, with the hair still visible.

## Facial hair

The `facialHair` category covers beards, mustaches, and sideburns. A full beard
with a mustache can carry both `beard` and `mustache`.

- `beard` for hair across the jaw and chin.
- `mustache` for the upper lip only.
- `goatee` for a chin tuft, with or without a connected mustache.
- `stubble` for a short flecked shadow, not a full beard.
- `sideburns` for side-of-face hair only.

## Eyewear

The `eyewear` category covers glasses.

- `glasses` for clear lenses or spectacles.
- `sunglasses` for filled or dark lenses.

## Accessory

The `accessory` category covers worn extras.

- `earrings` for ear jewelry.
- `mask` for a face covering worn over the mouth or face, such as a medical mask.
  A mask is a worn item, not an expression, so a masked mouth gets `accessory:mask`
  and no `mood`.

## Custom styles

This set is what DiceBear's own styles use, not a rule every style has to follow. A
[custom style](/guides/create-an-avatar-style-with-figma/) can reuse these
categories, add its own values, or define entirely different ones. As long as the
grammar holds, you are free to describe your artwork in whatever way fits it best.
