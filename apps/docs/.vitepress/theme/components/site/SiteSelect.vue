<script setup lang="ts" generic="T extends string">
/**
 * A native select with a drawn chevron. The native element keeps keyboard
 * handling and the phone pickers. Its own arrow is hidden because every
 * browser places and draws it differently.
 */
import { ChevronDown } from '@lucide/vue';

withDefaults(
  defineProps<{
    options: { label: string; value: T }[];
    label: string;
    fluid?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { size: 'md' },
);

const model = defineModel<T>({ required: true });
</script>

<template>
  <span class="site-select" :class="[`is-${size}`, { 'is-fluid': fluid }]">
    <select v-model="model" class="site-select-input" :aria-label="label">
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
    <ChevronDown :size="16" aria-hidden="true" class="site-select-icon" />
  </span>
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

.site-select {
  position: relative;
  display: inline-flex;

  &.is-fluid {
    display: flex;
    width: 100%;

    .site-select-input {
      width: 100%;
    }
  }

  &-input {
    @include c.control;
    @include c.control-size(md);

    padding-right: 38px;
    cursor: pointer;
    appearance: none;

    &:focus-visible {
      border-color: var(--db-brand);
      outline: 2px solid var(--db-brand);
      outline-offset: 0;
    }

    &:disabled {
      @include c.control-disabled;
    }
  }

  &.is-sm &-input {
    @include c.control-size(sm);

    padding-right: 32px;
  }

  &.is-lg &-input {
    @include c.control-size(lg);

    padding-right: 44px;
  }

  &-icon {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    color: var(--db-muted);
    pointer-events: none;
  }
}
</style>
