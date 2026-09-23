<script setup lang="ts">
/**
 * One sidebar entry. Depth 0 is a section card, deeper entries are links.
 * Nobody folds itself: an entry is opened by the level above it, and each
 * level holds one open child, so a single branch is open at a time.
 */
import { computed, ref, watch } from 'vue';
import { useData, withBase } from 'vitepress';
import type { DefaultTheme } from 'vitepress';
import { isActive } from 'vitepress/dist/client/shared.js';
import { hasActiveLink } from 'vitepress/dist/client/theme-default/support/sidebar.js';
import { ChevronRight } from '@lucide/vue';

const props = defineProps<{
  item: DefaultTheme.SidebarItem;
  depth: number;
  /** The level above owns the state, so only one entry of it is open. */
  open?: boolean;
}>();

const emit = defineEmits<{ toggle: [] }>();

const { page } = useData();

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

const foldable = computed(() => children.value.length > 0);

const isOpen = computed(() => props.open === true);

function toggle() {
  emit('toggle');
}

function keyOf(child: DefaultTheme.SidebarItem): string {
  return child.link ?? child.text ?? '';
}

/** The child on the way to the current page, if one of them is. */
const activeChild = computed(() =>
  children.value.find(
    (child) =>
      (!!child.link &&
        isActive(page.value.relativePath, '', child.link, false, true)) ||
      ((child.items?.length ?? 0) > 0 &&
        hasActiveLink(page.value.relativePath, '', child.items ?? [], true)),
  ),
);

const openChild = ref(
  activeChild.value ? keyOf(activeChild.value) : undefined,
);

function toggleChild(key: string) {
  openChild.value = openChild.value === key ? undefined : key;
}

watch(activeChild, (child) => {
  if (child) {
    openChild.value = keyOf(child);
  }
});
</script>

<template>
  <div
    class="docs-sidebar-item"
    :class="[
      `is-depth-${Math.min(depth, 2)}`,
      { 'is-active': active, 'is-open': isOpen },
    ]"
  >
    <button
      v-if="depth === 0"
      type="button"
      class="docs-sidebar-group"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      {{ item.text }}
      <ChevronRight :size="14" aria-hidden="true" class="docs-sidebar-chevron" />
    </button>
    <span v-else class="docs-sidebar-row">
      <a
        v-if="item.link"
        :href="withBase(item.link)"
        class="docs-sidebar-link"
        :aria-current="active ? 'page' : undefined"
        >{{ item.text }}</a
      >
      <span v-else class="docs-sidebar-link">{{ item.text }}</span>
      <button
        v-if="foldable"
        type="button"
        class="docs-sidebar-toggle"
        :aria-expanded="isOpen"
        :aria-label="isOpen ? 'Collapse section' : 'Expand section'"
        @click="toggle"
      >
        <ChevronRight :size="14" aria-hidden="true" />
      </button>
    </span>
    <div
      v-if="children.length"
      class="docs-sidebar-panel"
      :class="{ 'is-open': isOpen }"
      :inert="isOpen ? undefined : true"
    >
      <div class="docs-sidebar-children">
        <DocsSidebarItem
          v-for="child in children"
          :key="child.link ?? child.text"
          :item="child"
          :depth="depth + 1"
          :open="openChild === (child.link ?? child.text ?? '')"
          @toggle="toggleChild(child.link ?? child.text ?? '')"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* A section is a card: quiet fill while it is closed, paper with a hairline
   while it is open. The hover moves the fill one step, in both states. */
.is-depth-0 {
  border: 1px solid transparent;
  border-radius: var(--db-radius-3);
  background: var(--db-soft);
}

.is-depth-0:hover {
  background: var(--db-switch-bg);
}

.is-depth-0.is-open {
  border-color: var(--db-line);
  background: var(--db-paper);
}

.is-depth-0.is-open:hover {
  background: color-mix(in srgb, var(--db-paper) 92%, var(--db-soft));
}

/* The panel opens on its row height, which keeps the cards below in step.
   Its own box carries no padding or margin: those sit outside the row and
   would leave the closed card taller at the bottom than at the top. Spacing
   goes on the entries instead, where the closed row clips it. */
.docs-sidebar-panel {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows var(--duration-fast) var(--ease-smooth);

  &.is-open {
    grid-template-rows: 1fr;
  }

  > * {
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
}

.docs-sidebar-group {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 14px;
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
  color: var(--db-ink);
  text-align: left;
}

.docs-sidebar-chevron {
  flex-shrink: 0;
  margin-left: auto;
  color: var(--db-muted);
  transition: transform var(--duration-fast) var(--ease-smooth);
}

.docs-sidebar-group[aria-expanded='true'] .docs-sidebar-chevron {
  transform: rotate(90deg);
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
  // A step below the article, so the column stays a list of addresses and
  // does not compete with the text.
  font-size: 15px;
  line-height: 24px;
  font-weight: 500;
  color: var(--db-muted);
  transition: color var(--duration-fast) var(--ease-smooth);
}

.docs-sidebar-link:hover {
  color: var(--db-ink);
}

/* The page you are on keeps its color under the pointer: it marks where you
   are, and a hover is not a change of that. */
.is-active > .docs-sidebar-row > .docs-sidebar-link,
.is-active > .docs-sidebar-row > .docs-sidebar-link:hover {
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
  transition:
    transform var(--duration-fast) var(--ease-smooth),
    color var(--duration-fast) var(--ease-smooth);

  &[aria-expanded='true'] {
    transform: translateY(-50%) rotate(90deg);
  }

  &:hover {
    color: var(--db-ink);
  }
}

.is-depth-0 > .docs-sidebar-panel > .docs-sidebar-children {
  padding: 0 14px;
}

.is-depth-0 > .docs-sidebar-panel > .docs-sidebar-children > :last-child {
  padding-bottom: 8px;
}

.is-depth-1 > .docs-sidebar-panel > .docs-sidebar-children {
  padding-left: 2px;
}

.is-depth-1 > .docs-sidebar-panel > .docs-sidebar-children > :first-child {
  padding-top: 2px;
}

.is-depth-1 > .docs-sidebar-panel > .docs-sidebar-children > :last-child {
  padding-bottom: 6px;
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
</style>
