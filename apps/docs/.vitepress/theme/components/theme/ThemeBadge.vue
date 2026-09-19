<script setup lang="ts">
/** The inline badge of Markdown pages, registered globally as `Badge`. */
withDefaults(
  defineProps<{
    text?: string;
    type?: 'info' | 'tip' | 'warning' | 'danger';
  }>(),
  { text: undefined, type: 'tip' },
);
</script>

<template>
  <span class="theme-badge" :class="`theme-badge-${type}`">
    <slot>{{ text }}</slot>
  </span>
</template>

<style lang="scss" scoped>
.theme-badge {
  display: inline-flex;
  align-items: center;
  height: 22px;
  margin-left: 6px;
  padding: 0 8px;
  border-radius: var(--db-radius-1);
  background: var(--db-tint);
  color: var(--db-tint-text);
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0;
  vertical-align: middle;
  white-space: nowrap;
}

.theme-badge-info {
  background: var(--db-soft);
  color: var(--db-muted);
}

.theme-badge-warning {
  background: var(--db-warn-soft);
  color: var(--db-warn);
}

.theme-badge-danger {
  background: var(--db-danger-soft);
  color: var(--db-danger);
}
</style>
