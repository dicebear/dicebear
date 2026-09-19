<script setup lang="ts">
/**
 * One sidebar entry. Depth 0 is a group heading, deeper entries are links,
 * and a link with children can fold. The label may carry a badge as inline
 * markup from the sidebar config, so it renders as HTML.
 */
import { computed, ref, watch } from 'vue';
import { useData, useRoute, withBase } from 'vitepress';
import type { DefaultTheme } from 'vitepress';
import { isActive } from 'vitepress/dist/client/shared.js';
import { hasActiveLink } from 'vitepress/dist/client/theme-default/support/sidebar.js';
import { ChevronRight } from '@lucide/vue';

const props = defineProps<{
  item: DefaultTheme.SidebarItem;
  depth: number;
}>();

const { page } = useData();
const route = useRoute();

const children = computed(() => props.item.items ?? []);

const active = computed(
  () =>
    !!props.item.link &&
    isActive(page.value.relativePath, '', props.item.link, false, true),
);

const containsActive = computed(
  () =>
    children.value.length > 0 &&
    hasActiveLink(page.value.relativePath, '', children.value, true),
);

const foldable = computed(
  () => props.depth > 0 && children.value.length > 0,
);

const open = ref(
  !props.item.collapsed || active.value || containsActive.value,
);

watch(
  () => route.path,
  () => {
    if (active.value || containsActive.value) {
      open.value = true;
    }
  },
);
</script>

<template>
  <div
    class="docs-sidebar-item"
    :class="[`is-depth-${Math.min(depth, 2)}`, { 'is-active': active }]"
  >
    <!-- eslint-disable vue/no-v-html -->
    <span v-if="depth === 0" class="docs-sidebar-group" v-html="item.text" />
    <span v-else class="docs-sidebar-row">
      <a
        v-if="item.link"
        :href="withBase(item.link)"
        class="docs-sidebar-link hv-fade"
        :aria-current="active ? 'page' : undefined"
        v-html="item.text"
      />
      <span v-else class="docs-sidebar-link" v-html="item.text" />
      <button
        v-if="foldable"
        type="button"
        class="docs-sidebar-toggle"
        :aria-expanded="open"
        :aria-label="open ? 'Collapse section' : 'Expand section'"
        @click="open = !open"
      >
        <ChevronRight :size="14" aria-hidden="true" />
      </button>
    </span>
    <!-- eslint-enable vue/no-v-html -->
    <div
      v-if="children.length"
      v-show="depth === 0 || open"
      class="docs-sidebar-children"
    >
      <DocsSidebarItem
        v-for="child in children"
        :key="child.link ?? child.text"
        :item="child"
        :depth="depth + 1"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.docs-sidebar-group {
  display: block;
  padding-bottom: 8px;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: var(--db-ink);
}

.docs-sidebar-row {
  position: relative;
  display: flex;
  align-items: center;
}

.docs-sidebar-link {
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  min-width: 0;
  // Every row keeps the slot of the fold arrow free, so the badges of all
  // entries end on the same line.
  padding: 5px 24px 5px 0;
  // The same size as the breadcrumb above the article: both name where the
  // reader is.
  font-size: 16px;
  line-height: 26px;
  font-weight: 500;
  color: var(--db-ink-2);
}

.is-active > .docs-sidebar-row > .docs-sidebar-link {
  font-weight: 600;
  color: var(--db-brand-text);
}

.docs-sidebar-toggle {
  position: absolute;
  top: 50%;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 28px;
  border-radius: var(--db-radius-1);
  color: var(--db-muted);
  transform: translateY(-50%);
  transition: transform 0.15s;

  &[aria-expanded='true'] {
    transform: translateY(-50%) rotate(90deg);
  }

  &:hover {
    color: var(--db-ink);
  }
}

.is-depth-1 > .docs-sidebar-children {
  margin: 2px 0 6px 2px;
}

.is-depth-2 {
  border-left: 1px solid var(--db-line);

  &.is-active {
    border-left-color: var(--db-brand);
  }

  > .docs-sidebar-row > .docs-sidebar-link {
    padding-left: 14px;
  }
}

.docs-sidebar-item :deep(.vp-sidebar-badge) {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  height: 18px;
  padding: 0 6px;
  border-radius: 5px;
  background: var(--db-tint);
  color: var(--db-tint-text);
  font-size: 11px;
  line-height: 1;
  font-weight: 600;

  &.is-updated {
    background: var(--db-warn-soft);
    color: var(--db-warn);
  }

  &.is-deprecated {
    background: var(--db-soft);
    color: var(--db-muted);
  }
}
</style>
