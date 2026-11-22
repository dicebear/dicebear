<script setup lang="ts">
/**
 * The label above a section: a die with the number of the section on the
 * page and a short name.
 */
import SiteDie from './SiteDie.vue';

defineProps<{ face: number }>();
</script>

<template>
  <p class="site-eyebrow">
    <SiteDie :face="face" />
    <span><slot /></span>
  </p>
</template>
