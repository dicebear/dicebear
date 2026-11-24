<script setup lang="ts">
/**
 * A row of an accordion on the native `<details>`. `lg` is the large row of
 * a section, in the item title size and led by a die; `sm` the row inside a
 * block. Rows that share a `name` form a group in which only one is open.
 * Rows stack with the 2px rule of their ground between them; wrap them in
 * `site-disclosures` for the closing line.
 */
import { ChevronDown } from '@lucide/vue';
import SiteDie from './SiteDie.vue';

withDefaults(
  defineProps<{
    title?: string;
    size?: 'lg' | 'sm';
    die?: number;
    /** Rows with the same name close each other. */
    name?: string;
    /** Render the content only while open. */
    lazy?: boolean;
  }>(),
  {
    title: undefined,
    size: 'sm',
    die: undefined,
    name: undefined,
    lazy: false,
  },
);

defineSlots<{
  default?: () => unknown;
  /** Replaces the title text. */
  title?: () => unknown;
}>();

const open = defineModel<boolean>('open', { default: false });

function onToggle(event: Event) {
  open.value = (event.currentTarget as HTMLDetailsElement).open;
}
</script>

<template>
  <details
    class="site-disclosure"
    :class="`is-${size}`"
    :name="name"
    :open="open"
    @toggle="onToggle"
  >
    <summary class="site-disclosure-summary">
      <SiteDie v-if="die" :face="die" />
      <span class="site-disclosure-title">
        <slot name="title">{{ title }}</slot>
      </span>
      <ChevronDown
        :size="size === 'lg' ? 24 : 18"
        aria-hidden="true"
        class="site-disclosure-chevron"
      />
    </summary>

    <div v-if="!lazy || open" class="site-disclosure-content">
      <slot />
    </div>
  </details>
</template>

<style scoped lang="scss">
.site-disclosure {
  border-top: 2px solid var(--db-rule);

  &-summary {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 8px 0;
    color: var(--db-ink);
    list-style: none;
    cursor: pointer;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }

    &:focus-visible {
      outline-offset: 2px;
      border-radius: var(--db-radius-1);
    }

    /* The title underlines on hover, like the title of a row that links. */
    &:hover .site-disclosure-title {
      text-decoration: underline;
      text-decoration-thickness: 2px;
      text-underline-offset: 4px;
    }
  }

  &-title {
    flex: 1;
    min-width: 0;
    font-family: var(--db-font-display);
    font-weight: 700;
  }

  &-chevron {
    flex-shrink: 0;
    transition: transform var(--duration-fast) var(--ease-smooth);
  }

  &[open] > &-summary &-chevron {
    transform: rotate(180deg);
  }

  &.is-sm > &-summary {
    min-height: 56px;
  }

  &.is-sm > &-summary &-title {
    font-size: 19px;
    line-height: 26px;
  }

  &.is-sm > &-content {
    padding: 0 0 20px;
    font-size: 17px;
    line-height: 28px;
    color: var(--db-ink-2);
  }

  &.is-lg > &-summary {
    min-height: 88px;
    padding: 16px 0;
  }

  &.is-lg > &-summary &-title {
    font-size: clamp(26px, 2.8vw, 40px);
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -0.015em;
    color: var(--db-accent);
  }

  &.is-lg > &-content {
    padding: 4px 0 clamp(28px, 3vw, 40px);
  }
}
</style>
