---
title: How Many Unique Avatars Are Possible?
description: >
  Find out how many visibly distinct seed-driven avatars each DiceBear avatar
  style can produce at its default configuration.
---

<script setup lang="ts">
import UniqueAvatarsTable from '@theme/components/guides/UniqueAvatarsTable.vue';
</script>

# How many unique avatars are possible per avatar style?

The table estimates how many visibly distinct avatars the seed alone can produce
for each style, with every other option left at its default.

<UniqueAvatarsTable />

## How the count works

The estimate follows the choices the renderer makes:

- Every visible component adds one pick among its variants. Variants with weight
  `0` don't count, because the seed never picks them unless every variant has
  weight `0`. A component that only sometimes appears adds "not drawn" as one
  more outcome.
- Component rotation, translation, and scale count at a grain the eye can tell
  apart: whole degrees, whole percent of the component's size, and hundredths of
  scale, or the range's own `step` where that is coarser. The renderer samples
  much finer, but those extra values are invisible.
- A color group only counts when the avatar shows something in that color. A hat
  color changes nothing on an avatar without a hat. The background always
  counts. `notEqualTo` removes the colors the referenced groups picked, and a
  `contrastTo` group adds no choice of its own.
- In styles that draw initials from the seed, each letter can be any of about
  140,000 Unicode letters, with up to two letters per avatar.

Options you set yourself, such as your own palettes, variant lists, `flip`,
`rotate`, or `borderRadius`, raise the count further.

If a number looks wrong, please open a
[discussion](https://github.com/orgs/dicebear/discussions) on GitHub.
