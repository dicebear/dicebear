<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue';
import UiWindow from './UiWindow.vue';

defineProps<{
  title?: string;
  playgroundUrl?: string;
}>();
</script>

<template>
  <UiWindow :title="title ?? 'Preview'" class="ui-demo-frame">
    <template #header-actions>
      <a
        v-if="playgroundUrl"
        :href="playgroundUrl"
        class="ui-demo-frame-action"
      >
        Open in Playground
        <ArrowUpRight :size="14" />
      </a>
      <slot name="actions" />
    </template>

    <div class="ui-demo-frame-body">
      <slot />
    </div>
  </UiWindow>
</template>

<style lang="scss" scoped>
.ui-demo-frame-body {
  padding: 24px;
  /* A faint dot grid, so the frame reads as a stage for the demo. */
  background-image: radial-gradient(var(--db-line) 1px, transparent 1px);
  background-size: 16px 16px;
  background-position: center;

  @media (max-width: 767px) {
    padding: 16px;
  }
}

/* The built-in link and whatever the `actions` slot brings look the same,
   which is why the slotted twin is listed alongside. */
.ui-demo-frame-action,
:slotted(.ui-demo-frame-action) {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0;
  border: 0;
  background: none;
  font-family: inherit;
  font-size: 14px;
  line-height: 20px;
  font-weight: 500;
  color: var(--db-brand-text);
  text-decoration: none;
  cursor: pointer;

  &:hover:not(:disabled) {
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
}
</style>
