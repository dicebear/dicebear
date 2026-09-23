<script setup lang="ts">
/** The docs navigation, built from the sidebar config of the current section. */
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useData, useRoute } from 'vitepress';
import {
  getSidebar,
  getSidebarGroups,
  hasActiveLink,
} from 'vitepress/dist/client/theme-default/support/sidebar.js';
import type { ThemeOptions } from '@theme/types';
import DocsSidebarItem from './DocsSidebarItem.vue';

const { theme, page } = useData<ThemeOptions>();
const route = useRoute();

const groups = computed(() =>
  getSidebarGroups(getSidebar(theme.value.sidebar, page.value.relativePath)),
);

/** The section that holds the current page, by its heading. */
const activeGroup = computed(() => {
  const match = groups.value.find(
    (group) =>
      group.items !== undefined &&
      hasActiveLink(page.value.relativePath, '', group.items, true),
  );

  return match?.text;
});

/** One section at a time, and the one you are reading in by default. */
const openGroup = ref(activeGroup.value);

function toggleGroup(text: string | undefined) {
  openGroup.value = openGroup.value === text ? undefined : text;
}

watch(activeGroup, (text) => {
  if (text !== undefined) {
    openGroup.value = text;
  }
});

const nav = ref<HTMLElement>();

/**
 * The column scrolls on its own, so an entry far down the tree would sit
 * outside it after a load. Bring it into the middle, and leave the scroll
 * position alone while it is already in view.
 */
function revealActive() {
  const box = nav.value?.closest<HTMLElement>(
    '.docs-sidebar-inner, .docs-sidebar',
  );
  const item = nav.value?.querySelector<HTMLElement>(
    '.docs-sidebar-item.is-active',
  );

  if (!box || !item) {
    return;
  }

  const frame = box.getBoundingClientRect();
  const row = item.getBoundingClientRect();
  const margin = 48;

  if (row.top >= frame.top + margin && row.bottom <= frame.bottom - margin) {
    return;
  }

  box.scrollTop += row.top - frame.top - (box.clientHeight - row.height) / 2;
}

onMounted(() => void nextTick(revealActive));
watch(
  () => route.path,
  () => void nextTick(revealActive),
);
</script>

<template>
  <nav ref="nav" class="docs-sidebar-nav" aria-label="Docs">
    <DocsSidebarItem
      v-for="group in groups"
      :key="group.text"
      :item="group"
      :depth="0"
      :open="openGroup === group.text"
      @toggle="toggleGroup(group.text)"
    />
  </nav>
</template>

<style lang="scss" scoped>
.docs-sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
</style>
