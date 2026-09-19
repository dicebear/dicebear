---
layout: page
title: Bundle Size Estimator – Tools
description: >
  Pick the DiceBear styles you plan to use and see how many minified, gzipped
  kilobytes they'll add to your JavaScript bundle.
aside: false
editLink: false
---

<script setup lang="ts">
import SitePageHead from "@theme/components/site/SitePageHead.vue";
import BundleSizeTool from "@theme/components/tools/BundleSizeTool.vue";

const crumbs = [
  { text: 'Home', link: '/' },
  { text: 'Tools', link: '/tools/' },
  { text: 'Bundle size' },
];
</script>

<SitePageHead :crumbs="crumbs" title="Bundle size estimator">

Pick the styles you plan to use and see how many minified, gzipped kilobytes
they add to your JavaScript bundle.

</SitePageHead>

<BundleSizeTool />
