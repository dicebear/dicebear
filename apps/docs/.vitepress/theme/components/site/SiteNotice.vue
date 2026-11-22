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
@use '../../styles/tone';
@use '../../styles/mixins' as m;

/* A small box in the tone that fits the message, like the callouts of the
   docs. */
.site-notice {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 20px 24px;
  border-radius: var(--db-radius-6);

  &-info {
    @include tone.tone('sky');
  }

  &-warn {
    @include tone.tone('sun');
  }

  &-error {
    @include tone.tone('coral');
  }

  &-success {
    @include tone.tone('mint');
  }

  &-titled {
    flex-direction: column;
    gap: 6px;
  }

  &-title {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-family: var(--db-font-display);
    font-size: 18px;
    line-height: 26px;
    font-weight: 700;
    color: var(--db-accent);
  }

  // Centered on the first line of the text.
  &-icon {
    flex-shrink: 0;
    margin-top: 4px;
    color: var(--db-accent);
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

    :deep(a) {
      @include m.link-inline;
    }
  }

  &-compact {
    gap: 10px;
    padding: 12px 16px;
    border-radius: var(--db-radius-4);
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
