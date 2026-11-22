<script setup lang="ts">
defineEmits<{ click: [] }>();
</script>

<template>
  <button
    type="button"
    class="site-pill site-pill-outline site-pill-sm pg-field-reset"
    aria-label="Reset to default"
    @click="$emit('click')"
  >
    Reset
  </button>
</template>
