<script setup lang="ts">
/**
 * A checkbox drawn on the native input. With label content it renders its
 * own label around the box. Without it only the input renders, for a place
 * inside an existing label. `class` and `style` go to the root, every other
 * attribute goes to the input.
 */
import { computed, nextTick, useAttrs } from 'vue';

defineOptions({ inheritAttrs: false });

defineProps<{
  disabled?: boolean;
  indeterminate?: boolean;
}>();

const model = defineModel<boolean>({ default: false });

const attrs = useAttrs();

const inputAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs;

  return rest;
});

function onChange(event: Event) {
  const input = event.target as HTMLInputElement;

  model.value = input.checked;

  // A parent that keeps its old value gets the box back in that state.
  nextTick(() => (input.checked = model.value));
}
</script>

<template>
  <label
    v-if="$slots.default"
    class="site-checkbox"
    :class="[{ 'is-disabled': disabled }, attrs.class]"
    :style="attrs.style as string"
  >
    <input
      type="checkbox"
      class="site-checkbox-input"
      :checked="model"
      :disabled="disabled"
      :indeterminate.prop="indeterminate"
      v-bind="inputAttrs"
      @change="onChange"
    />
    <span class="site-checkbox-label"><slot /></span>
  </label>
  <input
    v-else
    type="checkbox"
    class="site-checkbox-input"
    :checked="model"
    :disabled="disabled"
    :indeterminate.prop="indeterminate"
    v-bind="attrs"
    @change="onChange"
  />
</template>

<style scoped lang="scss">
.site-checkbox {
  display: inline-flex;
  align-items: flex-start;
  gap: 10px;
  font-size: 15px;
  line-height: 24px;
  color: var(--db-ink);
  cursor: pointer;

  &.is-disabled {
    color: var(--db-muted);
    cursor: not-allowed;
  }

  // Centres the 18px box on the first text line.
  .site-checkbox-input {
    margin-top: 3px;
  }

  &-label {
    min-width: 0;
  }
}

.site-checkbox-input {
  position: relative;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  margin: 0;
  box-sizing: border-box;
  border: 1px solid var(--db-btn-border);
  border-radius: 5px;
  background: var(--db-panel);
  cursor: pointer;
  appearance: none;
  transition:
    background-color 0.12s,
    border-color 0.12s;

  // The check mark, and the dash of the indeterminate state.
  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 5.5px;
    width: 5px;
    height: 9px;
    box-sizing: border-box;
    border: solid var(--db-paper);
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
    opacity: 0;
  }

  &:hover:not(:disabled) {
    border-color: var(--db-hover-border);
  }

  &:checked,
  &:indeterminate,
  &:checked:hover,
  &:indeterminate:hover {
    border-color: var(--db-brand);
    background: var(--db-brand);

    &::after {
      opacity: 1;
    }
  }

  &:indeterminate::after {
    top: 7px;
    left: 3px;
    width: 10px;
    height: 2px;
    border-width: 0 0 2px;
    transform: none;
  }

  &:focus-visible {
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
}
</style>
