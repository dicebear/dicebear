<script setup lang="ts">
/**
 * The ways out, under the inspector and on a phone in a bar of their own.
 * How to use leads: more people open it than download anything. The
 * download sits above it as the second choice. Under the sheet of a phone
 * both share one row, How to use as a round button with its name as the
 * tooltip, so the sheet keeps the height.
 */
import { Code } from '@lucide/vue';
import PlaygroundButtonDownload from './PlaygroundButtonDownload.vue';

defineProps<{
  seed: string;
  /** One row: How to use as an icon, the download beside it. */
  row?: boolean;
}>();

const emit = defineEmits<{
  'how-to-use': [];
}>();
</script>

<template>
  <div v-if="row" class="pg-actions is-row">
    <button
      type="button"
      class="site-btn site-btn-secondary site-btn-lg site-btn-icon"
      aria-haspopup="dialog"
      aria-label="How to use"
      data-tip="How to use"
      @click="emit('how-to-use')"
    >
      <Code :size="20" aria-hidden="true" />
    </button>
    <div class="pg-actions-download">
      <PlaygroundButtonDownload :seed="seed" primary />
    </div>
  </div>
  <div v-else class="pg-actions">
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

  &.is-row {
    flex-direction: row;
  }

  /* The download takes the rest of the row. */
  &-download {
    display: flex;
    flex: 1;
    min-width: 0;
  }
}
</style>
