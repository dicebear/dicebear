---
title: How Avatars Are Made – DiceBear Internals
description: >
  How DiceBear turns a seed into an avatar: SVG composition, the FNV-1a and
  Mulberry32 PRNG behind deterministic results, and why all libraries render
  identical output.
---

# How avatars are made

Every DiceBear avatar is an [SVG](https://en.wikipedia.org/wiki/Scalable_Vector_Graphics)
composed at request time. Nothing is drawn pixel by pixel: an avatar style is
a JSON definition that describes components such as hair, eyes, or mouth,
each with a set of variants and colors. The renderer picks one variant per
component, applies the colors, and assembles the parts into a single SVG.
That's cheap enough to do on every request, and the result scales to any size
without losing sharpness.

## The seed makes it deterministic

The picks are random, but seeded. Your seed is hashed with
[FNV-1a](https://en.wikipedia.org/wiki/Fowler%E2%80%93Noll%E2%80%93Vo_hash_function)
and the hash initializes a
[Mulberry32](https://gist.github.com/tommyettinger/46a874533244883189143505d203312c)
[PRNG](https://en.wikipedia.org/wiki/Pseudorandom_number_generator). Every
decision the renderer makes, which hair, which eyes, which color, draws from
this generator. Because everything derives from the seed, the same seed walks
through the exact same decisions and produces the exact same avatar, today
and in ten years.

One consequence worth knowing: the PRNG is
**not** [cryptographically secure](https://en.wikipedia.org/wiki/Cryptographically-secure_pseudorandom_number_generator),
and it doesn't try to be. Use seeds to get stable avatars, not to derive
anything secret.

## The same in every language

All DiceBear libraries and the HTTP API implement this pipeline with
byte-identical output. The style definitions are plain JSON that every
implementation consumes as-is, and the PRNG behaves the same everywhere. That
is why you can render avatars in the browser today and move rendering to a
Rust backend later without a single avatar changing.

## Dig deeper

- The [definition schema](/create-styles/definition-schema/) documents the
  JSON format behind every style.
- [How many unique avatars?](/understand/how-many-unique-avatars/) does the
  math on the output space per style.
- [Implement DiceBear Core](/create-styles/implement-dicebear-core/) specifies
  the renderer, in case you want to port it to another language.
