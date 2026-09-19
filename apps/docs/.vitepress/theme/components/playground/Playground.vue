<script setup lang="ts">
/**
 * The page shell. The title is server-rendered. The tool itself reads
 * sessionStorage and IndexedDB, so it only mounts in the browser and a
 * skeleton of the same size holds its place until then.
 *
 * Content and loader both render several root elements that place themselves
 * in the grid below: the actions next to the title, the body underneath.
 */
import { onMounted, ref } from 'vue';
import PlaygroundLoader from './PlaygroundLoader.vue';
import PlaygroundContent from './PlaygroundContent.vue';

const mounted = ref(false);

onMounted(() => {
  mounted.value = true;
});
</script>

<template>
  <div class="site-container pg-page">
    <div class="pg-page-grid">
      <h1 class="site-h2 pg-page-title">Playground</h1>
      <PlaygroundContent v-if="mounted" />
      <PlaygroundLoader v-else />
    </div>
  </div>
</template>

<style scoped lang="scss">
.pg-page {
  padding-top: 40px;
  padding-bottom: 160px;

  &-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: end;
    gap: 32px 24px;
  }

  &-title {
    margin: 0;
  }

  @media (max-width: 767px) {
    padding-top: 24px;
    padding-bottom: 64px;

    &-grid {
      align-items: center;
      gap: 16px 12px;
    }
  }
}
</style>
