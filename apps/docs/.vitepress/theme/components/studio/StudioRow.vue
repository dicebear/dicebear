<script setup lang="ts">
/**
 * One function of the plugin: heading, text and links on the left, the
 * screenshot on the right. The `text` and `shot` slots replace either side.
 * Below 960px the text sits above the screenshot.
 */
import { ArrowRight } from '@lucide/vue';
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
  <div class="studio-row">
    <slot name="text">
      <div class="studio-row-text">
        <h3 class="site-h2">{{ title }}</h3>
        <p class="site-body">{{ text }}</p>
        <div v-if="links?.length" class="studio-row-links">
          <a
            v-for="link in links"
            :key="link.href"
            class="studio-row-link site-control hv-link"
            :href="link.href"
          >
            {{ link.text }}
            <ArrowRight :size="18" aria-hidden="true" />
          </a>
        </div>
      </div>
    </slot>
    <slot name="shot">
      <StudioShot v-if="shot" :images="[shot]" />
    </slot>
  </div>
</template>

<style scoped lang="scss">
.studio-row {
  display: grid;
  grid-template-columns: 400px minmax(0, 1fr);
  gap: 80px;
  align-items: start;
  padding: 72px 0;

  &-text {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-top: 8px;
  }

  &-links {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
    padding-top: 8px;
  }

  &-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--db-brand-text);
    text-decoration: none;

    svg {
      flex-shrink: 0;
    }
  }

  @media (max-width: 1199px) {
    grid-template-columns: 320px minmax(0, 1fr);
    gap: 48px;
  }

  @media (max-width: 959px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 32px;
    padding: 48px 0;

    &-text {
      padding-top: 0;
    }
  }
}
</style>
