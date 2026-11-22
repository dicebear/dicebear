<script setup lang="ts">
/**
 * The page head: the question, the answer in one sentence, the ways to try
 * it, and four facts that back the answer up, each on a color tile.
 */
import { computed } from 'vue';
import { useData } from 'vitepress';
import type { ThemeOptions } from '@theme/types';
import { isPublicDomain } from '@theme/utils/license';
import SitePageHead from '../site/SitePageHead.vue';
import SiteStat from '../site/SiteStat.vue';

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
      tone: 'sun',
      figure: String(theme.value.styleCount),
      text: 'styles: abstract marks, characters and scenes',
    },
    {
      tone: 'lilac',
      figure: String(publicDomain),
      text: "styles under CC0 1.0. The others use CC BY 4.0, MIT or the artist's own terms.",
    },
    {
      tone: 'mint',
      figure: 'MIT',
      text: 'for the code, open source on GitHub',
    },
    {
      tone: 'sky',
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

  <section class="site-container site-grid about-head-facts" aria-label="Facts">
    <div
      v-for="fact in facts"
      :key="fact.figure"
      class="site-box is-tile"
      :class="`is-${fact.tone}`"
    >
      <SiteStat :value="fact.figure" :note="fact.text" />
    </div>
  </section>
</template>

<style scoped lang="scss">
.about-head-facts {
  --site-grid-min: 240px;

  padding-top: clamp(40px, 5vw, 72px);
}
</style>
