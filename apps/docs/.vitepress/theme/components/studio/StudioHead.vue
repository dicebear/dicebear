<script setup lang="ts">
/**
 * The head of the Studio page: breadcrumb, title, the lead with the two
 * actions next to it, and the style gallery of the plugin standing in a
 * lilac block.
 */
import { withBase } from 'vitepress';
import SitePageHead from '../site/SitePageHead.vue';
import StudioActions from './StudioActions.vue';
import StudioShot from './StudioShot.vue';
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

  <div class="site-box is-block is-lilac studio-head-shot">
    <StudioShot :images="gallery" eager="light" tilted />
  </div>
</template>

<style scoped lang="scss">
/* The screenshot stands on the bottom edge of the block. */
.studio-head-shot {
  margin-top: clamp(40px, 4.4vw, 64px);
  padding-top: clamp(32px, 5vw, 72px);
  padding-bottom: 0;
  overflow: hidden;

  > .studio-shot {
    max-width: 1040px;
    margin: 0 auto;
  }
}
</style>
