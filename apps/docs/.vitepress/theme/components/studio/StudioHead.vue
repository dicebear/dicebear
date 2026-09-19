<script setup lang="ts">
/**
 * The head of the Studio page: breadcrumb, title, the lead with the two
 * actions next to it, the style gallery of the plugin and the tab index.
 */
import { withBase } from 'vitepress';
import { ChevronRight } from '@lucide/vue';
import StudioActions from './StudioActions.vue';
import StudioShot from './StudioShot.vue';
import StudioTabIndex from './StudioTabIndex.vue';
import type { StudioShotImage } from './types';

const head = {
  title: 'DiceBear Studio',
  lead: 'DiceBear inside Figma. It puts real avatars into your mockups, tells developers how to render the same ones, and turns your own drawings into an avatar style.',
};

const crumbs: { text: string; link?: string }[] = [
  { text: 'Home', link: withBase('/') },
  { text: head.title },
];

const gallery: StudioShotImage[] = [
  {
    name: 'gallery',
    alt: 'The Generate tab of DiceBear Studio with the style gallery: every style of the DiceBear collection with a preview',
  },
];
</script>

<template>
  <section class="site-container studio-head">
    <nav class="studio-head-crumbs" aria-label="Breadcrumb">
      <template v-for="(crumb, index) in crumbs" :key="crumb.text">
        <ChevronRight v-if="index > 0" :size="14" aria-hidden="true" />
        <a v-if="crumb.link" :href="crumb.link">{{ crumb.text }}</a>
        <span v-else aria-current="page">{{ crumb.text }}</span>
      </template>
    </nav>
    <h1 class="site-display studio-head-title">{{ head.title }}</h1>
    <div class="studio-head-intro">
      <p class="site-lead">{{ head.lead }}</p>
      <StudioActions />
    </div>
    <div class="studio-head-block">
      <StudioShot :images="gallery" :width="880" eager="light" />
    </div>
    <div class="studio-head-block">
      <StudioTabIndex />
    </div>
  </section>
</template>

<style scoped lang="scss">
.studio-head {
  padding-top: 72px;

  &-crumbs {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-ink-2);

    a {
      color: var(--db-muted);
      text-decoration: none;

      &:hover {
        color: var(--db-ink);
      }
    }

    svg {
      color: var(--db-chevron);
    }
  }

  &-title {
    margin-top: 28px;
  }

  &-intro {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px 64px;
    margin-top: 32px;

    .site-lead {
      max-width: 720px;
    }

    > div {
      flex-shrink: 0;
    }
  }

  &-block {
    margin-top: 72px;
  }

  @media (max-width: 1099px) {
    &-intro {
      flex-direction: column;
      align-items: flex-start;
    }
  }

  @media (max-width: 767px) {
    padding-top: 48px;

    &-block {
      margin-top: 48px;
    }
  }
}
</style>
