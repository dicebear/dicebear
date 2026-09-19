<script setup lang="ts">
/** The docs navigation, built from the sidebar config of the current section. */
import { computed } from 'vue';
import { useData } from 'vitepress';
import {
  getSidebar,
  getSidebarGroups,
} from 'vitepress/dist/client/theme-default/support/sidebar.js';
import type { ThemeOptions } from '@theme/types';
import DocsSidebarItem from './DocsSidebarItem.vue';

const { theme, page } = useData<ThemeOptions>();

const groups = computed(() =>
  getSidebarGroups(getSidebar(theme.value.sidebar, page.value.relativePath)),
);
</script>

<template>
  <nav class="docs-sidebar-nav" aria-label="Docs">
    <DocsSidebarItem
      v-for="group in groups"
      :key="group.text"
      :item="group"
      :depth="0"
    />
  </nav>
</template>

<style lang="scss" scoped>
.docs-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 28px;
}
</style>
