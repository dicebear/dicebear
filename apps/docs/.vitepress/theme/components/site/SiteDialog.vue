<script lang="ts">
// Open dialogs share one scroll lock, so a nested dialog that closes does not
// release the page while its parent is still open.
let lockCount = 0;

function lockScroll() {
  lockCount += 1;

  if (lockCount > 1) return;

  const root = document.documentElement;
  const scrollbar = window.innerWidth - root.clientWidth;

  root.style.overflow = 'hidden';

  // Keeps the page from shifting sideways when the scrollbar disappears.
  if (scrollbar > 0) root.style.paddingRight = `${scrollbar}px`;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);

  if (lockCount > 0) return;

  const root = document.documentElement;

  root.style.overflow = '';
  root.style.paddingRight = '';
}
</script>

<script setup lang="ts">
/**
 * A modal on the native `<dialog>`. The browser supplies the top layer, the
 * focus trap, Esc and the return of focus to the opener. The content renders
 * only while the dialog is open.
 */
import { computed, onBeforeUnmount, onMounted, ref, useId, watch } from 'vue';
import { X } from '@lucide/vue';

const props = withDefaults(
  defineProps<{
    open: boolean;
    header?: string;
    maxWidth?: string;
    contentClass?: string;
    closable?: boolean;
  }>(),
  { header: undefined, maxWidth: '640px', contentClass: undefined, closable: true },
);

const emit = defineEmits<{
  'update:open': [value: boolean];
}>();

const slots = defineSlots<{
  default?: () => unknown;
  header?: () => unknown;
}>();

const dialog = ref<HTMLDialogElement | null>(null);
const titleId = useId();

const hasHeader = computed(() => !!slots.header || !!props.header?.trim());

let locked = false;
let pressedBackdrop = false;

function setLock(value: boolean) {
  if (value === locked) return;

  locked = value;

  if (value) lockScroll();
  else unlockScroll();
}

function sync(open: boolean) {
  const el = dialog.value;

  if (!el) return;

  if (open && !el.open) el.showModal();
  if (!open && el.open) el.close();

  setLock(open);
}

function requestClose() {
  if (props.closable) emit('update:open', false);
}

// Esc. The browser closes the dialog by itself unless this is prevented.
function onCancel(event: Event) {
  if (event.target === dialog.value && !props.closable) event.preventDefault();
}

function onClose(event: Event) {
  if (event.target !== dialog.value) return;

  setLock(false);

  if (props.open) emit('update:open', false);
}

// A press on the backdrop targets the dialog element itself, because the box
// has no padding. Press and release both have to land there, so dragging a
// text selection out of the box does not close it.
function onPointerDown(event: PointerEvent) {
  pressedBackdrop = event.target === dialog.value;
}

function onClick(event: MouseEvent) {
  if (pressedBackdrop && event.target === dialog.value) requestClose();

  pressedBackdrop = false;
}

watch(
  () => props.open,
  (open) => sync(open),
  { flush: 'post' },
);

onMounted(() => sync(props.open));

onBeforeUnmount(() => {
  if (dialog.value?.open) dialog.value.close();

  setLock(false);
});
</script>

<template>
  <dialog
    ref="dialog"
    class="site-dialog"
    :class="{ 'site-dialog-headerless': !hasHeader }"
    :style="{ '--site-dialog-width': maxWidth }"
    :aria-labelledby="hasHeader ? titleId : undefined"
    @cancel="onCancel"
    @close="onClose"
    @pointerdown="onPointerDown"
    @click="onClick"
  >
    <template v-if="open">
      <div v-if="hasHeader" class="site-dialog-header">
        <h2 :id="titleId" class="site-dialog-title">
          <slot name="header">{{ header }}</slot>
        </h2>
        <button
          v-if="closable"
          type="button"
          class="site-dialog-close hv-ghost"
          aria-label="Close"
          @click="requestClose"
        >
          <X :size="20" aria-hidden="true" />
        </button>
      </div>
      <button
        v-else-if="closable"
        type="button"
        class="site-dialog-close site-dialog-close-floating hv-ghost"
        aria-label="Close"
        @click="requestClose"
      >
        <X :size="20" aria-hidden="true" />
      </button>

      <div class="site-dialog-content" :class="contentClass">
        <slot />
      </div>
    </template>
  </dialog>
</template>

<style scoped lang="scss">
.site-dialog {
  // The same gap above and below, which centers the box and keeps a tall one
  // off the edges of the window.
  --site-dialog-gap: clamp(16px, 5vh, 64px);

  position: fixed;
  inset: 0;
  box-sizing: border-box;
  width: min(var(--site-dialog-width), calc(100vw - 32px));
  max-width: none;
  height: fit-content;
  max-height: calc(100vh - var(--site-dialog-gap) * 2);
  max-height: calc(100dvh - var(--site-dialog-gap) * 2);
  margin: auto;
  padding: 0;
  border: 1px solid var(--db-line);
  border-radius: var(--db-radius-5);
  background: var(--db-panel);
  color: var(--db-ink);
  box-shadow: var(--db-shadow-pop);
  overflow: hidden;

  // Only while open, a closed dialog has to keep `display: none`.
  &[open] {
    display: flex;
    flex-direction: column;
    animation: site-dialog-in var(--duration-fast) var(--ease-smooth);
  }

  &::backdrop {
    background: rgba(6, 12, 18, 0.4);
  }

  &[open]::backdrop {
    animation: site-dialog-in var(--duration-fast) var(--ease-smooth);
  }

  &-header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    min-height: 68px;
    padding: 0 16px 0 28px;
    border-bottom: 1px solid var(--db-line);
  }

  &-title {
    min-width: 0;
    margin: 0;
    padding: 12px 0;
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
    letter-spacing: -0.01em;
    color: var(--db-ink);
  }

  &-close {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    padding: 0;
    border: 0;
    border-radius: 10px;
    background: transparent;
    color: var(--db-muted);

    &-floating {
      position: absolute;
      z-index: 1;
      top: 14px;
      right: 16px;
    }
  }

  &-content {
    flex: 1 1 auto;
    min-height: 0;
    overflow-x: hidden;
    overflow-y: auto;
    overscroll-behavior: contain;
  }

  @media (max-width: 640px) {
    &-header {
      min-height: 60px;
      padding: 0 8px 0 20px;
    }

    &-title {
      font-size: 18px;
      line-height: 26px;
    }

    &-close-floating {
      top: 10px;
      right: 8px;
    }
  }
}

.dark .site-dialog::backdrop {
  background: rgba(6, 12, 18, 0.6);
}

@keyframes site-dialog-in {
  from {
    opacity: 0;
  }
}
</style>
