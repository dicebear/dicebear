<script setup lang="ts">
/**
 * A collapsible row on the native `<details>`. `section` is the large group
 * heading of the playground options, `row` the smaller entry inside a group.
 * Every disclosure stands alone. A consumer that wants only one open at a time
 * drives `v-model:open` itself.
 */
import { ChevronDown } from '@lucide/vue';

withDefaults(
  defineProps<{
    title?: string;
    size?: 'section' | 'row';
    /** Render the content only while open. */
    lazy?: boolean;
  }>(),
  { title: undefined, size: 'row', lazy: false },
);

defineSlots<{
  default?: () => unknown;
  /** Replaces the title text. */
  title?: () => unknown;
  /** Extra summary content such as a count. */
  summary?: () => unknown;
}>();

const open = defineModel<boolean>('open', { default: false });

function onToggle(event: Event) {
  open.value = (event.currentTarget as HTMLDetailsElement).open;
}
</script>

<template>
  <details
    class="site-disclosure"
    :class="`site-disclosure-${size}`"
    :open="open"
    @toggle="onToggle"
  >
    <summary class="site-disclosure-summary hv-row">
      <span class="site-disclosure-title">
        <slot name="title">{{ title }}</slot>
      </span>
      <span v-if="$slots.summary" class="site-disclosure-extra">
        <slot name="summary" />
      </span>
      <ChevronDown
        :size="size === 'section' ? 20 : 18"
        aria-hidden="true"
        class="site-disclosure-chevron hv-chev"
      />
    </summary>

    <div v-if="!lazy || open" class="site-disclosure-content">
      <slot />
    </div>
  </details>
</template>

<style scoped lang="scss">
.site-disclosure {
  border-top: 1px solid var(--db-line);

  &-summary {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--db-ink);
    list-style: none;
    cursor: pointer;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }

    &:focus-visible {
      outline-offset: -2px;
      border-radius: var(--db-radius-1);
    }
  }

  &-title {
    min-width: 0;
  }

  &-extra {
    display: flex;
    align-items: center;
    color: var(--db-muted);
  }

  &-chevron {
    flex-shrink: 0;
    margin-left: auto;
    color: var(--db-muted);
    transition:
      transform var(--duration-fast) var(--ease-smooth),
      color 0.12s;
  }

  &[open] > &-summary &-chevron {
    transform: rotate(180deg);
  }

  // Group heading: the count sits next to the title.
  &-section > &-summary {
    padding: 20px 0;
  }

  &-section > &-summary &-title {
    font-size: 20px;
    line-height: 28px;
    font-weight: 700;
    letter-spacing: -0.01em;
  }

  &-section > &-summary &-extra {
    font-size: 14px;
    line-height: 20px;
  }

  // Entry inside a group: the count moves to the right, before the chevron.
  &-row > &-summary {
    min-height: 52px;
    padding: 0 4px;
  }

  &-row > &-summary &-title {
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
  }

  &-row > &-summary &-extra {
    margin-left: auto;
    font-family: var(--db-font-mono);
    font-size: 13px;
    line-height: 18px;
  }

  &-row > &-summary &-extra + &-chevron {
    margin-left: 0;
  }

  &-section > &-content {
    padding-bottom: 20px;
  }

  &-row > &-content {
    padding: 4px 4px 24px;
  }
}
</style>
