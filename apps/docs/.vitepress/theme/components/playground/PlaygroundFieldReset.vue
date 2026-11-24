<script setup lang="ts">
/**
 * The reset of a field, a group or an entry: one small chip everywhere, as
 * high as the label row it sits in, so it can appear without moving the
 * rows below.
 */
defineEmits<{ click: [] }>();
</script>

<template>
  <button
    type="button"
    class="site-pill site-pill-outline site-pill-xs pg-field-reset"
    aria-label="Reset to default"
    @click="$emit('click')"
  >
    Reset
  </button>
</template>
