<script setup lang="ts">
/**
 * The page head: the question, the answer in one sentence, the ways to try
 * it, and a row of four facts that back the answer up.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { isPublicDomain } from '@theme/utils/license';
import SitePageHead from '../site/SitePageHead.vue';

const { theme } = useData<ThemeOptions>();

const crumbs = [{ text: 'Home', link: '/' }, { text: 'Why DiceBear' }];

// The libraries with a package of their own. The CLI and the HTTP API come
// on top.
const LIBRARIES = ['JavaScript', 'PHP', 'Python', 'Rust', 'Go', 'Dart', 'C#'];

// The counts come from the styles themselves, so a new style shows up here
// without anyone touching the page.
const facts = computed(() => {
  const styles = Object.values(theme.value.avatarStyles);
  const publicDomain = styles.filter((style) =>
    isPublicDomain(style.meta),
  ).length;
  const languages = `${LIBRARIES.slice(0, -1).join(', ')} and ${LIBRARIES.at(-1)}`;

  return [
    {
      figure: String(theme.value.styleCount),
      text: 'styles: abstract marks, characters and scenes',
    },
    {
      figure: String(publicDomain),
      text: "styles under CC0 1.0. The others use CC BY 4.0, MIT or the artist's own terms.",
    },
    {
      figure: 'MIT',
      text: 'for the code, open source on GitHub',
    },
    {
      figure: String(LIBRARIES.length),
      text: `libraries, for ${languages}, plus a CLI and the HTTP API`,
    },
  ];
});
</script>

<template>
  <SitePageHead :crumbs="crumbs" title="Why DiceBear?">
    <p>
      DiceBear is an open source avatar library. It draws avatars from a seed,
      in {{ theme.styleCount }} styles, from your own code or through a free
      HTTP API.
    </p>
    <template #actions>
      <a href="/playground/" class="site-btn site-btn-lg site-btn-primary">
        Open the Playground
      </a>
      <a href="/start/" class="site-btn site-btn-lg site-btn-secondary">
        Read the docs
      </a>
    </template>
  </SitePageHead>

  <div class="site-container">
    <ul class="about-head-facts site-rise" style="animation-delay: 320ms">
      <li v-for="(fact, index) in facts" :key="index" class="about-head-fact">
        <span class="site-h2">{{ fact.figure }}</span>
        <span class="site-text">{{ fact.text }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
/* The facts as one row under a hairline, as the licenses page counts its
   styles. */
.about-head-facts {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 32px;
  margin: 72px 0 0;
  padding: 28px 0 0;
  border-top: 1px solid var(--db-line);
  list-style: none;

  @media (max-width: 959px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 32px 24px;
  }

  @media (max-width: 767px) {
    margin-top: 48px;
  }

  @media (max-width: 559px) {
    grid-template-columns: minmax(0, 1fr);
    gap: 24px;
  }
}

.about-head-fact {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 0;
}
</style>
