<script setup lang="ts">
/**
 * The page: the playground fills the window under the site header. The tool
 * reads sessionStorage and IndexedDB, so it only mounts in the browser and a
 * frame of the same shape holds its place until then.
 */
import { onMounted, ref } from 'vue';
import PlaygroundLoader from './PlaygroundLoader.vue';
import PlaygroundApp from './PlaygroundApp.vue';

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div class="pg-page">
    <h1 class="sr-only">Playground</h1>
    <PlaygroundApp v-if="mounted" />
    <PlaygroundLoader v-else />
  </div>
</template>

<style scoped lang="scss">
/* The window minus the header. Between phone and desktop the page scrolls
   instead. A phone hides the site header and gives the playground the
   whole window, with a bar of its own. */
.pg-page {
  height: calc(100dvh - var(--db-header-h));
  min-height: 560px;

  @media (max-width: 959px) {
    height: auto;
    min-height: calc(100dvh - var(--db-header-h));
  }

  @media (max-width: 767px) {
    --db-header-h: 0px;

    height: 100dvh;
    min-height: 0;
  }
}
</style>
