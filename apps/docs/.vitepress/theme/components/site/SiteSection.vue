<script setup lang="ts">
/**
 * A section of a page. With a tone it is a color block, without one it sits
 * on the page in the content column.
 *
 * - `split`: the title and a short text in a column on the left, the
 *   content on the right.
 * - `stack`: the title and the lead side by side across the top, the
 *   content below.
 *
 * The id is the anchor a sub-navigation points at.
 */
import { computed } from 'vue';

export type SiteTone =
  'soft' | 'panel' | 'sun' | 'coral' | 'sky' | 'lilac' | 'mint';

const props = withDefaults(
  defineProps<{
    id?: string;
    title: string;
    /** The text under or beside the title. */
    hint?: string;
    tone?: SiteTone;
    layout?: 'split' | 'stack';
    /** Title size; defaults to the large one when stacked. */
    size?: 'xl' | 'l';
  }>(),
  {
    id: undefined,
    hint: undefined,
    tone: undefined,
    layout: 'split',
    size: undefined,
  },
);

defineSlots<{
  default?: () => unknown;
  /** Replaces the hint, for text with links. */
  hint?: () => unknown;
  /** Below the hint: links or actions that belong to the title. */
  aside?: () => unknown;
}>();

const titleClass = computed(() =>
  (props.size ?? (props.layout === 'stack' ? 'xl' : 'l')) === 'xl'
    ? 'site-headline'
    : 'site-h2',
);
</script>

<template>
  <section
    :id="id"
    class="site-section"
    :class="[
      `is-${layout}`,
      tone ? ['site-box', 'is-block', `is-${tone}`] : 'site-container',
    ]"
  >
    <div :class="layout === 'split' ? 'site-split' : 'site-section-stack'">
      <div
        class="site-section-head"
        :class="{ 'site-pair': layout === 'stack' && ($slots.hint || hint) }"
      >
        <h2 :class="titleClass">{{ title }}</h2>
        <div
          v-if="$slots.hint || hint || $slots.aside"
          class="site-section-hint"
        >
          <div
            v-if="$slots.hint || hint"
            :class="layout === 'stack' ? 'site-lead' : 'site-body'"
          >
            <slot name="hint">{{ hint }}</slot>
          </div>
          <slot name="aside" />
        </div>
      </div>
      <div v-if="$slots.default" class="site-section-body">
        <slot />
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* The space a sticky sub-navigation may take under the header. */
.site-section {
  --site-section-top: calc(var(--db-header-h) + 96px);

  scroll-margin-top: var(--site-section-top);

  &.site-container {
    padding-top: clamp(56px, 6.4vw, 96px);
    padding-bottom: clamp(56px, 6.4vw, 96px);
  }

  &-head:not(.site-pair) {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  &-hint {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  &.is-split &-head {
    position: sticky;
    top: var(--site-section-top);
  }

  &-stack > &-body {
    margin-top: clamp(32px, 4vw, 56px);
  }

  &-body {
    display: flex;
    flex-direction: column;
    gap: 40px;
    min-width: 0;
  }

  @media (max-width: 959px) {
    &.is-split &-head {
      position: static;
    }
  }
}
</style>
