<script setup lang="ts">
/**
 * The usage section: the monthly API requests of the last year as one line,
 * labeled at both ends, and the two numbers of the latest complete month.
 * All of it comes from the public stats endpoint after mount. Until then the
 * section keeps its height and shows no numbers.
 */
import { computed, ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import {
  aggregateMonthly,
  formatMonthKey,
  useApiStatsRaw,
} from '@theme/composables/useApiStats';
import {
  seriesAreaPath,
  seriesCoords,
  seriesLinePath,
} from '@theme/utils/chartGeometry';

const MAX_MONTHS = 12;
const DOT_RADIUS = 6;
const PAD_TOP = 38;
const PAD_BOTTOM = 8;

const usage = {
  title: 'Used by thousands',
  lead: 'Apps and websites draw their avatars with DiceBear, through the HTTP API or one of the packages.',
};

const stats = useApiStatsRaw();

/** Complete months only. A month that starts or ends mid-way would read as a dip. */
const months = computed(() => {
  const requests = stats.value?.requests;

  if (!requests) {
    return [];
  }

  const firstDay = Object.keys(requests).sort()[0] ?? '';
  const all = aggregateMonthly(requests).slice(0, -1);

  return (firstDay.endsWith('-01') ? all : all.slice(1)).slice(-MAX_MONTHS);
});

/** Axis labels and chart ends: 760M, 1.35B. */
function compact(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }

  if (value >= 1e6) {
    return `${Math.round(value / 1e6)}M`;
  }

  return value.toLocaleString('en-US');
}

/** Numbers at display size read as words: 1.35 billion, 1.3 million. */
function spell(value: number): string {
  const trim = (n: number) => String(Number(n.toFixed(2)));

  if (value >= 1e9) {
    return `${trim(value / 1e9)} billion`;
  }

  if (value >= 1e6) {
    return `${trim(value / 1e6)} million`;
  }

  return value.toLocaleString('en-US');
}

function monthLabel(key: string, month: 'short' | 'long'): string {
  return formatMonthKey(key, { month, year: 'numeric' });
}

const ends = computed(() => {
  const first = months.value[0];
  const last = months.value[months.value.length - 1];

  return first && last && first !== last ? { first, last } : null;
});

/** Downloads across every registry in the month the requests end with. */
const downloads = computed(() => {
  const key = ends.value?.last.key;
  const registries = stats.value?.downloads;

  if (!key || !registries) {
    return 0;
  }

  return Object.values(registries).reduce(
    (sum, daily) =>
      sum +
      (aggregateMonthly(daily ?? {}).find((m) => m.key === key)?.total ?? 0),
    0,
  );
});

const figures = computed(() => {
  if (!ends.value) {
    return [];
  }

  const month = monthLabel(ends.value.last.key, 'long');

  return [
    { value: spell(ends.value.last.total), label: `requests in ${month}` },
    { value: spell(downloads.value), label: `package downloads in ${month}` },
  ].filter((figure) => figure.value !== '0');
});

/* The chart is drawn in real pixels, so the line and the dots keep their size. */

const chart = ref<HTMLElement>();
const { width, height } = useElementSize(chart);

const coords = computed(() =>
  width.value > 0
    ? seriesCoords(
        months.value.map((month) => month.total),
        {
          width: width.value,
          height: height.value,
          padX: DOT_RADIUS,
          padTop: PAD_TOP,
          padBottom: PAD_BOTTOM,
        },
      )
    : [],
);

const linePath = computed(() => seriesLinePath(coords.value));
const areaPath = computed(() =>
  seriesAreaPath(coords.value, height.value - PAD_BOTTOM),
);
const dots = computed(() =>
  coords.value.length > 0
    ? [coords.value[0], coords.value[coords.value.length - 1]]
    : [],
);

const chartLabel = computed(() => {
  if (!ends.value) {
    return 'Monthly API requests';
  }

  const { first, last } = ends.value;
  const verb = last.total > first.total ? 'rising' : 'going';

  return `Monthly API requests from ${monthLabel(first.key, 'long')} to ${monthLabel(last.key, 'long')}, ${verb} from ${spell(first.total)} to ${spell(last.total)}`;
});
</script>

<template>
  <section class="home-wrap home-usage">
    <h2 class="site-headline">{{ usage.title }}</h2>
    <p class="site-lead home-usage-lead">{{ usage.lead }}</p>

    <div ref="chart" class="home-usage-chart">
      <svg
        v-if="coords.length > 0"
        :width="width"
        :height="height"
        :viewBox="`0 0 ${width} ${height}`"
        fill="none"
        role="img"
        :aria-label="chartLabel"
      >
        <path :d="areaPath" class="home-usage-area" />
        <path :d="linePath" class="home-usage-line" />
        <circle
          v-for="(dot, index) in dots"
          :key="index"
          :cx="dot.x"
          :cy="dot.y"
          :r="DOT_RADIUS"
          class="home-usage-dot"
        />
      </svg>
    </div>
    <div class="home-usage-ends">
      <template v-if="ends">
        <span class="home-usage-end">
          <strong>{{ compact(ends.first.total) }}</strong>
          {{ monthLabel(ends.first.key, 'short') }}
        </span>
        <span class="home-usage-end">
          {{ monthLabel(ends.last.key, 'short') }}
          <strong>{{ compact(ends.last.total) }}</strong>
        </span>
      </template>
    </div>

    <div class="home-usage-figures">
      <div
        v-for="figure in figures"
        :key="figure.label"
        class="home-usage-figure"
      >
        <span class="home-usage-value">{{ figure.value }}</span>
        <span class="site-body">{{ figure.label }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.home-usage {
  padding-top: 168px;

  &-lead {
    max-width: 760px;
    margin-top: 32px;
  }

  &-chart {
    height: 240px;
    margin-top: 64px;

    svg {
      display: block;
    }
  }

  &-area {
    fill: var(--db-brand);
    fill-opacity: 0.1;
  }

  &-line {
    stroke: var(--db-brand);
    stroke-width: 2.5;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  &-dot {
    fill: var(--db-brand);
  }

  &-ends {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    min-height: 28px;
    margin-top: 16px;
  }

  &-end {
    display: inline-flex;
    align-items: baseline;
    gap: 12px;
    font-size: 16px;
    line-height: 26px;
    color: var(--db-muted);

    strong {
      font-size: 20px;
      line-height: 28px;
      font-weight: 600;
      color: var(--db-ink);
    }
  }

  &-figures {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px 48px;
    min-height: 52px;
    margin-top: 40px;
    padding-top: 32px;
    border-top: 1px solid var(--db-line);
  }

  &-figure {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 24px;
  }

  &-value {
    font-size: 48px;
    line-height: 52px;
    font-weight: 700;
    letter-spacing: -0.04em;
    color: var(--db-ink);
    white-space: nowrap;
  }

  @media (max-width: 767px) {
    padding-top: 96px;

    &-lead {
      margin-top: 24px;
    }

    &-chart {
      height: 160px;
      margin-top: 40px;
    }

    &-end {
      gap: 8px;
      font-size: 14px;
      line-height: 20px;

      strong {
        font-size: 16px;
        line-height: 26px;
      }
    }

    &-figures {
      grid-template-columns: minmax(0, 1fr);
      margin-top: 32px;
      padding-top: 24px;
    }

    &-value {
      font-size: 32px;
      line-height: 36px;
    }
  }
}
</style>
