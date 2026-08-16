<script setup lang="ts">
/**
 * The strip above a page title: where you are on the left, what you can do
 * with the page on the right.
 *
 * The Markdown actions used to sit here alone, right-aligned against nothing.
 * Pairing them with the trail gives the row a left edge and turns two loose
 * controls into a page header. Either half can be missing: pages without a
 * Markdown mirror drop the actions, top-level pages drop the trail.
 */
import DocsBreadcrumb from './DocsBreadcrumb.vue';
import DocsCopyPage from './DocsCopyPage.vue';
</script>

<template>
  <div class="docs-page-header">
    <DocsBreadcrumb />
    <DocsCopyPage />
  </div>
</template>

<style lang="scss" scoped>
.docs-page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  // The slot renders outside `.vp-doc`, so nothing else spaces this row from
  // the page title below it.
  margin-bottom: 8px;
  min-height: 32px;

  // Pushing one child right, rather than spacing both apart, keeps the actions
  // on the right edge on the pages where the trail renders nothing.
  :deep(.docs-copy-page) {
    margin-left: auto;
  }
}
</style>
