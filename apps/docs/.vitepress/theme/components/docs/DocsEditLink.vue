<script setup lang="ts">
import { useEditLink } from 'vitepress/dist/client/theme-default/composables/edit-link.js';
import { Pencil } from '@lucide/vue';

const link = useEditLink();
</script>

<template>
  <a
    :href="link.url"
    target="_blank"
    rel="noopener noreferrer"
    class="docs-edit-link hv-link"
  >
    <Pencil :size="16" :stroke-width="1.8" aria-hidden="true" />
    Edit this page on GitHub
  </a>
</template>

<style lang="scss" scoped>
.docs-edit-link {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  gap: 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--db-brand-text);
}
</style>
