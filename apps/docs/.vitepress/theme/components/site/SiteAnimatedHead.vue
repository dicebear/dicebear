<script setup lang="ts">
/**
 * The head of the animated avatars page: the count of styles that animate,
 * one sentence and the two ways in. The grid of every animated style follows
 * right below it.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import { ArrowRight } from '@lucide/vue';
import type { ThemeOptions } from '@theme/types';
import SitePageHead from './SitePageHead.vue';

const { theme } = useData<ThemeOptions>();

const count = computed(
  () =>
    Object.values(theme.value.avatarStyles).filter((style) => style.animated)
      .length,
);

/** The word that does what it says, one span per letter so the wobble runs through it. */
const letters = ['m', 'o', 'v', 'e'];
</script>

<template>
  <SitePageHead
    :crumbs="[{ text: 'Home', link: '/' }, { text: 'Animated avatars' }]"
    :title="`${count} styles that move`"
  >
    <template #title>
      {{ count }} styles that
      <span class="site-animated-head-move" aria-label="move">
        <span
          v-for="(letter, index) in letters"
          :key="index"
          class="site-animated-head-letter"
          :style="{ animationDelay: `${1.2 + index * 0.12}s` }"
          aria-hidden="true"
          >{{ letter }}</span
        >
      </span>
    </template>
    {{ count }} styles carry a looping CSS animation inside the SVG. One option
    switches it on, and a plain img tag plays it.
    <template #actions>
      <a href="/playground/" class="site-btn site-btn-lg site-btn-primary">
        Playground
        <ArrowRight :size="20" />
      </a>
      <a
        href="/customize/options/"
        class="site-btn site-btn-lg site-btn-secondary"
      >
        Documentation
      </a>
    </template>
  </SitePageHead>
</template>

<style scoped lang="scss">
/* The word does what it says: each letter squashes and stretches in turn,
   so a wobble runs through the word once the headline has settled. */
.site-animated-head-move {
  display: inline-block;
}

.site-animated-head-letter {
  display: inline-block;
  transform-origin: 50% 100%;
  animation: site-animated-head-letter 2.6s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

@keyframes site-animated-head-letter {
  0%,
  45%,
  100% {
    transform: scale(1, 1) translateY(0);
  }

  15% {
    transform: scale(1.08, 0.88) translateY(0);
  }

  30% {
    transform: scale(0.94, 1.1) translateY(-6px);
  }
}
</style>
