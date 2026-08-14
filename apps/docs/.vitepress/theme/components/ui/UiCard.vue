<script setup lang="ts">
import { computed, useSlots } from 'vue';

type Padding = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const props = withDefaults(
  defineProps<{
    href?: string;
    target?: string;
    flush?: boolean;
    title?: string;
    padding?: Padding;
  }>(),
  { padding: 'md' },
);

const slots = useSlots();

// Treat only non-empty hrefs as actual links; an empty string from a
// loading-state computed should not silently degrade to a non-interactive div.
const hasHref = computed(
  () => typeof props.href === 'string' && props.href.length > 0,
);
const tag = computed(() => (hasHref.value ? 'a' : 'div'));
const hasHeader = computed(
  () =>
    Boolean(props.title) ||
    Boolean(slots.header) ||
    Boolean(slots['header-actions']),
);
</script>

<template>
  <component
    :is="tag"
    class="ui-card"
    :class="[
      `ui-card--padding-${padding}`,
      {
        'ui-card--flush': flush,
        'ui-card--interactive': hasHref,
      },
    ]"
    :href="hasHref ? href : undefined"
    :target="hasHref ? target : undefined"
    :rel="hasHref && target === '_blank' ? 'noopener noreferrer' : undefined"
  >
    <header v-if="hasHeader" class="ui-card-header">
      <slot name="header">
        <h3 class="ui-card-title">{{ title }}</h3>
        <slot name="header-actions" />
      </slot>
    </header>
    <div class="ui-card-body">
      <slot />
    </div>
  </component>
</template>

<style lang="scss">
:root {
  /* Elevated surface shared with UiWindow / attribution boxes (both themes).
     Previously dark cards used --vp-c-bg-soft, which made them differ from the
     elevated demo-frame; unified here so every framed box shares one fill. */
  --ui-card-bg: var(--ui-window-bg);
  --ui-card-border-color: var(--ui-window-border-color);
  --ui-card-hover-border-color: var(--vp-c-brand-1);
  --ui-card-radius: var(--vp-radius-sm);
  --ui-card-padding: 1.125rem;
}
</style>

<style lang="scss" scoped>
.ui-card {
  display: block;
  background: var(--ui-card-bg);
  border: 1px solid var(--ui-card-border-color);
  border-radius: var(--ui-card-radius);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition:
    border-color var(--duration-fast) var(--ease-smooth),
    transform var(--duration-mid) var(--ease-spring),
    box-shadow var(--duration-mid) var(--ease-smooth);
  position: relative;
  overflow: hidden;

  &--interactive {
    cursor: pointer;
  }

  &--interactive:hover {
    border-color: var(--ui-card-hover-border-color);
    transform: translateY(-4px);
    box-shadow: var(--vp-shadow-2);
  }

  &--interactive:focus-visible {
    outline: 2px solid var(--ui-card-hover-border-color);
    outline-offset: 2px;
  }

  &-header {
    display: flex;
    align-items: baseline;
    gap: 16px;
    padding: var(--ui-card-padding);
    border-bottom: 1px solid var(--ui-card-border-color);
  }

  &-title {
    flex: 1;
    margin: 0 !important;
    font-size: 1.125rem;
    font-weight: 600;
    line-height: 1.4;
    border: none;
    padding: 0;
  }

  &-body {
    padding: var(--ui-card-padding);
  }

  &--flush .ui-card-body {
    padding: 0;
  }

  /* Padding scale: overrides the default --ui-card-padding token.
     Consumers can still override --ui-card-padding via scoped CSS
     (e.g. responsive media queries). */
  &--padding-sm {
    --ui-card-padding: 1rem; /* 16px */
  }
  &--padding-md {
    --ui-card-padding: 1.125rem; /* 18px, matches Aura accordion */
  }
  &--padding-lg {
    --ui-card-padding: 1.5rem; /* 24px */
  }
  &--padding-xl {
    --ui-card-padding: 2rem; /* 32px */
  }
  &--padding-2xl {
    --ui-card-padding: 3rem; /* 48px */
  }
}

/* Suppress VitePress external-link icon when UiCard renders as <a>. */
a.ui-card::after {
  display: none !important;
}
</style>
