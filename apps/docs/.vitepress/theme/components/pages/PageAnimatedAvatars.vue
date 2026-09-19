<script setup lang="ts">
import { capitalCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import {
  SiteAnimatedHead,
  SiteAnimatedMotion,
  SiteAnimatedMoves,
  SiteAnimatedStrip,
  SiteAnimatedWeight,
  SiteAvatar,
  SiteClosing,
} from '../site';

/** Nine animated styles above the closing line, each on another of its card seeds. */
const closing = [
  'shapes',
  'critters',
  'glass',
  'clay',
  'loops',
  'gaze',
  'squircles',
  'cats',
  'waves',
].map((styleName, index) => ({
  styleName,
  seed: getStyleCardSeeds(styleName)[index % 4] ?? 'Felix',
  alt: `Animated ${capitalCase(styleName)} avatar`,
}));
</script>

<template>
  <SiteAnimatedHead />
  <SiteAnimatedStrip />
  <SiteAnimatedMoves />
  <SiteAnimatedMotion />
  <SiteAnimatedWeight />
  <SiteClosing title="Try it on your own seed">
    <template #avatars>
      <SiteAvatar
        v-for="item in closing"
        :key="item.styleName"
        :style-name="item.styleName"
        :options="{ seed: item.seed, animation: true }"
        :size="72"
        :radius="20"
        :alt="item.alt"
      />
    </template>
    <a href="/playground/" class="site-btn site-btn-lg site-btn-primary">
      Open the Playground
      <ArrowRight :size="20" />
    </a>
    <a
      href="/integrations/http-api/"
      class="site-btn site-btn-lg site-btn-secondary"
    >
      API documentation
    </a>
  </SiteClosing>
</template>
