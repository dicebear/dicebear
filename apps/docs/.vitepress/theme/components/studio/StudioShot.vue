<script setup lang="ts">
/**
 * A screenshot of the plugin window, rounded and lifted off its ground.
 * Every image is in the markup in light and dark, CSS shows the one for the
 * theme. With several images it shows `current` and keeps the others
 * hidden. `tilted` stands it on the bottom edge of its block, turned a
 * little, as in the head of the page.
 */
import { computed } from 'vue';
import { withBase } from 'vitepress';
import type { StudioShotImage, StudioShotName, StudioTheme } from './types';

const props = defineProps<{
  images: StudioShotImage[];
  current?: StudioShotName;
  /** Theme whose images load right away. The others wait until they show. */
  eager?: StudioTheme;
  tilted?: boolean;
}>();

const THEMES: { name: StudioTheme; suffix: string; className: string }[] = [
  { name: 'light', suffix: '', className: 'only-light' },
  { name: 'dark', suffix: '-dark', className: 'only-dark' },
];

const active = computed(() => props.current ?? props.images[0]?.name);

function source(image: StudioShotImage, suffix: string): string {
  return withBase(`/studio/studio-${image.name}${suffix}.webp`);
}
</script>

<template>
  <figure class="studio-shot" :class="{ 'is-tilted': tilted }">
    <template v-for="image in images" :key="image.name">
      <img
        v-for="theme in THEMES"
        v-show="image.name === active"
        :key="theme.name"
        :class="theme.className"
        :src="source(image, theme.suffix)"
        :alt="image.alt"
        width="1560"
        height="1120"
        :loading="eager === theme.name ? 'eager' : 'lazy'"
        decoding="async"
      />
    </template>
  </figure>
</template>

<style scoped lang="scss">
.studio-shot {
  margin: 0;

  img {
    width: 100%;
    height: auto;
    aspect-ratio: 1560 / 1120;
    border-radius: var(--db-radius-5);
    box-shadow: var(--db-shadow);
  }

  &.is-tilted img {
    border-radius: var(--db-radius-5) var(--db-radius-5) 0 0;
    transform: rotate(-1.5deg) translateY(3%);
    transform-origin: 50% 100%;
  }
}
</style>
