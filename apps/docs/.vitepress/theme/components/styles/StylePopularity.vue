<script setup lang="ts">
import { computed, useId } from 'vue';
import { kebabCase } from 'change-case';
import { UiCard } from '../ui';
import AppStatsTrendBadge from '../app/AppStatsTrendBadge.vue';
import {
  SPARK_WEEKS,
  useStyleRankings,
} from '../../composables/useStyleRankings';
import {
  seriesAreaPath,
  seriesCoords,
  seriesLinePath,
} from '../../utils/chartGeometry';

const props = defineProps<{
  styleName: string;
}>();

const { rankings, rankingByName, currentWeekLabel } = useStyleRankings();

const row = computed(
  () => rankingByName.value?.[kebabCase(props.styleName)] ?? null,
);

const totalRanked = computed(() => rankings.value?.length ?? 0);

const fillId = useId();

// The area closes on the bottom viewBox edge; the card clips it, which lets
// the fill bleed to the border.
const chart = computed(() => {
  const coords = seriesCoords(row.value?.spark ?? [], {
    width: 200,
    height: 48,
    padTop: 7,
    padBottom: 1,
  });

  if (coords.length === 0) {
    return null;
  }

  return { line: seriesLinePath(coords), area: seriesAreaPath(coords, 48) };
});
</script>

<template>
  <UiCard v-if="row" class="style-popularity-section" title="Popularity" flush>
    <template #header-actions>
      <span v-if="currentWeekLabel" class="style-popularity-week">
        Week of {{ currentWeekLabel }}
      </span>
    </template>

    <div class="style-popularity-tiles">
      <div class="style-popularity-tile">
        <span class="ui-eyebrow">Rank</span>
        <span class="style-popularity-tile-value">#{{ row.rank }}</span>
        <span class="style-popularity-tile-caption">
          of {{ totalRanked }} styles
        </span>
      </div>
      <div class="style-popularity-tile">
        <span class="ui-eyebrow">Websites</span>
        <span class="style-popularity-tile-value">
          {{ row.websites.toLocaleString('en') }}
        </span>
        <span class="style-popularity-tile-caption">requesting this style</span>
      </div>
      <div class="style-popularity-tile">
        <span class="ui-eyebrow">Trend</span>
        <span class="style-popularity-tile-value">
          <AppStatsTrendBadge
            :growth="row.growth"
            :is-new="row.isNew"
            variant="pill"
          />
        </span>
        <span class="style-popularity-tile-caption">
          vs. the four weeks before
        </span>
      </div>
    </div>

    <div v-if="chart" class="style-popularity-chart">
      <div class="style-popularity-chart-head">
        <span class="ui-eyebrow">Last {{ SPARK_WEEKS }} weeks</span>
        <a href="/stats/">Style rankings and trends</a>
      </div>
      <svg viewBox="0 0 200 48" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient :id="fillId" x1="0" y1="0" x2="0" y2="1">
            <stop
              offset="0"
              stop-color="var(--vp-c-brand-1)"
              stop-opacity=".22"
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
          vector-effect="non-scaling-stroke"
        />
      </svg>
    </div>
  </UiCard>
</template>

<style lang="scss" scoped>
.style-popularity-section {
  margin-bottom: 16px;
}

.style-popularity-week {
  font-size: 13px;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

.style-popularity-tiles {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.style-popularity-tile {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px var(--ui-card-padding);

  & + & {
    border-left: 1px solid var(--ui-card-border-color);
  }
}

.style-popularity-tile-value {
  display: flex;
  align-items: center;
  min-height: 34px;
  font-size: 26px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  font-variant-numeric: tabular-nums;
}

.style-popularity-tile-caption {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}

.style-popularity-chart {
  border-top: 1px solid var(--ui-card-border-color);

  svg {
    display: block;
    width: 100%;
    height: 64px;
  }
}

.style-popularity-chart-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  padding: 12px var(--ui-card-padding) 2px;

  a {
    font-size: 13px;
  }
}

@media (max-width: 640px) {
  .style-popularity-tiles {
    grid-template-columns: 1fr;
  }

  .style-popularity-tile + .style-popularity-tile {
    border-left: none;
    border-top: 1px solid var(--ui-card-border-color);
  }
}
</style>
