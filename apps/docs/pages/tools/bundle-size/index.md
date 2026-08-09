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
import BundleSizeTool from "@theme/components/tools/BundleSizeTool.vue";
</script>

<ClientOnly>
  <BundleSizeTool />
</ClientOnly>
