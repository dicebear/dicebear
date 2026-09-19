<script setup lang="ts">
/**
 * A single-line text field. The frame is a wrapper, so an icon can sit in
 * front of the native input and an action button behind it. `class` and
 * `style` go to the frame, every other attribute goes to the input.
 */
import { computed, ref, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
    invalid?: boolean;
    fluid?: boolean;
  }>(),
  { size: 'md' },
);

const model = defineModel<string>({ default: '' });

const attrs = useAttrs();
const input = ref<HTMLInputElement>();

const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;

  return rest;
});

defineExpose({
  focus: () => input.value?.focus(),
});
</script>

<template>
  <span
    class="site-field"
    :class="[
      `is-${size}`,
      { 'is-fluid': fluid, 'is-invalid': invalid },
      attrs.class,
    ]"
    :style="attrs.style as string"
  >
    <span v-if="$slots.icon" class="site-field-icon" aria-hidden="true">
      <slot name="icon" />
    </span>
    <input
      ref="input"
      v-model="model"
      type="text"
      class="site-field-input"
      :aria-invalid="invalid || undefined"
      v-bind="inputAttrs"
    />
    <span v-if="$slots.action" class="site-field-action">
      <slot name="action" />
    </span>
  </span>
</template>

<style scoped lang="scss">
.site-field {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 280px;
  max-width: 100%;
  height: 44px;
  padding: 0 14px;
  box-sizing: border-box;
  border: 1px solid var(--db-btn-border);
  border-radius: 10px;
  background: var(--db-panel);
  color: var(--db-muted);
  transition: border-color 0.12s;

  &:hover:not(:focus-within) {
    border-color: var(--db-hover-border);
  }

  &.is-sm {
    gap: 8px;
    height: 36px;
    padding: 0 10px;
    border-radius: var(--db-radius-2);
  }

  &.is-lg {
    height: 48px;
    border-radius: var(--db-radius-3);
  }

  &.is-fluid {
    display: flex;
    width: 100%;
  }

  &:focus-within {
    border-color: var(--db-brand);
  }

  &:has(.site-field-input:focus-visible) {
    outline: 2px solid var(--db-brand);
    outline-offset: 0;
  }

  &.is-invalid,
  &.is-invalid:hover {
    border-color: var(--db-danger);

    &:has(.site-field-input:focus-visible) {
      outline-color: var(--db-danger);
    }
  }

  &:has(.site-field-input:disabled) {
    background: var(--db-soft);
    cursor: not-allowed;
  }

  &-icon {
    display: flex;
    flex-shrink: 0;
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
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink);

    &::placeholder {
      color: var(--db-muted);
    }

    &:disabled {
      color: var(--db-muted);
      cursor: not-allowed;
    }

    // The field brings its own clear action when it needs one.
    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  &.is-lg &-input {
    font-size: 16px;
    line-height: 26px;
  }

  // Below 16px iOS zooms into a focused field.
  @media (max-width: 767px) {
    &-input {
      font-size: 16px;
    }
  }

  &-action {
    display: flex;
    flex-shrink: 0;
    margin-right: -8px;

    :deep(button) {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: 0;
      border-radius: var(--db-radius-2);
      background: transparent;
      color: var(--db-muted);
      cursor: pointer;
      transition:
        background-color 0.12s,
        color 0.12s;

      &:hover {
        background: var(--db-soft);
        color: var(--db-ink);
      }

      &:focus-visible {
        outline-offset: 0;
      }
    }
  }

  &.is-sm &-action {
    margin-right: -6px;

    :deep(button) {
      width: 28px;
      height: 28px;
    }
  }
}
</style>
