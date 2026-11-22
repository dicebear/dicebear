<script setup lang="ts">
/**
 * A number field on a text input, so the value shows without grouping and
 * with a suffix. It emits a number while the typed text is a valid number in
 * range, and null when the field is emptied. Blur and Enter clamp the value.
 * `class` and `style` go to the frame, every other attribute goes to the
 * input.
 */
import { computed, nextTick, ref, useAttrs, watch } from 'vue';
import { Minus, Plus } from '@lucide/vue';

defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    modelValue?: number | null;
    min?: number;
    max?: number;
    step?: number;
    /** Decimal places that are kept. The default follows `step`. */
    maxFractionDigits?: number;
    suffix?: string;
    placeholder?: string;
    showButtons?: boolean;
    size?: 'sm' | 'md';
    fluid?: boolean;
    invalid?: boolean;
    disabled?: boolean;
  }>(),
  { modelValue: null, step: 1, size: 'md' },
);

const emit = defineEmits<{
  'update:modelValue': [value: number | null];
}>();

const buttons = [
  { direction: -1, label: 'Decrease', icon: Minus },
  { direction: 1, label: 'Increase', icon: Plus },
] as const;

const attrs = useAttrs();
const input = ref<HTMLInputElement>();
const focused = ref(false);

const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;

  return rest;
});

const digits = computed(() => {
  if (props.maxFractionDigits !== undefined) {
    return props.maxFractionDigits;
  }

  return (String(props.step).split('.')[1] ?? '').length;
});

function round(value: number): number {
  const factor = 10 ** digits.value;

  return Math.round(value * factor) / factor;
}

function clamp(value: number): number {
  return Math.min(
    props.max ?? Infinity,
    Math.max(props.min ?? -Infinity, value),
  );
}

function format(value: number | null): string {
  return value === null ? '' : String(round(value));
}

/** Returns null for an empty field and undefined for text that is no number. */
function parse(raw: string): number | null | undefined {
  const cleaned = raw.trim().replace(',', '.');

  if (cleaned === '') {
    return null;
  }

  const value = Number(cleaned);

  return Number.isFinite(value) ? value : undefined;
}

const text = ref(format(props.modelValue));

// True until the parent has answered our own emit. Its answer must not
// rewrite the text under the caret.
let echo = false;

function send(value: number | null) {
  if (value === props.modelValue) {
    return;
  }

  echo = true;
  emit('update:modelValue', value);
  nextTick(() => (echo = false));
}

watch(
  () => props.modelValue,
  (value) => {
    if (focused.value && echo) {
      return;
    }

    text.value = format(value);
  },
);

function onInput() {
  const value = parse(text.value);

  if (value === null) {
    send(null);
  } else if (value !== undefined && clamp(value) === value) {
    send(round(value));
  }
}

function commit() {
  const value = parse(text.value);

  if (value !== undefined) {
    send(value === null ? null : round(clamp(value)));
  }

  // The parent has the last word, also when it keeps its old value.
  nextTick(() => (text.value = format(props.modelValue)));
}

function stepBy(direction: 1 | -1) {
  if (props.disabled) {
    return;
  }

  const base = parse(text.value) ?? props.modelValue ?? 0;
  const value = round(clamp(base + direction * props.step));

  text.value = format(value);
  send(value);
}

function onBlur() {
  focused.value = false;
  commit();
}

defineExpose({
  focus: () => input.value?.focus(),
});
</script>

<template>
  <span
    class="site-number"
    :class="[
      `is-${size}`,
      {
        'is-fluid': fluid,
        'is-invalid': invalid,
        'is-disabled': disabled,
        'has-buttons': showButtons,
      },
      attrs.class,
    ]"
    :style="attrs.style as string"
  >
    <input
      ref="input"
      v-model="text"
      type="text"
      inputmode="decimal"
      role="spinbutton"
      autocomplete="off"
      class="site-number-input"
      :placeholder="placeholder"
      :disabled="disabled"
      :aria-valuemin="min"
      :aria-valuemax="max"
      :aria-valuenow="modelValue ?? undefined"
      :aria-invalid="invalid || undefined"
      v-bind="inputAttrs"
      @input="onInput"
      @focus="focused = true"
      @blur="onBlur"
      @keydown.up.prevent="stepBy(1)"
      @keydown.down.prevent="stepBy(-1)"
      @keydown.enter="commit"
    />
    <span v-if="suffix && text !== ''" class="site-number-suffix">
      {{ suffix }}
    </span>
    <span v-if="showButtons" class="site-number-buttons">
      <button
        v-for="button in buttons"
        :key="button.direction"
        type="button"
        tabindex="-1"
        class="site-number-button"
        :aria-label="button.label"
        :disabled="disabled"
        @mousedown.prevent
        @click="stepBy(button.direction)"
      >
        <component :is="button.icon" :size="14" aria-hidden="true" />
      </button>
    </span>
  </span>
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

.site-number {
  @include c.control;
  @include c.control-size(md);

  display: inline-flex;
  align-items: center;
  gap: 6px;
  width: 140px;
  max-width: 100%;
  overflow: hidden;

  &.is-sm {
    @include c.control-size(sm);

    width: 88px;
  }

  &.is-fluid {
    display: flex;
    width: 100%;
  }

  &.has-buttons {
    padding-right: 6px;
  }

  &.is-sm.has-buttons {
    padding-right: 6px;
  }

  &:has(.site-number-input:focus-visible) {
    outline: 2px solid var(--db-focus);
    outline-offset: 0;
  }

  &.is-invalid:has(.site-number-input:focus-visible) {
    outline-color: var(--db-danger);
  }

  &.is-disabled {
    @include c.control-disabled;
  }

  &-input {
    flex: 1;
    min-width: 0;
    height: 100%;
    padding: 0;
    border: 0;
    outline: none;
    background: transparent;
    font: inherit;
    font-size: inherit;
    line-height: 24px;
    font-variant-numeric: tabular-nums;
    color: var(--db-ink);

    &::placeholder {
      color: var(--db-muted);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }

  // Below 16px iOS zooms into a focused field.
  @media (max-width: 767px) {
    &-input {
      font-size: 16px;
    }
  }

  &-suffix {
    flex-shrink: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--db-muted);
  }

  /* Minus and plus as two round buttons inside the pill, at its right
     end. They keep the 6px of the pill's own curve around them. */
  &-buttons {
    display: flex;
    flex-shrink: 0;
    gap: 2px;
    margin-left: 4px;
  }

  &-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent;
    color: var(--db-ink-2);
    cursor: pointer;
    transition:
      background-color 0.12s,
      color 0.12s;

    &:hover:not(:disabled) {
      background: var(--db-soft);
      color: var(--db-ink);
    }

    .is-sm & {
      width: 24px;
      height: 24px;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
}
</style>
