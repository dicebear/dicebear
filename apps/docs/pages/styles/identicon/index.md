---
title: Identicon – SVG Identicon API
description: >
  Generate deterministic Identicon avatars with DiceBear, a free, open source
  SVG identicon API and avatar library for user profile pictures.
outline: [2, 3]
---

<script setup lang="ts">
import StylePreview from "@theme/components/styles/StylePreview.vue";
import StyleInfo from "@theme/components/styles/StyleInfo.vue";
import StyleDescription from "@theme/components/styles/StyleDescription.vue";
import StyleUsage from "@theme/components/styles/StyleUsage.vue";
import StylePresets from "@theme/components/styles/StylePresets.vue";
import StyleOptions from "@theme/components/styles/StyleOptions.vue";
</script>

# Identicon

Identicon renders symmetrical pixel-grid patterns in a single color on a tinted
background, the classic identicon look popularized by developer tools and
version control hosts. Each pattern is deterministically derived from its seed,
so it works well for technical profile icons and identicon API use cases.

<StylePreview styleName="identicon" />

<StyleDescription styleName="identicon" />

## What is an identicon?

An identicon is a small image built from a value like a username, email, or user
ID. The same input always produces the same picture, so people can recognize an
account at a glance and nobody has to upload a photo. GitHub popularized them as
default profile pictures, and many developer tools do the same. DiceBear's
Identicon style works this way too: it hashes the seed and draws a symmetrical
grid, so you can use it as an identicon generator for profile icons and
placeholder avatars.

## Usage

<StyleUsage styleName="identicon" />

## Presets

<StylePresets styleName="identicon" :limit="5" />

## Options

<StyleOptions styleName="identicon" />

## Details

<StyleInfo styleName="identicon" />
