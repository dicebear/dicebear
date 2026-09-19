<script setup lang="ts">
defineEmits<{ click: [] }>();
</script>

<template>
  <button
    type="button"
    class="pg-field-reset hv-link"
    aria-label="Reset to default"
    @click="$emit('click')"
  >
    Reset
  </button>
</template>
