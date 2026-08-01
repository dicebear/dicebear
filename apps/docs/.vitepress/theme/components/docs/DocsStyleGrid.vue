<script setup lang="ts">
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { exampleSeeds } from '@theme/config/styleCategories';
import { UiAvatar } from '../ui';
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
      class="docs-style-grid-card"
    >
      <div class="docs-style-grid-avatars">
        <UiAvatar
          v-for="seed in seeds"
          :key="seed"
          :size="avatarSize"
          :style-name="style.styleName"
          :style-options="{ seed, size: avatarSize, borderRadius: 50 }"
          :alt="style.name"
        />
      </div>
      <div class="docs-style-grid-info">
        <span class="docs-style-grid-name">
          {{ style.name }}
          <ArrowRight :size="14" class="docs-style-grid-arrow" />
        </span>
        <span class="docs-style-grid-desc">{{ style.bestFor }}</span>
      </div>
    </a>
  </div>

  <a :href="allStylesLink" class="docs-style-grid-all">
    <span>{{ resolvedAllStylesLabel }}</span>
    <ArrowRight :size="16" />
  </a>
</template>

<style lang="scss" scoped>
.docs-style-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 12px;
  margin: 24px 0;

  &-card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 16px;
    border: 1px solid var(--vp-c-divider);
    border-radius: var(--vp-radius-sm);
    text-decoration: none;
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease;

    &:hover {
      border-color: var(--vp-c-brand-1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);

      .docs-style-grid-arrow {
        transform: translateX(3px);
      }
    }

    &::after {
      display: none !important;
    }
  }

  &-avatars {
    display: flex;
    gap: 8px;
  }

  &-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--vp-c-text-1);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &-arrow {
    color: var(--vp-c-brand-1);
    transition: transform var(--duration-fast) ease;
  }

  &-desc {
    font-size: 13px;
    color: var(--vp-c-text-2);
    line-height: 1.5;
  }

  &-all {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
    font-size: 14px;
    font-weight: 500;
    color: var(--vp-c-brand-1);
    text-decoration: none;
    transition: gap var(--duration-fast) ease;

    &:hover {
      gap: 10px;
    }

    &::after {
      display: none !important;
    }
  }
}
</style>
