<script setup lang="ts">
/**
 * The home page, top to bottom: the hero with the seed field, then five
 * numbered sections: the styles, the HTTP API, how to drop it in, a style
 * of your own and the open source project. The hero sets the seed and the
 * style that the code sample and the crowd further down use.
 */
import { provideHomeDemo } from '@theme/composables/useHomeDemo';
import HomeHero from './HomeHero.vue';
import HomeStyles from './HomeStyles.vue';
import HomeApi from './HomeApi.vue';
import HomeIntegrate from './HomeIntegrate.vue';
import HomeOwnStyle from './HomeOwnStyle.vue';
import HomeOpenSource from './HomeOpenSource.vue';

// The most used styles first, so the fan opens on what most people pick.
provideHomeDemo({
  style: 'avataaars',
  styles: [
    'avataaars',
    'notionists',
    'big-ears',
    'adventurer',
    'lorelei',
    'bottts',
    'personas',
    'micah',
    'thumbs',
    'pixel-art',
    'croodles',
    'shapes',
  ],
});
</script>

<template>
  <div class="home">
    <HomeHero />
    <HomeStyles />
    <HomeApi />
    <HomeIntegrate />
    <HomeOwnStyle />
    <HomeOpenSource />
  </div>
</template>

<style scoped lang="scss">
.home {
  overflow-x: clip;

  > :deep(.site-box.is-block) {
    margin-top: var(--db-edge);
  }

  > :deep(.site-box.is-block:last-child) {
    margin-bottom: var(--db-edge);
  }
}
</style>
