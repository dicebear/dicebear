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
import { SitePageHead, SiteStylesTable } from '@theme/components/site';

const { theme } = useData();
const title = theme.value.styleCount + ' styles';
const crumbs = [{ text: 'Home', link: '/' }, { text: 'Styles' }];
</script>

<SitePageHead :crumbs="crumbs" :title="title">

Characters, animals, robots, scenes and abstract marks. Every style is one word
in your code, and every one has its own page with presets, options and the
license it comes with.

</SitePageHead>

<SiteStylesTable />
