<script setup lang="ts">
/**
 * One function of the plugin in a split: title, text and links on the left,
 * its screenshot on the right. The slots take a richer text or picture.
 */
import StudioShot from './StudioShot.vue';
import type { StudioLink, StudioShotImage } from './types';

defineProps<{
  title?: string;
  text?: string;
  shot?: StudioShotImage;
  links?: StudioLink[];
}>();
</script>

<template>
  <div class="site-split is-wide studio-row">
    <div class="studio-row-text">
      <slot name="text">
        <h3 class="site-heading">{{ title }}</h3>
        <p class="site-body">{{ text }}</p>
        <div v-if="links?.length" class="studio-row-links">
          <a
            v-for="link in links"
            :key="link.href"
            class="site-link-arrow"
            :href="link.href"
            >{{ link.text }}</a
          >
        </div>
      </slot>
    </div>
    <div>
      <slot name="shot">
        <StudioShot v-if="shot" :images="[shot]" />
      </slot>
    </div>
  </div>
</template>

<style scoped lang="scss">
.studio-row-text {
  display: flex;
  flex-direction: column;
  gap: 14px;

  .site-body {
    color: var(--db-ink-2);
  }
}

.studio-row-links {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
</style>
