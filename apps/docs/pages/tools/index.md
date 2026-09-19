---
layout: page
title: Tools – Utilities for working with DiceBear avatars
description: >
  Interactive utilities that help you understand how DiceBear handles colors,
  contrast, and avatar generation, built with the same algorithms used by the
  library itself.
aside: false
sidebar: false
---

<script setup lang="ts">
import SitePageHead from "@theme/components/site/SitePageHead.vue";
import ToolList from "@theme/components/tools/ToolList.vue";

const crumbs = [{ text: 'Home', link: '/' }, { text: 'Tools' }];
</script>

<SitePageHead :crumbs="crumbs" title="Tools">

Small, focused utilities for working with DiceBear avatars. The contrast picker
and the bundle estimator run on the same code as `@dicebear/core`, so what you
see there matches what your avatars do.

</SitePageHead>

<ToolList />
