<script setup lang="ts" generic="T">
/**
 * A segmented control for two to six options, built as a radio group. One
 * segment is always chosen. Tab reaches the chosen segment, and the arrow
 * keys move the choice.
 */
import { computed, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    options: readonly { value: T; label: string }[];
    ariaLabel?: string;
    size?: 'sm' | 'md';
    fluid?: boolean;
    disabled?: boolean;
  }>(),
  { size: 'md' },
);

const model = defineModel<T>({ required: true });

const buttons = ref<HTMLButtonElement[]>([]);

const chosen = computed(() =>
  props.options.findIndex((option) => option.value === model.value),
);

// The segment that Tab reaches. It is the first one while the model matches
// no option.
const tabStop = computed(() => Math.max(0, chosen.value));

function pick(index: number) {
  model.value = props.options[index].value;
}

function onKeydown(event: KeyboardEvent, index: number) {
  const last = props.options.length - 1;
  let target: number;

  switch (event.key) {
    case 'ArrowRight':
    case 'ArrowDown':
      target = index === last ? 0 : index + 1;
      break;
    case 'ArrowLeft':
    case 'ArrowUp':
      target = index === 0 ? last : index - 1;
      break;
    case 'Home':
      target = 0;
      break;
    case 'End':
      target = last;
      break;
    default:
      return;
  }

  event.preventDefault();
  pick(target);
  buttons.value
    .find((button) => Number(button.dataset.index) === target)
    ?.focus();
}
</script>

<template>
  <span
    role="radiogroup"
    class="site-segmented"
    :class="[`is-${size}`, { 'is-fluid': fluid }]"
    :aria-label="ariaLabel"
    :aria-disabled="disabled || undefined"
  >
    <button
      v-for="(option, index) in options"
      :key="index"
      ref="buttons"
      type="button"
      role="radio"
      class="site-segmented-item hv-seg"
      :aria-checked="index === chosen"
      :tabindex="index === tabStop ? 0 : -1"
      :disabled="disabled"
      :data-index="index"
      @click="pick(index)"
      @keydown="onKeydown($event, index)"
    >
      {{ option.label }}
    </button>
  </span>
</template>

<style scoped lang="scss">
.site-segmented {
  display: inline-grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(0, 1fr);
  gap: 4px;
  max-width: 100%;
  padding: 4px;
  box-sizing: border-box;
  border-radius: var(--db-radius-3);
  background: var(--db-soft);

  &.is-fluid {
    display: grid;
    width: 100%;
  }

  &.is-sm {
    border-radius: 10px;
  }

  &-item {
    min-width: 0;
    height: 34px;
    padding: 0 14px;
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: 9px;
    background: transparent;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    line-height: 20px;
    color: var(--db-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;

    &[aria-checked='true'] {
      border-color: var(--db-line);
      background: var(--db-paper);
      color: var(--db-ink);
      cursor: default;
    }

    &:focus-visible {
      outline-offset: 1px;
    }

    &:disabled {
      opacity: 0.5;
      pointer-events: none;
    }
  }

  &.is-sm &-item {
    height: 30px;
    padding: 0 10px;
    border-radius: var(--db-radius-2);
    font-size: 13px;
    line-height: 18px;
  }
}
</style>
