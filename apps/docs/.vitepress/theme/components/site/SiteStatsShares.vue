<script setup lang="ts">
/**
 * A share as one segmented bar with a legend: the largest names get a
 * segment and a color each, the small ones go together as Other and are
 * spelled out under the legend. Used for the API versions and the output
 * formats.
 */
import { computed } from 'vue';
import type { StatsShare } from '@theme/composables/useStatsCharts';

const props = defineProps<{
  title: string;
  lead: string;
  items: StatsShare[];
}>();

/** Names below this share go into Other. */
const SMALL = 1.5;
const MAX = 4;
const COLORS = ['is-sun', 'is-ink', 'is-coral', 'is-mint'];

function format(share: number): string {
  return share >= 10 ? `${share.toFixed(1)}%` : `${share.toFixed(2)}%`;
}

const split = computed(() => {
  const main = props.items.filter((item) => item.share >= SMALL).slice(0, MAX);
  const rest = props.items.filter((item) => !main.includes(item));

  return { main, rest };
});

const segments = computed(() => {
  const list = split.value.main.map((item, index) => ({
    name: item.name,
    share: item.share,
    color: COLORS[index],
  }));
  const other = split.value.rest.reduce((sum, item) => sum + item.share, 0);

  if (other > 0) {
    list.push({ name: 'Other', share: other, color: 'is-muted' });
  }

  return list;
});

const label = computed(() =>
  segments.value
    .map((segment) => `${segment.name} ${segment.share.toFixed(1)} percent`)
    .join(', '),
);
</script>

<template>
  <div class="site-stats-shares">
    <h3 class="site-h3">{{ title }}</h3>
    <p class="site-text site-stats-shares-lead">{{ lead }}</p>
    <div class="site-stats-shares-bar" role="img" :aria-label="label">
      <span
        v-for="segment in segments"
        :key="segment.name"
        :class="segment.color"
        :style="{ flex: `${Math.max(segment.share, 3)} 1 0` }"
        >{{ segment.share >= 12 ? format(segment.share) : '' }}</span
      >
    </div>
    <ul class="site-stats-shares-legend">
      <li v-for="segment in segments" :key="segment.name">
        <span class="site-stats-shares-swatch" :class="segment.color"></span>
        <span class="site-stats-shares-name">{{ segment.name }}</span>
        <span class="site-stats-shares-value">{{ format(segment.share) }}</span>
      </li>
    </ul>
    <p v-if="split.rest.length" class="site-text site-stats-shares-other">
      Other:
      {{
        split.rest
          .map((item) => `${item.name} ${format(item.share)}`)
          .join(', ')
      }}
    </p>
  </div>
</template>

<style scoped lang="scss">
.site-stats-shares {
  min-width: 0;

  &-lead {
    margin-top: 6px;
  }

  /* One bar of segments, the ends round. */
  &-bar {
    display: flex;
    gap: 4px;
    height: 72px;
    margin-top: 20px;

    > span {
      display: flex;
      align-items: center;
      justify-content: center;
      min-width: 0;
      overflow: hidden;
      border-radius: 10px;
      font-family: var(--db-font-display);
      font-size: clamp(16px, 1.8vw, 24px);
      line-height: 1;
      font-weight: 800;
    }

    > :first-child {
      border-radius: 36px 10px 10px 36px;
    }

    > :last-child {
      border-radius: 10px 36px 36px 10px;
    }

    > :only-child {
      border-radius: 36px;
    }
  }

  &-legend {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin-top: 16px;

    > li {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      line-height: 24px;
    }
  }

  &-swatch {
    width: 14px;
    height: 14px;
    border-radius: 5px;
  }

  &-name {
    font-family: var(--db-font-mono);
    font-weight: 600;
  }

  &-value {
    color: var(--db-ink-2);
  }

  &-other {
    margin-top: 10px;
  }

  .is-sun {
    background: var(--db-sun);
    color: var(--db-on);
  }

  .is-ink {
    background: var(--db-ink);
    color: var(--db-paper);
  }

  .is-coral {
    background: var(--db-coral);
    color: var(--db-on);
  }

  .is-mint {
    background: var(--db-mint-light);
    color: var(--db-on);
  }

  .is-muted {
    background: var(--db-muted);
    color: var(--db-paper);
  }
}
</style>
