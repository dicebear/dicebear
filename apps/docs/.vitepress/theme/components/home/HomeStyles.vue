<script setup lang="ts">
/**
 * The styles, as a lilac band across the whole page with two belts of
 * stickers, the most used styles first. The belts are centered and run off
 * both edges at any width. Every sticker leads to its style page.
 */
import { computed } from 'vue';
import { useData, withBase } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import { getStyleCardSeeds } from '@theme/config/previewRowSeeds';
import { styleDisplayName } from '@theme/utils/styleMeta';
import { LINKS } from '@theme/config/home';
import SiteAvatar from '../site/SiteAvatar.vue';

const { theme } = useData<ThemeOptions>();

// The most used styles, split into two belts. Each holds enough stickers to
// run off both edges of a wide screen.
const BELTS = [
  [
    'avataaars',
    'initials',
    'notionists',
    'adventurer',
    'bottts',
    'lorelei',
    'personas',
    'micah',
    'pixel-art',
    'thumbs',
    'big-smile',
    'shapes',
    'identicon',
    'open-peeps',
    'miniavs',
    'croodles',
  ],
  [
    'big-ears',
    'fun-emoji',
    'glass',
    'bottts-neutral',
    'dylan',
    'big-ears-neutral',
    'adventurer-neutral',
    'croodles-neutral',
    'icons',
    'notionists-neutral',
    'avataaars-neutral',
    'waves',
    'rings',
    'blobs',
    'cats',
    'critters',
  ],
];

const belts = computed(() =>
  BELTS.map((belt) =>
    belt
      .filter((name) => theme.value.avatarStyles[name] !== undefined)
      .map((name) => ({
        name,
        title: styleDisplayName(name),
        seed: getStyleCardSeeds(name)[0] ?? 'Felix',
      })),
  ),
);
</script>

<template>
  <section class="site-box is-lilac home-styles">
    <div class="site-container home-styles-head">
      <h2 class="site-headline">{{ theme.styleCount }} styles in the box</h2>
      <p class="site-lead home-styles-lead">
        People, animals, robots, scenes and abstract marks, by independent
        artists and by us. Switching is one word in your code, and
        {{ theme.animatedStyleCount }} of them can move.
      </p>
    </div>

    <ul v-for="(belt, row) in belts" :key="row" class="home-belt">
      <li v-for="item in belt" :key="item.name">
        <a
          :href="withBase(`/styles/${item.name}/`)"
          :aria-label="`${item.title} style`"
          class="home-belt-link"
        >
          <SiteAvatar
            sticker
            :style-name="item.name"
            :options="{ seed: item.seed }"
          />
        </a>
      </li>
    </ul>

    <div class="site-container site-actions home-styles-actions">
      <a
        :href="withBase(LINKS.styles)"
        class="site-btn site-btn-primary site-btn-lg"
      >
        All {{ theme.styleCount }} styles
        <ArrowRight :size="18" aria-hidden="true" />
      </a>
      <a
        :href="withBase(LINKS.animated)"
        class="site-btn site-btn-secondary site-btn-lg"
      >
        Animated avatars
        <ArrowRight :size="18" aria-hidden="true" />
      </a>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-styles {
  padding: clamp(64px, 7.2vw, 104px) 0;
  overflow: hidden;

  &-head {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
    text-align: center;
  }

  &-lead {
    max-width: 640px;
    margin-top: 4px;
  }

  &-actions {
    justify-content: center;
    margin-top: clamp(24px, 3vw, 40px);
  }
}

/* A belt of stickers, centered so it runs off both edges, turned left and
   right in turn. The second one sits half a sticker over. */
.home-belt {
  --belt: clamp(104px, 12vw, 176px);
  --belt-gap: clamp(16px, 2vw, 32px);

  display: flex;
  justify-content: center;
  gap: var(--belt-gap);
  padding: 20px 0 16px;

  &:first-of-type {
    margin-top: clamp(24px, 2.8vw, 40px);
  }

  & + & {
    transform: translateX(calc((var(--belt) + var(--belt-gap)) / 2));
  }

  > li {
    flex: 0 0 var(--belt);
  }

  > li:nth-child(odd) {
    transform: rotate(-3deg);
  }

  > li:nth-child(even) {
    transform: rotate(2deg) translateY(6px);
  }

  &-link {
    display: block;
    border-radius: 28%;
    transition: transform 0.25s var(--ease-spring);

    &:hover {
      transform: translateY(-6px) rotate(-2deg);
    }
  }
}
</style>
