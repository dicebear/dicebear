<script setup lang="ts">
/**
 * The theme's single layout. A page with `layout: page` brings its own
 * structure and gets the bare content, everything else is a docs page.
 */
import { useData } from 'vitepress';
import ThemeDocsShell from './components/theme/ThemeDocsShell.vue';
import ThemeFooter from './components/theme/ThemeFooter.vue';
import ThemeHeader from './components/theme/ThemeHeader.vue';
import ThemeNotFound from './components/theme/ThemeNotFound.vue';
import ThemeSearch from './components/theme/ThemeSearch.vue';
import ThemeSkipLink from './components/theme/ThemeSkipLink.vue';
import './styles/index.scss';

const { page, frontmatter } = useData();
</script>

<template>
  <ThemeSkipLink />
  <ThemeHeader />
  <ThemeSearch />
  <main id="content" class="theme-main" tabindex="-1">
    <ThemeNotFound v-if="page.isNotFound" />
    <Content v-else-if="frontmatter.layout === 'page'" />
    <ThemeDocsShell v-else />
  </main>
  <ThemeFooter />
</template>

<style lang="scss">
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.theme-main {
  flex: 1;
  outline: none;
}
</style>
