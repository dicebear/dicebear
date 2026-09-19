<script setup lang="ts">
/**
 * An inline notice in the look of the docs callouts. With a `title` the icon
 * and the title form a colored row above the text. Without one the icon sits
 * to the left of the text.
 */
import { computed, type Component } from 'vue';
import { CircleAlert, CircleCheck, Info, TriangleAlert } from '@lucide/vue';

type Tone = 'info' | 'warn' | 'error' | 'success';

const props = withDefaults(
  defineProps<{
    tone?: Tone;
    title?: string;
    /** 14/20 text instead of 16/26. */
    compact?: boolean;
  }>(),
  { tone: 'info', title: undefined, compact: false },
);

defineSlots<{
  default?: () => unknown;
}>();

const icons: Record<Tone, Component> = {
  info: Info,
  warn: TriangleAlert,
  error: CircleAlert,
  success: CircleCheck,
};

const icon = computed(() => icons[props.tone]);
</script>

<template>
  <div
    class="site-notice"
    :class="[
      `site-notice-${tone}`,
      { 'site-notice-compact': compact, 'site-notice-titled': !!title },
    ]"
    :role="tone === 'error' ? 'alert' : 'note'"
  >
    <p v-if="title" class="site-notice-title">
      <component :is="icon" :size="18" aria-hidden="true" />
      {{ title }}
    </p>
    <component
      :is="icon"
      v-else
      :size="compact ? 16 : 18"
      aria-hidden="true"
      class="site-notice-icon"
    />
    <div class="site-notice-body">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-notice {
  --site-notice-color: var(--db-brand-text);

  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 18px 20px;
  border: 1px solid var(--db-line);
  border-radius: 14px;
  background: var(--db-paper);

  &-warn {
    --site-notice-color: var(--db-warn);
  }

  &-error {
    --site-notice-color: var(--db-danger);
  }

  &-success {
    --site-notice-color: var(--db-ok);
  }

  &-titled {
    flex-direction: column;
    gap: 8px;
  }

  &-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 15px;
    line-height: 24px;
    font-weight: 600;
    color: var(--site-notice-color);
  }

  // Centered on the first line of the text.
  &-icon {
    flex-shrink: 0;
    margin-top: 4px;
    color: var(--site-notice-color);
  }

  &-body {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-ink-2);
    overflow-wrap: anywhere;

    :deep(p + p) {
      margin-top: 8px;
    }

    :deep(strong) {
      color: var(--db-ink);
    }
  }

  &-compact {
    gap: 10px;
    padding: 12px 14px;
  }

  &-compact &-icon {
    margin-top: 2px;
  }

  &-compact &-body {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
