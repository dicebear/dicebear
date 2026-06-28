---
title: How Many Unique Avatars Are Possible?
description: >
  Find out how many unique seed-driven avatar combinations are possible for each
  DiceBear avatar style at default configuration.
---

<script setup lang="ts">
import UniqueAvatarsTable from '@theme/components/guides/UniqueAvatarsTable.vue';
</script>

# How many unique avatars are possible per avatar style?

The number below is the size of the seed-driven output space for each style at
its default configuration: how many distinct avatars the seed can produce while
every other option is left untouched. The count mirrors what the renderer
actually does:

- **Variant pick per component.** Each visible component contributes one variant
  choice. Variants with `weight: 0` are excluded because the PRNG never picks
  them (unless every variant has `weight: 0`, in which case the PRNG falls back
  to an unweighted pick across all of them).
- **Probability.** A component whose `probability` is strictly between `0` and
  `100` adds the "not rendered" branch as one extra outcome. A component with
  `probability: 0` collapses to a single (always-absent) outcome.
- **Per-component transforms.** `rotate`, `scale`, and `translate` ranges in the
  definition are sampled with 4-decimal precision per component reference, so a
  `[min, max]` range contributes `round((max - min) × 10000) + 1` distinct
  values.
- **Color palettes.** Color groups are evaluated jointly: `notEqualTo` strips
  the picked hex values of the referenced groups (with the renderer's "fall back
  to full palette when filtering empties" rule), and `contrastTo` reduces to a
  single, deterministic pick.
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
