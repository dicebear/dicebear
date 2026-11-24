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
        class="site-animated-strip-item"
      >
        <SiteAvatar
          sticker
          :style-name="style.styleName"
          :options="{ seed: style.seed, animation: true }"
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
  /* 21 styles: three rows of seven, or seven of three. */
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: clamp(28px, 3vw, 44px) clamp(16px, 2.4vw, 32px);
  margin-top: clamp(48px, 6vw, 88px);

  @media (min-width: 480px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(7, minmax(0, 1fr));
  }

  &-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    min-width: 0;
    color: var(--db-ink);
    text-align: center;

    > :first-child {
      width: 100%;
      transition: transform 0.25s var(--ease-spring);
    }

    &:nth-child(odd) > :first-child {
      transform: rotate(-3deg);
    }

    &:nth-child(even) > :first-child {
      transform: rotate(2deg);
    }

    &:hover > :first-child {
      transform: translateY(-4px) rotate(0);
    }
  }

  &-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &-name {
    font-family: var(--db-font-display);
    font-size: 19px;
    line-height: 26px;
    font-weight: 700;
  }
}
</style>
