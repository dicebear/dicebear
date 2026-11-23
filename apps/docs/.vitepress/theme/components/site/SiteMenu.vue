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
      /** Makes the item one of a choice: a check marks the chosen one. */
      checked?: boolean;
      separator?: false;
    }
  | { separator: true };
</script>

<script setup lang="ts">
/**
 * A dropdown menu under its trigger: a card with one row per item, the row
 * under the pointer soft. The trigger slot receives `toggle` and `open` for
 * the button's click handler and `aria-expanded`. A trigger that lives
 * elsewhere calls the exposed `toggle(event)` instead, and the menu opens
 * under that event's `currentTarget`. Items with `checked` form a choice.
 * On a phone the same items open as a sheet from the bottom, with rows for
 * the thumb, as the other menus there do.
 */
import { computed, nextTick, ref, watch } from 'vue';
import { useMediaQuery } from '@vueuse/core';
import SiteDialog from './SiteDialog.vue';
import { Check } from '@lucide/vue';
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
    /** Fills its column, and the list opens as wide as the trigger. */
    fluid?: boolean;
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
    matchWidth: () => props.fluid,
    onShow: () => {
      emit('show');
      focusItem('first');
    },
    onHide: () => emit('hide'),
  });

function enabledItems(): HTMLElement[] {
  return Array.from(
    panel.value?.querySelectorAll<HTMLElement>(
      ':is([role="menuitem"], [role="menuitemradio"]):not(:disabled)',
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
  if (isOpen.value) return;

  event.preventDefault();

  if (phone.value) {
    sheetOpen.value = true;

    return;
  }

  await show();
  await nextTick();
  focusItem(event.key === 'ArrowUp' ? 'last' : 'first');
}

const phone = useMediaQuery('(max-width: 767px)');
const sheetOpen = ref(false);

watch(sheetOpen, (value) => (value ? emit('show') : emit('hide')));

/** Open, as a popover or, on a phone, as a sheet. */
const isOpen = computed(() => (phone.value ? sheetOpen.value : open.value));

function toggleMenu(event?: Event) {
  if (phone.value) {
    sheetOpen.value = !sheetOpen.value;

    return;
  }

  toggle(event);
}

function showMenu(event?: Event) {
  if (phone.value) {
    sheetOpen.value = true;

    return;
  }

  return show(event);
}

function hideMenu() {
  sheetOpen.value = false;
  hide();
}

function pick(item: SiteMenuItem) {
  if (item.separator || item.disabled) return;

  hideMenu();
  item.command();
}

defineExpose({ toggle: toggleMenu, show: showMenu, hide: hideMenu });
</script>

<template>
  <span class="site-menu" :class="{ 'is-fluid': fluid }">
    <span
      ref="trigger"
      class="site-menu-trigger"
      @keydown.down="onTriggerArrow"
      @keydown.up="onTriggerArrow"
    >
      <slot name="trigger" :open="isOpen" :toggle="toggleMenu" />
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
        <div
          v-if="item.separator"
          class="site-menu-separator"
          role="separator"
        />
        <button
          v-else
          type="button"
          :role="item.checked === undefined ? 'menuitem' : 'menuitemradio'"
          :aria-checked="item.checked"
          tabindex="-1"
          class="site-menu-item"
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
          <Check
            v-if="item.checked"
            :size="16"
            :stroke-width="2.6"
            aria-hidden="true"
          />
        </button>
      </template>
    </div>

    <SiteDialog
      v-if="phone"
      v-model:open="sheetOpen"
      sheet
      :header="label ?? 'Menu'"
    >
      <div class="site-menu-sheet" role="menu" :aria-label="label">
        <template v-for="(item, index) in items" :key="index">
          <div
            v-if="item.separator"
            class="site-menu-separator"
            role="separator"
          />
          <button
            v-else
            type="button"
            :role="item.checked === undefined ? 'menuitem' : 'menuitemradio'"
            :aria-checked="item.checked"
            class="site-menu-item"
            :disabled="item.disabled"
            @click="pick(item)"
          >
            <component
              :is="item.icon"
              v-if="item.icon"
              :size="18"
              aria-hidden="true"
              class="site-menu-icon"
            />
            <span class="site-menu-label">{{ item.label }}</span>
            <span v-if="item.hint" class="site-menu-hint">{{ item.hint }}</span>
            <Check
              v-if="item.checked"
              :size="18"
              :stroke-width="2.6"
              aria-hidden="true"
            />
          </button>
        </template>
      </div>
    </SiteDialog>
  </span>
</template>

<style scoped lang="scss">
@use '../../styles/tone';
@use '../../styles/mixins' as m;

.site-menu {
  position: relative;
  display: inline-flex;

  &.is-fluid {
    display: flex;
    width: 100%;
  }

  &-trigger {
    display: flex;
    flex: 1 1 auto;
    min-width: 0;
  }

  &-panel {
    position: fixed;
    inset: auto;
    box-sizing: border-box;
    min-width: 200px;
    max-width: calc(100vw - 16px);
    max-height: calc(100vh - 16px);
    margin: 0;
    padding: 6px;
    border: 0;
    /* It opens inside the box of its trigger, so it resets to neutral. */
    @include tone.tone('panel');
    border-radius: var(--db-radius-6);
    background: var(--db-panel);
    color: var(--db-ink);
    box-shadow:
      0 0 0 1px var(--db-line),
      var(--db-shadow-pop);
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
    padding: 0 14px;
    border: 0;
    border-radius: 20px;
    background: transparent;
    font-family: var(--db-font-display);
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
    color: var(--db-ink-2);
    text-align: left;
    white-space: nowrap;
    cursor: pointer;
    transition:
      background-color 0.12s,
      color 0.12s;

    &:hover {
      @include m.option-hover;
    }

    &[aria-checked='true'] {
      font-weight: 700;
      color: var(--db-ink);
    }

    &:disabled {
      color: var(--db-muted);
      opacity: 0.6;
      pointer-events: none;
    }

    &:focus-visible {
      outline-offset: -2px;
      @include m.option-hover;
    }

    /* The tint of the row takes too much from the muted color. */
    &:is(:hover, :focus-visible) .site-menu-hint {
      color: var(--db-ink-2);
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

  /* The sheet of a phone: the same rows, 48px for the thumb. */
  &-sheet {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 0 8px 8px;

    .site-menu-item {
      height: 48px;
      border-radius: 24px;
      font-size: 17px;
    }
  }
}
</style>
