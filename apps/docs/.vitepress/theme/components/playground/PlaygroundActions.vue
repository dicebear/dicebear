<script setup lang="ts">
/**
 * The ways out, under the inspector and on a phone in a bar of their own.
 * How to use leads: more people open it than download anything. The
 * download sits above it as the second choice.
 */
import { Code } from '@lucide/vue';
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
    <PlaygroundButtonDownload :seed="seed" />
    <button
      type="button"
      class="site-btn site-btn-primary site-btn-lg pg-actions-primary"
      aria-haspopup="dialog"
      @click="emit('how-to-use')"
    >
      <Code :size="18" aria-hidden="true" />
      How to use
    </button>
  </div>
</template>

<style scoped lang="scss">
.pg-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;

  &-primary {
    width: 100%;
  }
}
</style>
