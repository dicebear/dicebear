<script lang="ts">
import type { Component } from 'vue';

export type SiteMenuItem =
  | {
      label: string;
      /** Muted text on the right, for example a file size. */
      hint?: string;
      icon?: Component;
      command: () => void;
      disabled?: boolean;
      separator?: false;
    }
  | { separator: true };
</script>

<script setup lang="ts">
/**
 * A dropdown menu under its trigger. The trigger slot receives `toggle` and
 * `open` for the button's click handler and `aria-expanded`. A trigger that
 * lives elsewhere calls the exposed `toggle(event)` instead, and the menu
 * opens under that event's `currentTarget`.
 */
import { nextTick, ref } from 'vue';
import {
  usePopoverPosition,
  type PopoverAlign,
} from '@theme/composables/usePopoverPosition';

const props = withDefaults(
  defineProps<{
    items: SiteMenuItem[];
    align?: PopoverAlign;
    /** Accessible name of the menu. */
    label?: string;
  }>(),
  { align: 'left', label: undefined },
);

const emit = defineEmits<{
  show: [];
  hide: [];
}>();

defineSlots<{
  trigger?: (props: {
    open: boolean;
    toggle: (event?: Event) => void;
  }) => unknown;
}>();

const trigger = ref<HTMLElement | null>(null);
const panel = ref<HTMLElement | null>(null);

const { ready, native, open, style, show, hide, toggle, onToggle } =
  usePopoverPosition({
    panel,
    anchor: () =>
      (trigger.value?.firstElementChild as HTMLElement | null) ?? trigger.value,
    align: () => props.align,
    onShow: () => {
      emit('show');
      focusItem('first');
    },
    onHide: () => emit('hide'),
  });

function enabledItems(): HTMLElement[] {
  return Array.from(
    panel.value?.querySelectorAll<HTMLElement>(
      '[role="menuitem"]:not(:disabled)',
    ) ?? [],
  );
}

function focusItem(target: 'first' | 'last' | 'next' | 'previous') {
  const list = enabledItems();

  if (!list.length) return;

  const current = list.indexOf(document.activeElement as HTMLElement);
  const last = list.length - 1;

  const index = {
    first: 0,
    last,
    next: current < 0 || current === last ? 0 : current + 1,
    previous: current <= 0 ? last : current - 1,
  }[target];

  list[index].focus();
}

const keys: Record<string, 'first' | 'last' | 'next' | 'previous'> = {
  ArrowDown: 'next',
  ArrowUp: 'previous',
  Home: 'first',
  End: 'last',
};

function onKeyDown(event: KeyboardEvent) {
  if (event.key === 'Tab') {
    hide();

    return;
  }

  const target = keys[event.key];

  if (!target) return;

  event.preventDefault();
  focusItem(target);
}

async function onTriggerArrow(event: KeyboardEvent) {
  if (open.value) return;

  event.preventDefault();
  await show();
  await nextTick();
  focusItem(event.key === 'ArrowUp' ? 'last' : 'first');
}

function pick(item: SiteMenuItem) {
  if (item.separator || item.disabled) return;

  hide();
  item.command();
}

defineExpose({ toggle, show, hide });
</script>

<template>
  <span class="site-menu">
    <span
      ref="trigger"
      class="site-menu-trigger"
      @keydown.down="onTriggerArrow"
      @keydown.up="onTriggerArrow"
    >
      <slot name="trigger" :open="open" :toggle="toggle" />
    </span>

    <div
      v-if="ready"
      v-show="native || open"
      ref="panel"
      class="site-menu-panel"
      :class="{ 'site-menu-fallback': !native }"
      :popover="native ? 'auto' : undefined"
      :style="style"
      role="menu"
      :aria-label="label"
      @toggle="onToggle"
      @keydown="onKeyDown"
    >
      <template v-for="(item, index) in items" :key="index">
        <div v-if="item.separator" class="site-menu-separator" role="separator" />
        <button
          v-else
          type="button"
          role="menuitem"
          tabindex="-1"
          class="site-menu-item hv-ghost"
          :disabled="item.disabled"
          @click="pick(item)"
        >
          <component
            :is="item.icon"
            v-if="item.icon"
            :size="16"
            aria-hidden="true"
            class="site-menu-icon"
          />
          <span class="site-menu-label">{{ item.label }}</span>
          <span v-if="item.hint" class="site-menu-hint">{{ item.hint }}</span>
        </button>
      </template>
    </div>
  </span>
</template>

<style scoped lang="scss">
.site-menu {
  position: relative;
  display: inline-flex;

  &-trigger {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
  }

  &-panel {
    position: fixed;
    inset: auto;
    box-sizing: border-box;
    min-width: 240px;
    max-width: calc(100vw - 16px);
    max-height: calc(100vh - 16px);
    margin: 0;
    padding: 6px;
    border: 1px solid var(--db-line);
    border-radius: 14px;
    background: var(--db-panel);
    color: var(--db-ink);
    box-shadow: var(--db-shadow-pop);
    overflow-y: auto;
  }

  &-fallback {
    z-index: 60;
  }

  &-item {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 40px;
    padding: 0 12px;
    border: 0;
    border-radius: 9px;
    background: transparent;
    color: var(--db-ink);
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    text-align: left;
    white-space: nowrap;

    &:disabled {
      color: var(--db-muted);
      opacity: 0.6;
      pointer-events: none;
    }

    &:focus-visible {
      outline-offset: -2px;
      background-color: var(--db-soft);
    }
  }

  &-icon {
    flex-shrink: 0;
    color: var(--db-muted);
  }

  &-label {
    flex: 1 1 auto;
    min-width: 0;
  }

  &-hint {
    margin-left: 6px;
    font-size: 13px;
    line-height: 18px;
    font-weight: 400;
    color: var(--db-muted);
  }

  &-separator {
    height: 1px;
    margin: 6px 4px;
    background: var(--db-line);
  }
}
</style>
