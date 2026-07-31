---
layout: page
title: Avatar Styles – Browse %STYLE_COUNT% Avatar Designs
description: >
  Browse %STYLE_COUNT% styles and generate avatars with the DiceBear avatar
  library. From abstract patterns to character designs: the perfect avatar
  generator for profile pictures and user avatars.
aside: false
sidebar: false
---

<script setup lang="ts">
import StyleList from "@theme/components/styles/StyleList.vue";
import { UiContainer, UiHeadline, UiDescription } from "@theme/components/ui";
</script>

<UiContainer class="styles-page">
  <div class="styles-hero">
    <UiHeadline tag="h1" class="styles-title">
      <strong>Styles</strong> Overview
    </UiHeadline>
    <UiDescription>
      Browse our avatar library, from abstract patterns to hand-drawn character illustrations. Some styles come from independent artists, others we designed ourselves. All of them are ready to use as profile pictures in your projects.
    </UiDescription>
  </div>

  <StyleList />
</UiContainer>

<style>
.styles-page .styles-hero {
  text-align: center;
  padding: 80px 0 48px;
}
</style>
