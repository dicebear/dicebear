---
layout: page
title: WCAG Contrast Picker – Tools
description: >
  Interactive WCAG 2.1 contrast picker built on the @dicebear/core algorithm.
  Pick a color and see which of two contrast colors DiceBear would choose,
  visualized as an iso-contrast boundary on the canvas.
aside: false
editLink: false
---

<script setup lang="ts">
import ContrastTool from "@theme/components/tools/ContrastTool.vue";
</script>

<ClientOnly>
  <ContrastTool />
</ClientOnly>
