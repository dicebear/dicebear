<script setup lang="ts">
/**
 * A text field with a search icon in front of it. The parent sets the width
 * with a class on the root.
 */
import { Search } from '@lucide/vue';

withDefaults(
  defineProps<{
    placeholder: string;
    label: string;
    size?: 'md' | 'lg';
    fluid?: boolean;
  }>(),
  { size: 'md' },
);

const model = defineModel<string>({ required: true });
</script>

<template>
  <span class="site-search" :class="[`is-${size}`, { 'is-fluid': fluid }]">
    <Search :size="16" aria-hidden="true" class="site-search-icon" />
    <input
      v-model="model"
      type="search"
      class="site-search-input"
      :placeholder="placeholder"
      :aria-label="label"
    />
  </span>
</template>

<style scoped lang="scss">
@use '../../styles/control' as c;

.site-search {
  @include c.control;
  @include c.control-size(md);

  display: inline-flex;
  align-items: center;
  gap: 10px;
  width: 280px;
  max-width: 100%;

  &.is-lg {
    @include c.control-size(lg);
  }

  &.is-fluid {
    display: flex;
    width: 100%;
  }

  &-icon {
    flex-shrink: 0;
    color: var(--db-muted);
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
    color: var(--db-ink);

    &::placeholder {
      color: var(--db-muted);
    }

    // The field already shows an icon, and the clear button would crowd it.
    &::-webkit-search-cancel-button {
      display: none;
    }
  }
}
</style>
