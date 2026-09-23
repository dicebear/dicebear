<script setup lang="ts">
/**
 * The three ways out: How to use, Copy SVG and the split Download. They sit
 * under the inspector, and on a phone in a bar of their own.
 */
import { Code } from '@lucide/vue';
import PlaygroundButtonCopy from './PlaygroundButtonCopy.vue';
import PlaygroundButtonDownload from './PlaygroundButtonDownload.vue';

defineProps<{
  seed: string;
}>();

const emit = defineEmits<{
  'how-to-use': [];
}>();
</script>

<template>
  <div class="pg-actions">
    <div class="pg-actions-row">
      <button
        type="button"
        class="site-btn site-btn-secondary pg-actions-btn"
        aria-haspopup="dialog"
        @click="emit('how-to-use')"
      >
        <Code :size="16" aria-hidden="true" />
        How to use
      </button>
      <PlaygroundButtonCopy :seed="seed" class="pg-actions-btn" />
    </div>
    <PlaygroundButtonDownload :seed="seed" />
  </div>
</template>

<style scoped lang="scss">
.pg-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &-row {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
  }

  &-btn {
    width: 100%;
    min-width: 0;
    padding: 0 12px;
  }
}
</style>
