<script setup lang="ts">
import SiteDialog from '../site/SiteDialog.vue';

defineProps<{
  open: boolean;
  maxWidth?: string;
  header?: string;
}>();

defineEmits<{
  'update:open': [value: boolean];
}>();
</script>

<template>
  <SiteDialog
    class="ui-dialog"
    :open="open"
    :header="header"
    :max-width="maxWidth || '540px'"
    content-class="ui-dialog-content"
    @update:open="$emit('update:open', $event)"
  >
    <slot />
  </SiteDialog>
</template>

<style scoped lang="scss">
// The content of these dialogs brings no side padding of its own.
.ui-dialog {
  :deep(.ui-dialog-content) {
    padding: 20px 28px 28px;
  }

  &.site-dialog-headerless :deep(.ui-dialog-content) {
    padding-top: 0;
  }

  @media (max-width: 640px) {
    :deep(.ui-dialog-content) {
      padding: 16px 20px 20px;
    }
  }
}
</style>
