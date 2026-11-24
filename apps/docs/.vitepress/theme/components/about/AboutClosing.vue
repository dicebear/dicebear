<script setup lang="ts">
/**
 * The last block of the page: a stack of avatars, one line and the two
 * ways on from here, on yellow.
 */
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import { styleDisplayName } from '@theme/utils/styleMeta';
import SiteAvatar from '../site/SiteAvatar.vue';
import SiteClosing from '../site/SiteClosing.vue';

const STYLES = [
  'shapes',
  'lorelei',
  'rings',
  'thumbs',
  'glass',
  'notionists',
  'identicon',
  'cats',
  'loops',
];

const avatars = STYLES.map((name, index) => {
  const seeds = getStyleCardSeeds(name);

  return {
    name,
    options: { seed: seeds[index % seeds.length] },
    alt: `${styleDisplayName(name)} avatar`,
  };
});
</script>

<template>
  <SiteClosing
    tone="sun"
    title="Build your first avatar"
    lead="Pick a style and a seed, then copy the code."
  >
    <template #avatars>
      <SiteAvatar
        v-for="avatar in avatars"
        :key="avatar.name"
        sticker
        :style-name="avatar.name"
        :options="avatar.options"
        :alt="avatar.alt"
      />
    </template>
    <a href="/playground/" class="site-btn site-btn-lg site-btn-primary">
      Open the Playground
    </a>
    <a href="/start/" class="site-btn site-btn-lg site-btn-secondary">
      Read the docs
    </a>
  </SiteClosing>
</template>
