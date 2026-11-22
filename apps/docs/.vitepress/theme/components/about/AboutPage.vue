<script setup lang="ts">
/**
 * The Why DiceBear page answers what someone asks while deciding: what it
 * is, how it compares, what they can rely on, how to help, and where to
 * start.
 */
import AboutHead from './AboutHead.vue';
import AboutCompare from './AboutCompare.vue';
import AboutOpenSource from './AboutOpenSource.vue';
import AboutSupport from './AboutSupport.vue';
import AboutClosing from './AboutClosing.vue';
</script>

<template>
  <div class="about-page">
    <AboutHead />
    <AboutCompare />
    <AboutOpenSource />
    <AboutSupport />
    <AboutClosing />
  </div>
</template>
