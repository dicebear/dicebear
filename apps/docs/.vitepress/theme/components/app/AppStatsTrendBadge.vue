<script setup lang="ts">
import { computed } from 'vue';
import { formatGrowth, growthDirection } from '../../utils/statsTrends';

// One rendering for the trend of a style, shared by the ranking table, the
// trending cards, and the style pages: a "New" pill when the style has no
// baseline yet, a muted dot when there is no usable growth value, otherwise
// the growth percentage with a direction arrow. `variant` picks between
// colored text (tables) and a filled pill (cards).
const props = withDefaults(
  defineProps<{
    growth: number | null;
    isNew: boolean;
    variant?: 'text' | 'pill';
  }>(),
  { variant: 'text' },
);

const direction = computed(() => growthDirection(props.growth));
</script>

<template>
  <span
    v-if="isNew"
    class="app-stats-trend-badge app-stats-trend-badge--new"
    :class="`app-stats-trend-badge--${variant}`"
  >
    New
  </span>
  <span
    v-else-if="growth === null"
    class="app-stats-trend-badge app-stats-trend-badge--none"
  >
    {{ formatGrowth(null) }}
  </span>
  <span
    v-else
    class="app-stats-trend-badge"
    :class="[
      `app-stats-trend-badge--${variant}`,
      `app-stats-trend-badge--${direction}`,
    ]"
  >
    <span
      v-if="direction !== 'flat'"
      class="app-stats-trend-badge-arrow"
      aria-hidden="true"
      >{{ direction === 'up' ? '▲' : '▼' }}</span
    >
    {{ formatGrowth(growth) }}
  </span>
</template>

<style lang="scss" scoped>
.app-stats-trend-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-variant-numeric: tabular-nums;

  &--none {
    font-weight: 500;
    color: var(--vp-c-text-3);
  }

  &-arrow {
    font-size: 9px;
  }

  &--text {
    font-weight: 500;

    &.app-stats-trend-badge--up {
      color: var(--vp-c-green-1);
    }

    &.app-stats-trend-badge--down {
      color: var(--vp-c-red-1);
    }

    &.app-stats-trend-badge--flat {
      color: var(--vp-c-text-3);
    }

    &.app-stats-trend-badge--new {
      padding: 2px 8px;
      border-radius: 999px;
      font-size: 12px;
      font-weight: 600;
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-brand-1);
    }
  }

  &--pill {
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 13px;
    font-weight: 700;

    &.app-stats-trend-badge--up,
    &.app-stats-trend-badge--flat {
      background: color-mix(in srgb, var(--vp-c-green-1) 14%, transparent);
      color: var(--vp-c-green-1);
    }

    &.app-stats-trend-badge--down {
      background: color-mix(in srgb, var(--vp-c-red-1) 14%, transparent);
      color: var(--vp-c-red-1);
    }

    &.app-stats-trend-badge--new {
      background: var(--vp-c-brand-soft);
      color: var(--vp-c-brand-1);
    }
  }
}
</style>
