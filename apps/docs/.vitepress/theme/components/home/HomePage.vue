<script setup lang="ts">
/**
 * The homepage, top to bottom: the hero with the seed field, the three
 * groups of styles, the usage numbers, the run of style names and the
 * closing call.
 */
import HomeHero from './HomeHero.vue';
import HomeShowcase from './HomeShowcase.vue';
import HomeUsage from './HomeUsage.vue';
import HomeStyleIndex from './HomeStyleIndex.vue';
import HomeClosing from './HomeClosing.vue';
</script>

<template>
  <HomeHero />
  <HomeShowcase />
  <HomeUsage />
  <HomeStyleIndex />
  <HomeClosing />
</template>

<style lang="scss">
/* The homepage runs wider than the other pages: 80px gutters at 1440, which
   narrow to the normal gutter on small screens. */
.home-wrap {
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding-right: clamp(var(--db-gutter), calc((100vw - 640px) * 0.1), 80px);
  padding-left: clamp(var(--db-gutter), calc((100vw - 640px) * 0.1), 80px);
  box-sizing: border-box;
}
</style>
