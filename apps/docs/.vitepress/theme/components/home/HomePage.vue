<script setup lang="ts">
/**
 * The home page, top to bottom: the hero with the seed field, then five
 * sections: the styles, the HTTP API, how to drop it in, a style
 * of your own and the open source project. Only the hero reacts to the
 * seed field.
 */
import { provideHomeDemo } from '@theme/composables/useHomeDemo';
import HomeHero from './HomeHero.vue';
import HomeStyles from './HomeStyles.vue';
import HomeApi from './HomeApi.vue';
import HomeIntegrate from './HomeIntegrate.vue';
import HomeOwnStyle from './HomeOwnStyle.vue';
import HomeOpenSource from './HomeOpenSource.vue';

// Five of the most used CC0 styles whose definitions are small, since the
// page loads each of them to draw the seed as it is typed: about 14 kB
// gzipped for all five.
provideHomeDemo({
  style: 'pixel-art',
  styles: ['shapes', 'thumbs', 'pixel-art', 'critters', 'glass'],
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
