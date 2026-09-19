<script setup lang="ts" generic="T extends string">
/**
 * A native select with a drawn chevron. The native element keeps keyboard
 * handling and the phone pickers. Its own arrow is hidden because every
 * browser places and draws it differently.
 */
import { ChevronDown } from '@lucide/vue';

defineProps<{
  options: { label: string; value: T }[];
  label: string;
  fluid?: boolean;
}>();

const model = defineModel<T>({ required: true });
</script>

<template>
  <span class="site-select" :class="{ 'is-fluid': fluid }">
    <select v-model="model" class="site-select-input" :aria-label="label">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
    <ChevronDown :size="16" aria-hidden="true" class="site-select-icon" />
  </span>
</template>

<style scoped lang="scss">
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
    height: 36px;
    padding: 0 38px 0 12px;
    border: 1px solid var(--db-btn-border);
    border-radius: var(--db-radius-2);
    background: var(--db-panel);
    font: inherit;
    font-size: 15px;
    color: var(--db-ink);
    cursor: pointer;
    appearance: none;
    transition: border-color var(--duration-fast);

    &:hover {
      border-color: var(--db-muted);
    }

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
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
