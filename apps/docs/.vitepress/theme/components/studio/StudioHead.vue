<script setup lang="ts">
/**
 * The head of the Studio page: breadcrumb, title, the lead with the two
 * actions next to it, the style gallery of the plugin and the tab index.
 */
import { withBase } from 'vitepress';
import SitePageHead from '../site/SitePageHead.vue';
import StudioActions from './StudioActions.vue';
import StudioShot from './StudioShot.vue';
import StudioTabIndex from './StudioTabIndex.vue';
import type { StudioShotImage } from './types';

const head = {
  title: 'DiceBear Studio',
  lead: 'DiceBear inside Figma. It puts real avatars into your mockups, tells developers how to render the same ones, and turns your own drawings into an avatar style.',
};

const crumbs = [{ text: 'Home', link: withBase('/') }, { text: head.title }];

const gallery: StudioShotImage[] = [
  {
    name: 'gallery',
    alt: 'The Generate tab of DiceBear Studio with the style gallery: every style of the DiceBear collection with a preview',
  },
];
</script>

<template>
  <SitePageHead :crumbs="crumbs" :title="head.title">
    <p>{{ head.lead }}</p>
    <template #actions>
      <StudioActions />
    </template>
  </SitePageHead>

  <div class="site-container site-rise" style="animation-delay: 320ms">
    <div class="studio-head-block">
      <StudioShot :images="gallery" :width="880" eager="light" />
    </div>
    <div class="studio-head-block">
      <StudioTabIndex />
    </div>
  </div>
</template>

<style scoped lang="scss">
.studio-head-block {
  margin-top: 72px;

  @media (max-width: 767px) {
    margin-top: 48px;
  }
}
</style>
