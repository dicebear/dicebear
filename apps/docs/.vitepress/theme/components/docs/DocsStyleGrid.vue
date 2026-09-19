<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { exampleSeeds } from '@theme/config/styleCategories';
import SiteAvatar from '../site/SiteAvatar.vue';
import { ArrowRight } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    styles: Array<{
      name: string;
      styleName: string;
      link: string;
      bestFor: string;
    }>;
    seeds?: string[];
    avatarSize?: number;
    allStylesLink?: string;
    allStylesLabel?: string;
  }>(),
  {
    seeds: () => [...exampleSeeds],
    avatarSize: 48,
    allStylesLink: '/styles/',
    allStylesLabel: undefined,
  },
);

const { theme } = useData<ThemeOptions>();

// Prop defaults are evaluated outside the setup scope, so the fallback label
// lives here where it can read the style count.
const resolvedAllStylesLabel = computed(
  () =>
    props.allStylesLabel ??
    `Browse all ${theme.value.styleCount} avatar styles`,
);
</script>

<template>
  <div class="docs-style-grid">
    <a
      v-for="style in styles"
      :key="style.styleName"
      :href="style.link"
      class="docs-style-grid-row hv-row"
    >
      <span class="docs-style-grid-avatars">
        <SiteAvatar
          v-for="seed in seeds"
          :key="seed"
          :size="avatarSize"
          :radius="12"
          :style-name="style.styleName"
          :options="{ seed }"
          :alt="`${style.name} avatar`"
        />
      </span>
      <span class="docs-style-grid-info">
        <span class="docs-style-grid-name">{{ style.name }}</span>
        <span class="docs-style-grid-desc">{{ style.bestFor }}</span>
      </span>
      <span class="docs-style-grid-chev hv-chev">
        <ArrowRight :size="18" />
      </span>
    </a>
  </div>

  <a :href="allStylesLink" class="docs-style-grid-all hv-link">
    {{ resolvedAllStylesLabel }}
    <ArrowRight :size="16" />
  </a>
</template>

<style lang="scss" scoped>
.docs-style-grid {
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--db-line);
  /* The rows inherit their color, so the hover color of a row wins. */
  color: var(--db-ink);

  &-row {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) 20px;
    align-items: center;
    gap: 24px;
    padding: 14px 0;
    border-top: 1px solid var(--db-line);
    text-decoration: none;
  }

  &-avatars {
    display: flex;
    gap: 8px;
  }

  &-info {
    display: flex;
    flex-direction: column;
  }

  &-name {
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
  }

  &-desc {
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }

  &-chev {
    display: flex;
    color: var(--db-muted);
  }

  &-all {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    color: var(--db-brand-text);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
  }

  @media (max-width: 767px) {
    &-row {
      grid-template-columns: minmax(0, 1fr);
      gap: 10px;
    }

    &-chev {
      display: none;
    }
  }
}
</style>
