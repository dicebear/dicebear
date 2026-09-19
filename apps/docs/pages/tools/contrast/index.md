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
import SitePageHead from "@theme/components/site/SitePageHead.vue";
import ContrastTool from "@theme/components/tools/ContrastTool.vue";

const crumbs = [
  { text: 'Home', link: '/' },
  { text: 'Tools', link: '/tools/' },
  { text: 'Contrast' },
];
</script>

<SitePageHead :crumbs="crumbs" title="Contrast picker">

See which of two contrast colors DiceBear picks for any color, using the WCAG
2.1 algorithm from `@dicebear/core`.

</SitePageHead>

<ContrastTool />
