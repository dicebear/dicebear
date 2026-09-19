<script setup lang="ts">
/**
 * A screenshot of the plugin window on a soft panel. The title bar is drawn
 * here, the image below it is the plugin UI. Every image is in the markup in
 * light and dark, CSS shows the one for the theme. With several images the
 * window shows `current` and keeps the others hidden.
 */
import { computed } from 'vue';
import { withBase } from 'vitepress';
import { X } from '@lucide/vue';
import type { StudioShotImage, StudioShotName, StudioTheme } from './types';

const props = defineProps<{
  images: StudioShotImage[];
  current?: StudioShotName;
  /** Theme whose images load right away. The others wait until they show. */
  eager?: StudioTheme;
  /** Largest width of the window in pixels. It fills the panel without one. */
  width?: number;
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
  <figure class="studio-shot">
    <div
      class="studio-shot-window"
      :style="width ? { maxWidth: `${width}px` } : undefined"
    >
      <div class="studio-shot-bar" aria-hidden="true">
        <span>DiceBear Studio</span>
        <X :size="14" />
      </div>
      <div
        v-for="image in images"
        v-show="image.name === active"
        :key="image.name"
        class="studio-shot-frame"
      >
        <img
          v-for="theme in THEMES"
          :key="theme.name"
          :class="theme.className"
          :src="source(image, theme.suffix)"
          :alt="image.alt"
          width="1560"
          height="1120"
          :loading="eager === theme.name ? 'eager' : 'lazy'"
          decoding="async"
        />
      </div>
    </div>
  </figure>
</template>

<style scoped lang="scss">
/* The window wears Figma's own surface colors so the bar joins the image. */
.studio-shot {
  --studio-window: #ffffff;
  --studio-window-line: #e6e6e6;
  --studio-window-ink: #1e1e1e;
  --studio-window-shadow: rgb(11 22 32 / 0.3);

  min-width: 0;
  margin: 0;
  padding: 40px;
  border-radius: var(--db-radius-6);
  background: var(--db-soft);

  &-window {
    margin: 0 auto;
    overflow: hidden;
    border-radius: var(--db-radius-3);
    background: var(--studio-window);
    box-shadow:
      0 0 0 1px var(--studio-window-line),
      0 24px 48px -20px var(--studio-window-shadow);
  }

  &-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    padding: 0 14px 0 16px;
    border-bottom: 1px solid var(--studio-window-line);
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    color: var(--studio-window-ink);

    svg {
      opacity: 0.6;
    }
  }

  &-frame img {
    display: block;
    width: 100%;
    height: auto;
    aspect-ratio: 1560 / 1120;
  }

  @media (max-width: 959px) {
    padding: 16px;
    border-radius: var(--db-radius-4);
  }
}

.dark .studio-shot {
  --studio-window: #2c2c2c;
  --studio-window-line: #444444;
  --studio-window-ink: #ffffff;
  --studio-window-shadow: rgb(11 22 32 / 0.6);
}
</style>
