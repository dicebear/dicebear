<script setup lang="ts">
/**
 * The strip above a page title: where you are on the left, the Markdown
 * mirror of the page on the right.
 *
 * The Markdown link used to sit here alone, right-aligned against nothing.
 * Pairing it with the trail gives the row a left edge and turns two loose
 * elements into a page header. Either half can be missing: pages without a
 * Markdown mirror drop the link, top-level pages drop the trail.
 */
import DocsBreadcrumb from './DocsBreadcrumb.vue';
import DocsMarkdownLink from './DocsMarkdownLink.vue';
</script>

<template>
  <div class="docs-page-header">
    <DocsBreadcrumb />
    <DocsMarkdownLink />
  </div>
</template>

<style lang="scss" scoped>
.docs-page-header {
  display: flex;
  align-items: center;
  gap: 16px;
  // The slot renders outside `.vp-doc`, so nothing else spaces this row from
  // the page title below it.
  margin-bottom: 16px;
  min-height: 32px;

  // Pushing one child right, rather than spacing both apart, keeps the link
  // on the right edge on the pages where the trail renders nothing.
  :deep(.docs-markdown-link) {
    margin-left: auto;
  }
}
</style>
