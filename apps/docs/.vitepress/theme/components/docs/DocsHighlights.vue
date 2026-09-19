<script setup lang="ts">
/**
 * The hairline list of DocsGrid, fed with highlights. Entries with a `link`
 * become linked rows. The list shows no icons, so `icon` and `color` are not
 * rendered.
 */
import { computed, type Component } from 'vue';
import DocsGrid from './DocsGrid.vue';

const props = defineProps<{
  highlights: Array<{
    icon: Component;
    title: string;
    description: string;
    color: string;
    link?: string;
  }>;
}>();

const items = computed(() =>
  props.highlights.map(({ title, description, link }) => ({
    title,
    description,
    link,
  })),
);
</script>

<template>
  <DocsGrid :items="items" />
</template>
