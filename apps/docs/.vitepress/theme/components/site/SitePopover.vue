<script setup lang="ts">
/**
 * A floating panel with free content, for example a color picker. It opens
 * under the `currentTarget` of the event passed to `toggle(event)` or
 * `show(event)`. The content renders only while the panel is open.
 */
import { ref } from 'vue';
import {
  usePopoverPosition,
  type PopoverAlign,
} from '@theme/composables/usePopoverPosition';

const props = withDefaults(
  defineProps<{
    align?: PopoverAlign;
    /** Accessible name of the panel. */
    label?: string;
  }>(),
  { align: 'left', label: undefined },
);

const emit = defineEmits<{
  show: [];
  hide: [];
}>();

defineSlots<{
  default?: (props: { hide: () => void }) => unknown;
}>();

const panel = ref<HTMLElement | null>(null);

const { ready, native, open, style, show, hide, toggle, onToggle } =
  usePopoverPosition({
    panel,
    align: () => props.align,
    onShow: () => emit('show'),
    onHide: () => emit('hide'),
  });

defineExpose({ toggle, show, hide });
</script>

<template>
  <div
    v-if="ready"
    v-show="native || open"
    ref="panel"
    class="site-popover"
    :class="{ 'site-popover-fallback': !native }"
    :popover="native ? 'auto' : undefined"
    :style="style"
    role="dialog"
    :aria-label="label"
    @toggle="onToggle"
  >
    <slot v-if="open" :hide="hide" />
  </div>
</template>

<style scoped lang="scss">
.site-popover {
  position: fixed;
  inset: auto;
  box-sizing: border-box;
  max-width: calc(100vw - 16px);
  max-height: calc(100vh - 16px);
  margin: 0;
  padding: 16px;
  border: 1px solid var(--db-line);
  border-radius: 14px;
  background: var(--db-panel);
  color: var(--db-ink);
  box-shadow: var(--db-shadow-pop);
  overflow: auto;

  &-fallback {
    z-index: 60;
  }
}
</style>
