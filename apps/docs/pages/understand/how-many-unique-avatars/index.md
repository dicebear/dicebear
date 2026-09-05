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

The number below estimates how many visibly distinct avatars the seed can
produce for each style at its default configuration, with every other option
left untouched. It follows the renderer's choices, with one deliberate exception
for transforms:

- **Variant pick per component.** Each visible component contributes one variant
  choice. Variants with `weight: 0` are excluded because the PRNG never picks
  them (unless every variant has `weight: 0`, in which case the PRNG falls back
  to an unweighted pick across all of them).
- **Probability.** A component whose `probability` is strictly between `0` and
  `100` adds the "not rendered" branch as one extra outcome. A component with
  `probability: 0` collapses to a single (always-absent) outcome.
- **Per-component transforms.** `rotate`, `scale`, and `translate` ranges in the
  definition are counted at a grain the eye can still tell apart: whole degrees
  for `rotate`, whole percent of the component's size for `translate`, and
  hundredths for `scale`. A range with a coarser `step` is counted at that step
  instead. The renderer itself samples these ranges with four decimal places, so
  the true output space is far larger. Those extra values are invisible, so we
  leave them out.
- **Color palettes.** A color group only counts for renderings whose chosen
  variants reference it. A hat color on an avatar without a hat changes nothing,
  so it adds nothing. The `background` group counts for every rendering because
  the renderer paints it behind the avatar. Within one rendering the visible
  groups are evaluated jointly: `notEqualTo` strips the picked hex values of the
  referenced groups (with the renderer's "fall back to full palette when
  filtering empties" rule), and `contrastTo` reduces to a single, deterministic
  pick. Constraints against a hidden group are dropped, since a hidden color
  with two or more palette entries leaves the visible group its whole palette.
- **Seed-derived initials.** When a style renders the `initial` or `initials`
  variable, each output letter ranges over the Unicode `\p{L}` category (about
  140,000 distinct uppercased characters), and `initials` emits up to two
  letters per seed.

User-supplied options (custom color palettes, variant allowlists, additional
backgrounds, `flip`, `rotate`, `scale`, `translate`, `borderRadius`, ID
randomization, …) raise the count further beyond what is reported here.

<UniqueAvatarsTable />

If a number looks wrong, please open a
[discussion](https://github.com/orgs/dicebear/discussions) on GitHub.
