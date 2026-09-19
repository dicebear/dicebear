<script setup lang="ts">
/**
 * The search dialog. It is VitePress's local search box, loaded on first use
 * so the search index stays out of every page load.
 */
import { defineAsyncComponent } from 'vue';
import { useSearch, useSearchShortcuts } from '@theme/composables/useSearch';

const SearchBox = defineAsyncComponent(
  () =>
    import('vitepress/dist/client/theme-default/components/VPLocalSearchBox.vue'),
);

const { open, hide } = useSearch();

useSearchShortcuts();
</script>

<template>
  <SearchBox v-if="open" @close="hide" />
</template>
