<script setup lang="ts">
/**
 * A framed stage for a demo, built like a figure in a book. The frame holds
 * the default slot and carries no header. The title and the `header-actions`
 * slot sit in a caption row underneath.
 */
defineProps<{
  title?: string;
}>();
</script>

<template>
  <figure class="ui-window">
    <div class="ui-window-body">
      <slot />
    </div>
    <figcaption
      v-if="title || $slots['header-actions']"
      class="ui-window-caption"
    >
      <span v-if="title" class="ui-window-title">{{ title }}</span>
      <div class="ui-window-caption-actions">
        <slot name="header-actions" />
      </div>
    </figcaption>
  </figure>
</template>

<style lang="scss" scoped>
.ui-window {
  margin: 0;
  min-width: 0;

  &-body {
    position: relative;
    border: 1px solid var(--db-line);
    border-radius: 14px;
    background: var(--db-panel);
    overflow: hidden;
  }

  &-caption {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 12px 2px 0;
  }

  &-title {
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: var(--db-ink);
  }

  &-caption-actions {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-left: auto;
  }
}
</style>
