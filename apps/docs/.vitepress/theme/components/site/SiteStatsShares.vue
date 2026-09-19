<script setup lang="ts">
/**
 * A share list: one bar per name, the longest bar full width, the number
 * beside it. Used for the API versions and the output formats.
 */
import { computed } from 'vue';
import type { StatsShare } from '@theme/composables/useStatsCharts';

const props = defineProps<{
  title: string;
  lead: string;
  items: StatsShare[];
}>();

const max = computed(() =>
  Math.max(...props.items.map((item) => item.share), 0.01),
);

function format(share: number): string {
  return share >= 10 ? `${share.toFixed(1)}%` : `${share.toFixed(2)}%`;
}
</script>

<template>
  <div class="site-stats-shares">
    <h3 class="site-h3">{{ title }}</h3>
    <p class="site-text site-stats-shares-lead">{{ lead }}</p>
    <div class="site-stats-shares-list">
      <div v-for="item in items" :key="item.name" class="site-stats-shares-row">
        <span class="site-stats-shares-name">{{ item.name }}</span>
        <div class="site-stats-shares-track">
          <div
            class="site-stats-shares-bar"
            :style="{ width: `${Math.max(0.5, (100 * item.share) / max)}%` }"
          ></div>
        </div>
        <span class="site-stats-shares-value">{{ format(item.share) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-stats-shares {
  min-width: 0;

  &-lead {
    margin-top: 8px;
    color: var(--db-muted);
  }

  &-list {
    display: flex;
    flex-direction: column;
    margin-top: 24px;
    border-bottom: 1px solid var(--db-line);
  }

  &-row {
    display: grid;
    grid-template-columns: 72px minmax(0, 1fr) 72px;
    gap: 16px;
    align-items: center;
    height: 48px;
    border-top: 1px solid var(--db-line);
    font-family: var(--db-font-mono);
    font-size: 14px;
    line-height: 20px;
  }

  &-name {
    color: var(--db-ink);
  }

  &-track {
    height: 8px;
    border-radius: 4px;
    background: var(--db-line);
    overflow: hidden;
  }

  &-bar {
    height: 8px;
    border-radius: 4px;
    background: var(--db-brand);
  }

  &-value {
    text-align: right;
    color: var(--db-ink-2);
    font-variant-numeric: tabular-nums;
  }
}
</style>
