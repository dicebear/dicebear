<script setup lang="ts" generic="T">
/**
 * A segmented control for two to six options, built as a radio group. One
 * segment is always chosen. Tab reaches the chosen segment, and the arrow
 * keys move the choice. An option with an icon shows only the icon, its
 * label becomes the name and the tooltip. A `tip` adds a tooltip below the
 * segment, and the `option` slot draws a segment's content in place of the
 * label or icon.
 */
import { computed, ref, type Component } from 'vue';

const props = withDefaults(
  defineProps<{
    options: readonly {
      value: T;
      label: string;
      icon?: Component;
      tip?: string;
    }[];
    ariaLabel?: string;
    size?: 'sm' | 'md' | 'lg';
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
    class="site-seg site-segmented"
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
      class="site-pill site-pill-tab site-segmented-item"
      :class="{ 'is-icon': option.icon }"
      :aria-checked="index === chosen"
      :aria-label="option.icon ? option.label : undefined"
      :data-tip="option.tip ?? (option.icon ? option.label : undefined)"
      :data-tip-side="option.tip ? 'bottom' : undefined"
      :tabindex="index === tabStop ? 0 : -1"
      :disabled="disabled"
      :data-index="index"
      @click="pick(index)"
      @keydown="onKeydown($event, index)"
    >
      <slot name="option" :option="option" :chosen="index === chosen">
        <component
          :is="option.icon"
          v-if="option.icon"
          :size="size === 'lg' ? 20 : 16"
          aria-hidden="true"
        />
        <span v-else class="site-segmented-label">{{ option.label }}</span>
      </slot>
    </button>
  </span>
</template>

<style scoped lang="scss">
/* The track and the segments are the shared `site-seg` and `site-pill-tab`;
   this adds the square icon segment and the small and large sizes. The
   track is as high as a field or a button of the same size: sm 36, md 44,
   lg 56. */
.site-segmented {
  &-item {
    &[aria-checked='true'] {
      cursor: default;
    }

    &.is-icon {
      width: 36px;
      padding: 0;
    }
  }

  &-label {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &.is-sm {
    border-radius: 18px;
  }

  &.is-sm &-item {
    height: 28px;
    padding: 0 12px;
    border-radius: 14px;
    font-size: 14px;

    &.is-icon {
      width: 28px;
      padding: 0;
    }
  }

  &.is-lg {
    border-radius: 28px;
  }

  &.is-lg &-item {
    height: 48px;
    padding: 0 22px;
    border-radius: 24px;
    font-size: 17px;

    &.is-icon {
      width: 48px;
      padding: 0;
    }
  }
}
</style>
