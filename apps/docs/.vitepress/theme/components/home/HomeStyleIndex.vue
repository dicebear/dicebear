<script setup lang="ts">
/**
 * The catalog as a run of names: some well-known styles at display size,
 * each with a small avatar, and a last link that counts the rest.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import { styleDisplayName, stylePageUrl } from '@theme/utils/styleMeta';
import SiteAvatar from '../site/SiteAvatar.vue';

const { theme } = useData<ThemeOptions>();

const NAMES = [
  'adventurer',
  'bottts',
  'croodles',
  'avataaars',
  'big-ears',
  'initials',
  'micah',
  'lorelei',
  'thumbs',
  'notionists',
  'personas',
  'big-smile',
  'open-peeps',
  'miniavs',
  'identicon',
  'fun-emoji',
  'dylan',
  'icons',
  'pixel-art',
  'shapes',
  'rings',
  'glyphs',
];

const styles = computed(() =>
  NAMES.filter((name) => name in theme.value.avatarStyles).map((name) => ({
    name,
    title: styleDisplayName(name),
    href: withBase(stylePageUrl(name)),
    options: { seed: getStyleCardSeeds(name)[0] },
  })),
);

const title = computed(() => `${theme.value.styleCount} styles to start with`);
const rest = computed(() => theme.value.styleCount - styles.value.length);
const allStylesUrl = withBase('/styles/');
</script>

<template>
  <section class="home-wrap home-style-index">
    <h2 class="site-headline">{{ title }}</h2>
    <ul class="home-style-index-list">
      <li v-for="style in styles" :key="style.name">
        <a :href="style.href" class="home-style-index-item">
          <SiteAvatar
            :style-name="style.name"
            :options="style.options"
            :size="56"
            :radius="16"
            :alt="`${style.title} avatar`"
          />
          {{ style.title }}
        </a>
      </li>
      <li>
        <a :href="allStylesUrl" class="home-style-index-more hv-link">
          and {{ rest }} more
        </a>
      </li>
    </ul>
  </section>
</template>

<style scoped lang="scss">
.home-style-index {
  padding-top: 168px;

  &-list {
    margin: 64px 0 0;
    padding: 0;
    list-style: none;
    font-size: 48px;
    line-height: 80px;
    font-weight: 600;
    letter-spacing: -0.035em;
    color: var(--db-ink);

    li {
      display: inline;
    }
  }

  // Names and the closing link share a height and hang on the same middle
  // axis, so the run reads as one line however the names wrap.
  &-item,
  &-more {
    display: inline-flex;
    align-items: center;
    height: 56px;
    vertical-align: middle;
    text-decoration: none;
    white-space: nowrap;
  }

  &-item {
    gap: 16px;
    margin-right: 40px;
    color: inherit;
    transition: color 0.12s;

    &:hover {
      color: var(--db-brand-text);
    }
  }

  &-more {
    color: var(--db-brand-text);
  }

  @media (max-width: 1023px) {
    &-list {
      font-size: 36px;
      line-height: 64px;
    }

    &-item,
    &-more {
      height: 44px;
    }

    &-item {
      gap: 12px;
      margin-right: 28px;

      :deep(.site-avatar) {
        width: 44px !important;
        height: 44px !important;
        border-radius: 12px !important;
      }
    }
  }

  @media (max-width: 767px) {
    padding-top: 96px;

    &-list {
      margin-top: 40px;
      font-size: 24px;
      line-height: 48px;
    }

    &-item,
    &-more {
      height: 32px;
    }

    &-item {
      gap: 10px;
      margin-right: 20px;

      :deep(.site-avatar) {
        width: 32px !important;
        height: 32px !important;
        border-radius: 10px !important;
      }
    }
  }
}
</style>
