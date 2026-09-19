<script setup lang="ts">
/**
 * The button that names the current style or preset and opens its picker. The
 * `thumb` slot holds the 52px thumbnail.
 */
import { ChevronDown } from '@lucide/vue';

defineProps<{
  title: string;
  hint?: string;
}>();

defineSlots<{
  thumb?: () => unknown;
}>();
</script>

<template>
  <button type="button" class="pg-picker-trigger hv-outline" aria-haspopup="dialog">
    <span class="pg-picker-trigger-thumb">
      <slot name="thumb" />
    </span>
    <span class="pg-picker-trigger-text">
      <span class="pg-picker-trigger-title">{{ title }}</span>
      <span v-if="hint" class="pg-picker-trigger-hint">{{ hint }}</span>
    </span>
    <ChevronDown :size="18" aria-hidden="true" class="pg-picker-trigger-chevron" />
  </button>
</template>

<style scoped lang="scss">
.pg-picker-trigger {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  min-width: 0;
  height: 76px;
  padding: 0 16px 0 12px;
  border: 1px solid var(--db-btn-border);
  border-radius: var(--db-radius-4);
  background: var(--db-paper);
  font: inherit;
  color: var(--db-ink);
  text-align: left;
  cursor: pointer;

  &:focus-visible {
    outline: 2px solid var(--db-brand);
    outline-offset: 2px;
  }

  &-thumb {
    flex-shrink: 0;
    display: block;
    width: 52px;
    height: 52px;

    :deep(.pg-thumb) {
      border-radius: var(--db-radius-3);
    }
  }

  &-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &-title {
    font-size: 16px;
    line-height: 24px;
    font-weight: 700;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-hint {
    font-size: 13px;
    line-height: 18px;
    color: var(--db-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &-chevron {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--db-muted);
  }
}
</style>
