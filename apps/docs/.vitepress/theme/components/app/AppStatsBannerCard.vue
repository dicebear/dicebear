<script setup lang="ts">
import { computed, useId } from 'vue';
import { UiCard } from '../ui';
import {
  aggregateMonthly,
  formatMonthKey,
  type MonthlyEntry,
} from '../../composables/useApiStats';
import {
  seriesAreaPath,
  seriesCoords,
  seriesLinePath,
} from '../../utils/chartGeometry';

interface Chart {
  line: string;
  area: string;
  points: Array<{ x: number; y: number }>;
  labels: string[];
}

interface Trend {
  pct: string;
  prevMonth: string;
}

const HISTORY_MONTHS = 4;

const props = defineProps<{
  href: string;
  feature?: boolean;
  value: string;
  unit: string;
  title: string;
  description: string;
  daily?: Record<string, number>;
}>();

const fillId = useId();

const history = computed<MonthlyEntry[]>(() => {
  if (!props.daily) {
    return [];
  }

  return aggregateMonthly(props.daily).slice(0, -1).slice(-HISTORY_MONTHS);
});

// Anchored at 0 so a low month reads as "fewer", not as a phantom drop to zero.
const chart = computed<Chart>(() => {
  const h = history.value;
  const points = seriesCoords(
    h.map((m) => m.total),
    { width: 200, height: 60, padTop: 14, padBottom: 10 },
  );

  if (points.length === 0) {
    return { line: '', area: '', points: [], labels: [] };
  }

  return {
    line: seriesLinePath(points),
    area: seriesAreaPath(points, 60),
    points,
    labels: h.map((m) =>
      formatMonthKey(m.key, { month: 'short' }).toUpperCase(),
    ),
  };
});

// Positive-only by design: the pill hides on missing data or non-positive change.
const trend = computed<Trend | null>(() => {
  const h = history.value;

  if (h.length < 2) {
    return null;
  }

  const last = h[h.length - 1];
  const prev = h[h.length - 2];

  if (prev.total === 0 || last.total <= prev.total) {
    return null;
  }

  return {
    pct: (((last.total - prev.total) / prev.total) * 100).toFixed(1),
    prevMonth: formatMonthKey(prev.key, { month: 'long' }),
  };
});
</script>

<template>
  <UiCard
    padding="xl"
    :href="href"
    :class="['st-card', feature && 'st-card-feature']"
  >
    <div class="st-stat">
      {{ value }}<span class="st-unit">{{ unit }}</span>
    </div>
    <div class="st-meta">
      <strong>{{ title }}</strong>
      <span>{{ description }}</span>
    </div>
    <div class="st-trend">
      <span v-if="trend" class="st-trend-pill">
        ↑ {{ trend.pct }}% vs {{ trend.prevMonth }}
      </span>
      <div v-if="chart.points.length" class="st-chart">
        <svg viewBox="0 0 200 60" preserveAspectRatio="none" aria-hidden="true">
          <defs>
            <linearGradient :id="fillId" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0"
                stop-color="var(--vp-c-brand-1)"
                stop-opacity=".25"
              />
              <stop
                offset="1"
                stop-color="var(--vp-c-brand-1)"
                stop-opacity="0"
              />
            </linearGradient>
          </defs>
          <path :d="chart.area" :fill="`url(#${fillId})`" />
          <path
            :d="chart.line"
            fill="none"
            stroke="var(--vp-c-brand-1)"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <div class="st-chart-dots">
          <span
            v-for="(p, i) in chart.points"
            :key="i"
            :style="{
              left: `${(p.x / 200) * 100}%`,
              top: `${(p.y / 60) * 100}%`,
            }"
          />
        </div>
        <div class="st-chart-labels">
          <span v-for="label in chart.labels" :key="label">{{ label }}</span>
        </div>
      </div>
    </div>
  </UiCard>
</template>

<style lang="scss" scoped>
.st-card {
  min-height: 320px;

  :deep(.ui-card-body) {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  // Use compound selector to beat UiCard's `.ui-card` rule in cascade
  // (both selectors otherwise have identical specificity).
  &.st-card-feature {
    background: linear-gradient(
      160deg,
      color-mix(in srgb, var(--vp-c-brand-1) 8%, transparent),
      var(--vp-c-bg-elv) 50%
    );
    border-color: color-mix(in srgb, var(--vp-c-brand-1) 40%, transparent);
  }
}

.st-stat {
  font-size: 84px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: -0.045em;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.st-unit {
  font-size: 44px;
  font-weight: 700;
  color: var(--vp-c-brand-1);
  margin-left: 4px;
  letter-spacing: -0.02em;
}

.st-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;

  strong {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.015em;
    color: var(--vp-c-text-1);
  }

  span {
    font-size: 13.5px;
    line-height: 1.5;
    color: var(--vp-c-text-2);
    max-width: 260px;
  }
}

.st-trend {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.st-trend-pill {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  background: color-mix(in srgb, var(--vp-c-green-1) 16%, transparent);
  color: var(--vp-c-green-1);
}

.st-chart {
  position: relative;
  height: 80px;

  svg {
    width: 100%;
    height: 60px;
    display: block;
  }
}

.st-chart-dots {
  position: absolute;
  inset: 0 0 20px 0;
  pointer-events: none;

  span {
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--vp-c-brand-1);
    transform: translate(-50%, -50%);
    box-shadow: 0 0 0 2px var(--vp-c-bg-elv);
  }
}

.st-chart-labels {
  display: flex;
  justify-content: space-between;
  margin-top: 6px;
  font-family: var(--vp-font-family-mono);
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
}

@media (max-width: 640px) {
  .st-stat {
    font-size: 64px;
  }

  .st-unit {
    font-size: 34px;
  }
}
</style>
