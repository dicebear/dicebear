<script setup lang="ts">
/**
 * A figure: the number large, its unit at half its size, a label and an
 * optional note under it. It takes the colors of the box it sits in.
 *
 * - `xl`: the one figure a page opens with.
 * - `lg`: a figure in a tile.
 * - `sm`: a small figure in a card.
 */
withDefaults(
  defineProps<{
    value: string;
    unit?: string;
    label?: string;
    note?: string;
    size?: 'xl' | 'lg' | 'sm';
  }>(),
  { unit: '', label: undefined, note: undefined, size: 'lg' },
);
</script>

<template>
  <div class="site-stat" :class="`is-${size}`">
    <p class="site-stat-value">
      {{ value }}<span v-if="unit" class="site-stat-unit">{{ unit }}</span>
    </p>
    <p v-if="label" class="site-stat-label">{{ label }}</p>
    <p v-if="note" class="site-stat-note">{{ note }}</p>
  </div>
</template>

<style scoped lang="scss">
.site-stat {
  min-width: 0;

  &-value {
    font-family: var(--db-font-display);
    font-size: clamp(44px, 5vw, 72px);
    line-height: 0.95;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--db-accent);
    font-variant-numeric: tabular-nums;
  }

  &-unit {
    margin-left: 0.2em;
    font-size: 0.5em;
    letter-spacing: -0.01em;
  }

  &-label {
    margin-top: 12px;
    font-family: var(--db-font-display);
    font-size: clamp(17px, 1.5vw, 20px);
    line-height: 1.4;
    font-weight: 600;
    color: var(--db-accent);
  }

  &-note {
    margin-top: 6px;
    font-size: 15px;
    line-height: 24px;
    color: var(--db-ink-2);
  }

  &.is-xl &-value {
    font-size: clamp(96px, 17vw, 248px);
    line-height: 0.82;
    letter-spacing: -0.045em;
  }

  &.is-xl &-label {
    margin-top: clamp(16px, 2vw, 28px);
    font-size: clamp(22px, 2.4vw, 34px);
    line-height: 1.2;
    font-weight: 700;
  }

  &.is-xl &-note {
    margin-top: 8px;
    font-size: clamp(16px, 1.3vw, 19px);
    line-height: 1.5;
  }

  &.is-sm &-value {
    font-size: clamp(24px, 2.4vw, 34px);
    line-height: 1.1;
    letter-spacing: -0.02em;
  }

  &.is-sm &-label {
    margin-top: 4px;
    font-family: var(--db-font-mono);
    font-size: 15px;
    line-height: 22px;
    color: var(--db-ink-2);
  }
}
</style>
