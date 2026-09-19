<script setup lang="ts" generic="V extends number | [number, number]">
/**
 * A slider on native range inputs, so keyboard and touch handling come from
 * the browser. The track is drawn by the wrapper. In range mode two inputs
 * lie on top of each other, only their thumbs take the pointer, and each
 * thumb stops at the other one. The model is a number, or a pair of numbers
 * with `range`.
 */
import { computed, nextTick, ref } from 'vue';

const props = withDefaults(
  defineProps<{
    modelValue: V;
    range?: boolean;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    ariaLabel?: string;
    ariaLabelMin?: string;
    ariaLabelMax?: string;
  }>(),
  { min: 0, max: 100, step: 1 },
);

const emit = defineEmits<{
  'update:modelValue': [value: V];
  change: [value: V];
}>();

const THUMB = 18;

const root = ref<HTMLElement>();
const inputs = ref<HTMLInputElement[]>([]);

// The thumb that lies on top. Thumbs on the same spot would otherwise block
// each other, so it follows the pointer.
const front = ref<0 | 1>(1);

const values = computed<number[]>(() => {
  const value = props.modelValue as number | [number, number];
  const [lo, hi = lo] = Array.isArray(value) ? value : [value];

  return props.range ? [lo, hi] : [lo];
});

const thumbs = computed(() =>
  values.value.map((value, index) => ({
    value,
    label: !props.range
      ? props.ariaLabel
      : index === 0
        ? props.ariaLabelMin
        : props.ariaLabelMax,
  })),
);

function fraction(value: number): number {
  const span = props.max - props.min;

  return span > 0 ? Math.min(1, Math.max(0, (value - props.min) / span)) : 0;
}

const fill = computed(() => {
  const last = values.value.length - 1;

  return {
    '--site-slider-lo': props.range ? fraction(values.value[0]) : 0,
    '--site-slider-hi': fraction(values.value[last]),
  };
});

function next(index: number, raw: number): number[] {
  if (!props.range) {
    return [raw];
  }

  const [lo, hi] = values.value;

  return index === 0 ? [Math.min(raw, hi), hi] : [lo, Math.max(raw, lo)];
}

function toValue(list: number[]): V {
  return (props.range ? [list[0], list[1]] : list[0]) as V;
}

// Native inputs move on their own. This puts them back on the model, for a
// thumb that ran into the other one or a parent that kept its old value.
function sync() {
  inputs.value.forEach((input) => {
    const value = String(values.value[Number(input.dataset.index)]);

    if (input.value !== value) {
      input.value = value;
    }
  });
}

function onInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const list = next(index, Number(input.value));

  input.value = String(list[index]);
  emit('update:modelValue', toValue(list));
  nextTick(sync);
}

function onChange(index: number, event: Event) {
  const input = event.target as HTMLInputElement;

  emit('change', toValue(next(index, Number(input.value))));
}

function pointerValue(event: PointerEvent): number {
  const rect = root.value!.getBoundingClientRect();
  const ratio = (event.clientX - rect.left - THUMB / 2) / (rect.width - THUMB);
  const raw =
    props.min + Math.min(1, Math.max(0, ratio)) * (props.max - props.min);
  const stepped =
    props.min + Math.round((raw - props.min) / props.step) * props.step;
  const digits = (String(props.step).split('.')[1] ?? '').length;

  return Math.min(props.max, Number(stepped.toFixed(digits)));
}

function nearest(event: PointerEvent): 0 | 1 {
  const rect = root.value!.getBoundingClientRect();
  const x = (event.clientX - rect.left - THUMB / 2) / (rect.width - THUMB);
  const [lo, hi] = values.value.map(fraction);

  if (lo === hi) {
    return x < lo ? 0 : 1;
  }

  return Math.abs(x - lo) <= Math.abs(x - hi) ? 0 : 1;
}

function onPointerMove(event: PointerEvent) {
  if (props.range && event.buttons === 0) {
    front.value = nearest(event);
  }
}

// A press on the bare track of a range moves the nearest thumb there.
function onPointerDown(event: PointerEvent) {
  if (!props.range || props.disabled || event.target !== root.value) {
    return;
  }

  const index = nearest(event);
  const value = toValue(next(index, pointerValue(event)));

  front.value = index;
  emit('update:modelValue', value);
  emit('change', value);
  inputs.value.find((input) => Number(input.dataset.index) === index)?.focus();
}
</script>

<template>
  <span
    ref="root"
    class="site-slider"
    :class="{ 'is-range': range, 'is-disabled': disabled }"
    :style="fill"
    @pointermove="onPointerMove"
    @pointerdown="onPointerDown"
  >
    <input
      v-for="(thumb, index) in thumbs"
      :key="index"
      ref="inputs"
      type="range"
      class="site-slider-input"
      :class="{ 'is-front': range && front === index }"
      :min="min"
      :max="max"
      :step="step"
      :value="thumb.value"
      :disabled="disabled"
      :data-index="index"
      :aria-label="thumb.label"
      @input="onInput(index, $event)"
      @change="onChange(index, $event)"
    />
  </span>
</template>

<style scoped lang="scss">
$thumb: 18px;

@mixin thumb {
  width: $thumb;
  height: $thumb;
  box-sizing: border-box;
  border: 1px solid var(--db-btn-border);
  border-radius: 50%;
  background: var(--db-knob);
  cursor: pointer;
  pointer-events: auto;
  transition:
    border-color 0.12s,
    box-shadow 0.12s;
}

@mixin thumb-hover {
  border-color: var(--db-hover-border);
  box-shadow: 0 0 0 6px color-mix(in srgb, var(--db-brand) 16%, transparent);
}

@mixin thumb-focus {
  border-color: var(--db-brand);
  outline: 2px solid var(--db-brand);
  outline-offset: 2px;
}

.site-slider {
  position: relative;
  display: block;
  width: 100%;
  height: 20px;
  isolation: isolate;
  touch-action: pan-y;

  // The track, and on top of it the filled part. Thumb centres travel from
  // half a thumb inside the left edge to half a thumb inside the right edge.
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 8px;
    height: 4px;
    border-radius: 2px;
    pointer-events: none;
  }

  &::before {
    left: 0;
    right: 0;
    background: var(--db-switch-bg);
  }

  &::after {
    left: 0;
    right: calc(
      (1 - var(--site-slider-hi)) * (100% - #{$thumb}) + #{$thumb} / 2
    );
    background: var(--db-brand);
  }

  &.is-range::after {
    left: calc(var(--site-slider-lo) * (100% - #{$thumb}) + #{$thumb} / 2);
  }

  &.is-range {
    cursor: pointer;
  }

  &.is-disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &-input {
    position: absolute;
    inset: 0;
    z-index: 1;
    width: 100%;
    height: 20px;
    margin: 0;
    padding: 0;
    outline: none;
    background: transparent;
    cursor: pointer;
    appearance: none;

    &.is-front {
      z-index: 2;
    }

    &:disabled {
      cursor: not-allowed;
    }

    &::-webkit-slider-runnable-track {
      height: 20px;
      background: transparent;
    }

    &::-moz-range-track {
      height: 20px;
      background: transparent;
    }

    &::-webkit-slider-thumb {
      @include thumb;
      margin-top: 1px;
      appearance: none;
    }

    &::-moz-range-thumb {
      @include thumb;
    }

    &:not(:disabled):hover::-webkit-slider-thumb {
      @include thumb-hover;
    }

    &:not(:disabled):hover::-moz-range-thumb {
      @include thumb-hover;
    }

    &:focus-visible::-webkit-slider-thumb {
      @include thumb-focus;
    }

    &:focus-visible::-moz-range-thumb {
      @include thumb-focus;
    }

    &:disabled::-webkit-slider-thumb {
      cursor: not-allowed;
    }

    &:disabled::-moz-range-thumb {
      cursor: not-allowed;
    }
  }

  // In range mode only the thumbs take the pointer, so the lower input stays
  // reachable under the upper one.
  &.is-range &-input {
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    &-input::-webkit-slider-thumb {
      transition: none;
    }

    &-input::-moz-range-thumb {
      transition: none;
    }
  }
}
</style>
