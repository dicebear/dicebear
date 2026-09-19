<script setup lang="ts">
/**
 * Every style that animates, as a grid under the head: the avatar playing,
 * the name and the names of its moves. The names come from the definitions,
 * so a style that learns a new move shows it here without a text change.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { capitalCase, kebabCase } from 'change-case';
import type { ThemeOptions } from '@theme/types';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import SiteAvatar from './SiteAvatar.vue';

const { theme } = useData<ThemeOptions>();

const styles = computed(() =>
  Object.entries(theme.value.avatarStyles)
    .filter(([, style]) => style.animated)
    .map(([styleName, style]) => ({
      styleName,
      slug: kebabCase(styleName),
      title: capitalCase(styleName),
      seed: getStyleCardSeeds(kebabCase(styleName))[0] ?? 'Felix',
      moves: (style.animations ?? []).join(' · '),
    }))
    .sort((a, b) => a.title.localeCompare(b.title)),
);
</script>

<template>
  <div class="site-container">
    <div class="site-animated-strip">
      <a
        v-for="style in styles"
        :key="style.slug"
        :href="`/styles/${style.slug}/`"
        class="site-animated-strip-item hv-row"
      >
        <SiteAvatar
          :style-name="style.styleName"
          :options="{ seed: style.seed, animation: true }"
          :size="170"
          :radius="28"
          :alt="`Animated ${style.title} avatar`"
        />
        <span class="site-animated-strip-text">
          <span class="site-animated-strip-name">{{ style.title }}</span>
          <span class="site-mono">{{ style.moves }}</span>
        </span>
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-animated-strip {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  gap: 40px 24px;
  margin-top: 72px;

  &-item {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;

    :deep(.site-avatar) {
      width: 100% !important;
      height: auto !important;
      aspect-ratio: 1;
    }
  }

  &-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }

  &-name {
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
  }

  @media (max-width: 1279px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }

  @media (max-width: 959px) {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  @media (max-width: 767px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 32px 12px;
    margin-top: 48px;

    :deep(.site-avatar) {
      border-radius: 20px !important;
    }
  }
}
</style>
