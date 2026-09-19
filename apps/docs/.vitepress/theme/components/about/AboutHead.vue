<script setup lang="ts">
/**
 * The page head with one still picture: a single seed drawn in seven styles,
 * fanned out like a hand of cards.
 */
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { getAvatarApiUrl } from '@theme/utils/avatar/api';
import { styleDisplayName } from '@theme/utils/styleMeta';
import SitePageHead from '../site/SitePageHead.vue';

const SEED = 'Iris';
const STEP_DEG = 7;
const STYLES = [
  'shapes',
  'lorelei',
  'glass',
  'notionists',
  'rings',
  'thumbs',
  'identicon',
];

const { theme } = useData<ThemeOptions>();

const crumbs = [{ text: 'Home', link: '/' }, { text: 'Why DiceBear' }];

// The middle card lies on top and the stack falls off to both sides.
const middle = (STYLES.length - 1) / 2;
const fan = STYLES.map((name, index) => ({
  name,
  src: getAvatarApiUrl(name, { seed: SEED }),
  alt: `${styleDisplayName(name)} avatar for the seed ${SEED}`,
  style: {
    transform: `rotate(${(index - middle) * STEP_DEG}deg)`,
    zIndex: 10 - Math.abs(index - middle),
  },
}));
</script>

<template>
  <SitePageHead
    class="about-head"
    :crumbs="crumbs"
    title="Why DiceBear?"
    :aside-width="560"
    aside-align="center"
  >
    <p class="about-head-lead">
      DiceBear is an open source avatar library. It draws avatars from a seed,
      in {{ theme.styleCount }} styles, from your own code or through a free
      HTTP API.
    </p>
    <template #aside>
      <div class="about-head-fan">
        <span
          v-for="card in fan"
          :key="card.name"
          class="site-tile about-head-card"
          :style="card.style"
        >
          <img :src="card.src" :alt="card.alt" width="100" height="100" />
        </span>
      </div>
      <p class="site-text about-head-caption">
        One seed, seven of the {{ theme.styleCount }} styles.
      </p>
    </template>
  </SitePageHead>
</template>

<style scoped lang="scss">
.about-head {
  // Edge length of one card. The fan is about 5.5 cards wide, so 100px is
  // the largest card that stays inside the 560px aside.
  --about-card: 100px;

  &-lead {
    max-width: 620px;
  }

  &-fan {
    position: relative;
    height: calc(var(--about-card) * 2.08);
  }

  &-card {
    position: absolute;
    top: calc(var(--about-card) * 0.2);
    left: calc(50% - var(--about-card) / 2);
    width: var(--about-card);
    height: var(--about-card);
    border-radius: calc(var(--about-card) * 0.267);
    box-shadow:
      0 0 0 4px var(--db-paper),
      0 20px 40px -20px rgb(11 22 32 / 35%);
    transform-origin: 50% calc(var(--about-card) * 6.33);
  }

  &-caption {
    margin-top: 8px;
    text-align: center;
    color: var(--db-muted);
  }

  @media (min-width: 960px) and (max-width: 1279px) {
    --about-card: 70px;

    :deep(.site-page-head-grid) {
      --site-page-head-aside: 400px !important;
    }
  }

  @media (max-width: 639px) {
    --about-card: 56px;
  }
}
</style>
