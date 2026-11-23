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
import { useData } from 'vitepress';
import {
  SiteAvatar,
  SitePageHead,
  SiteStylesTable,
} from '@theme/components/site';

const { theme } = useData();
const title = theme.value.styleCount + ' styles';
const crumbs = [{ text: 'Home', link: '/' }, { text: 'Styles' }];
</script>

<SitePageHead :crumbs="crumbs" :title="title" aside-align="end" :aside-width="380">

Characters, animals, robots, scenes and abstract marks, many of them by
[independent artists](/artists/). Every style is one word in your code, and
every one has its own page with presets, options and the license it comes with.

<template #aside>
  <div class="site-fan" aria-hidden="true">
    <SiteAvatar sticker style-name="lorelei" :options="{ seed: 'Ingrid' }" />
    <SiteAvatar sticker style-name="avataaars" :options="{ seed: 'Carmen' }" />
    <SiteAvatar sticker style-name="bottts" :options="{ seed: 'Ivan' }" />
  </div>
</template>

</SitePageHead>

<SiteStylesTable />
