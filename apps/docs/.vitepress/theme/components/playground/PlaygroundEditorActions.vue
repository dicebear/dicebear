<script setup lang="ts">
/**
 * The ways out of the editor view, side by side. The editor is for people
 * who design their own avatar, so saving it leads and the code stays second.
 * They sit in the row under the avatar, and on a phone in the bar at the
 * bottom, where both share the width.
 */
import { Code } from '@lucide/vue';
import PlaygroundButtonDownload from './PlaygroundButtonDownload.vue';

defineProps<{
  seed: string;
  /** Both buttons share the full width. */
  fluid?: boolean;
}>();

const emit = defineEmits<{
  'how-to-use': [];
}>();
</script>

<template>
  <div class="pg-editor-actions" :class="{ 'is-fluid': fluid }">
    <button
      type="button"
      class="site-btn site-btn-secondary site-btn-lg pg-editor-actions-code"
      aria-haspopup="dialog"
      @click="emit('how-to-use')"
    >
      <Code :size="16" aria-hidden="true" />
      How to use
    </button>
    <div class="pg-editor-actions-download">
      <PlaygroundButtonDownload :seed="seed" primary />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../../styles/mixins' as m;

.pg-editor-actions {
  display: flex;
  gap: 8px;

  /* Large on a wide window, as the actions of the page; a phone shares the
     row between the two and takes the medium size. */
  @media (max-width: 767px) {
    :deep(.site-btn:not(.site-btn-icon)) {
      @include m.button-size(md);
    }

    :deep(.site-btn-icon) {
      width: 44px;
      height: 44px;
    }
  }

  &-download {
    display: flex;
  }

  &.is-fluid &-code {
    flex: 1 1 0;
    min-width: 0;
    padding: 0 12px;
  }

  &.is-fluid &-download {
    flex: 1.3 1 0;
    width: auto;
    min-width: 0;
  }
}
</style>
