<script setup lang="ts">
/**
 * The sheet of the advanced and editor views on a phone. It lies over the
 * playground from the bottom of the picture down to the actions, so the
 * avatar stays large above it, and a pull on its grip, or a tap, raises it
 * to the top of the playground for more room; the head then shows a small
 * avatar, so a change stays in sight. Its content scrolls inside it.
 *
 * The parent measures where the picture ends (`top`) and how high the
 * actions are (`bottom`), both in pixels from the playground's edges.
 */
import { computed, onBeforeUnmount, ref } from 'vue';

const props = defineProps<{
  top: number;
  bottom: number;
  label: string;
}>();

/** The top of the raised sheet: just under the playground's edge. */
const RAISED = 8;

const expanded = ref(false);
const dragTop = ref<number | null>(null);

let startY = 0;
let startTop = 0;
let moved = false;

// A press on the grip follows the pointer on the whole window until it is
// let go, so a quick pull that leaves the grip at once still counts. It
// becomes a pull after a few pixels; less stays a tap on the handle.
function onPointerDown(event: PointerEvent) {
  if (event.button !== 0) return;

  startY = event.clientY;
  startTop = expanded.value ? RAISED : props.top;
  moved = false;

  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
  window.addEventListener('pointercancel', onPointerUp);
}

function onPointerMove(event: PointerEvent) {
  const delta = event.clientY - startY;

  if (!moved && Math.abs(delta) < 6) return;

  moved = true;
  dragTop.value = Math.min(props.top, Math.max(RAISED, startTop + delta));
}

// A pull of a fifth of the way or more takes the sheet to the other end; a
// shorter one lets it fall back.
function onPointerUp() {
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  window.removeEventListener('pointercancel', onPointerUp);

  if (!moved || dragTop.value === null) return;

  const travel = props.top - RAISED;
  const raisedBy = props.top - dragTop.value;

  expanded.value = expanded.value
    ? raisedBy > travel * 0.8
    : raisedBy > travel * 0.2;
  dragTop.value = null;
}

onBeforeUnmount(onPointerUp);

// A tap, or Enter and Space, toggles the sheet. The click that ends a pull
// is not a tap.
function onHandleClick() {
  if (moved) {
    moved = false;

    return;
  }

  expanded.value = !expanded.value;
}

const style = computed(() => ({
  top: `${dragTop.value ?? (expanded.value ? RAISED : props.top)}px`,
  bottom: `${props.bottom}px`,
}));

defineExpose({ expanded });
</script>

<template>
  <section
    class="pg-sheet"
    :class="{ 'is-expanded': expanded, 'is-dragging': dragTop !== null }"
    :style="style"
    :aria-label="label"
  >
    <div class="pg-sheet-grip" @pointerdown="onPointerDown">
      <button
        type="button"
        class="pg-sheet-handle"
        :aria-expanded="expanded"
        :aria-label="expanded ? 'Lower the options' : 'Raise the options'"
        @click="onHandleClick"
      >
        <span aria-hidden="true" />
      </button>
      <div v-if="$slots.head" class="pg-sheet-head">
        <slot name="head" :expanded="expanded" />
      </div>
    </div>
    <div class="pg-sheet-body">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
.pg-sheet {
  position: absolute;
  /* Over the toolbar too, once raised. */
  z-index: 8;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  border-radius: 28px 28px 0 0;
  background: var(--db-panel);
  box-shadow:
    0 0 0 1px var(--db-line),
    0 -16px 32px -24px rgba(0, 0, 0, 0.45);
  transition: top var(--duration-mid) var(--ease-smooth);

  &.is-dragging {
    transition: none;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }

  /* The grip takes the pull: no scrolling or zooming starts on it. */
  &-grip {
    flex-shrink: 0;
    touch-action: none;
    cursor: grab;
  }

  &.is-dragging &-grip {
    cursor: grabbing;
  }

  /* A wide target for the thumb, with the small bar in its middle. */
  &-handle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 28px;
    padding: 0;
    border: 0;
    border-radius: 28px 28px 0 0;
    background: transparent;
    cursor: inherit;

    span {
      width: 40px;
      height: 5px;
      border-radius: 3px;
      background: var(--db-field-border);
    }

    &:focus-visible {
      outline: 2px solid var(--db-focus);
      outline-offset: -4px;
    }
  }

  &-head:empty {
    display: none;
  }

  &-body {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }
}
</style>
