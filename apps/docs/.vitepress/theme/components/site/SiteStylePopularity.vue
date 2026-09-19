<script setup lang="ts">
/**
 * How much the style is used on the hosted API: rank, websites and trend as
 * facts, and the last twelve weeks as a line. Renders nothing until the
 * stats have loaded, and nothing at all for a style without traffic.
 */
import { computed } from 'vue';
import { kebabCase } from 'change-case';
import { ArrowRight } from '@lucide/vue';
import {
  SPARK_WEEKS,
  useStyleRankings,
} from '@theme/composables/useStyleRankings';
import { formatGrowth, growthDirection } from '@theme/utils/statsTrends';
import {
  seriesAreaPath,
  seriesCoords,
  seriesLinePath,
} from '@theme/utils/chartGeometry';

const props = defineProps<{
  styleName: string;
}>();

const { rankings, rankingByName, currentWeekLabel } = useStyleRankings();

const row = computed(
  () => rankingByName.value?.[kebabCase(props.styleName)] ?? null,
);
const totalRanked = computed(() => rankings.value?.length ?? 0);

const direction = computed(() =>
  row.value ? growthDirection(row.value.growth) : 'flat',
);

const WIDTH = 880;
const HEIGHT = 200;

const chart = computed(() => {
  const coords = seriesCoords(row.value?.spark ?? [], {
    width: WIDTH,
    height: HEIGHT,
    padX: 6,
    padTop: 16,
    padBottom: 28,
  });
  if (coords.length === 0) {
    return null;
  }
  const last = coords[coords.length - 1];
  return {
    line: seriesLinePath(coords),
    area: seriesAreaPath(coords, HEIGHT - 28),
    last,
  };
});
</script>

<template>
  <div v-if="row" class="site-style-popularity">
    <div class="site-facts">
      <div class="site-fact">
        <b>Rank</b>
        <span>
          #{{ row.rank }} of the {{ totalRanked }} styles requested in the week
          of {{ currentWeekLabel }}
        </span>
      </div>
      <div class="site-fact">
        <b>Websites</b>
        <span>
          {{ row.websites.toLocaleString('en') }} requested this style that
          week, {{ row.share.toFixed(1) }}% of all
        </span>
      </div>
      <div class="site-fact">
        <b>Trend</b>
        <span>
          <span class="site-style-popularity-trend" :class="`is-${direction}`">
            {{ row.isNew ? 'New' : formatGrowth(row.growth) }}
          </span>
          against the four weeks before
        </span>
      </div>
    </div>
    <div v-if="chart" class="site-style-popularity-chart">
      <span class="site-label"
        >Websites per week, last {{ SPARK_WEEKS }} weeks</span
      >
      <svg
        class="site-style-popularity-svg"
        :viewBox="`0 0 ${WIDTH} ${HEIGHT}`"
        preserveAspectRatio="none"
        role="img"
        :aria-label="`Websites per week over the last ${SPARK_WEEKS} weeks`"
      >
        <path :d="chart.area" class="site-style-popularity-area" />
        <path :d="chart.line" class="site-style-popularity-line" />
        <circle
          :cx="chart.last.x"
          :cy="chart.last.y"
          r="5"
          class="site-style-popularity-dot"
        />
      </svg>
      <div class="site-style-popularity-axis">
        <span class="site-small">{{ SPARK_WEEKS }} weeks ago</span>
        <span class="site-small">Week of {{ currentWeekLabel }}</span>
      </div>
      <a href="/stats/" class="site-style-popularity-link hv-link">
        Style rankings and trends
        <ArrowRight :size="16" />
      </a>
    </div>
  </div>
</template>

<style scoped lang="scss">
.site-style-popularity {
  display: flex;
  flex-direction: column;
  gap: 40px;
  min-width: 0;

  &-trend {
    font-weight: 600;
    color: var(--db-ink);

    &.is-up {
      color: var(--db-ok);
    }

    &.is-down {
      color: var(--db-danger);
    }
  }

  &-chart {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* The chart only: the arrow icon in the link below is an svg too. */
  &-svg {
    display: block;
    width: 100%;
    height: 200px;
    overflow: visible;
  }

  &-area {
    fill: var(--db-brand);
    fill-opacity: 0.08;
  }

  &-line {
    fill: none;
    stroke: var(--db-brand);
    stroke-width: 2;
    stroke-linejoin: round;
    stroke-linecap: round;
    vector-effect: non-scaling-stroke;
  }

  &-dot {
    fill: var(--db-brand);
    stroke: var(--db-paper);
    stroke-width: 2;
  }

  &-axis {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }

  &-link {
    display: inline-flex;
    align-items: center;
    align-self: flex-start;
    gap: 6px;
    margin-top: 8px;
    font-size: 15px;
    line-height: 24px;
    font-weight: 500;
    color: var(--db-brand-text);
  }
}
</style>
