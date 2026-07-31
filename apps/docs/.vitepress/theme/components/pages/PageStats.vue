<script setup lang="ts">
import { computed, ref } from 'vue';
import { UiSection, UiContainer, UiSectionHeader, UiCard } from '../ui';
import AppSmallHero from '../app/AppSmallHero.vue';
import AppStatsChart from '../app/AppStatsChart.vue';
import AppStatsMultiLineChart from '../app/AppStatsMultiLineChart.vue';
import AppStatsMap from '../app/AppStatsMap.vue';
import {
  useApiStatsRaw,
  lastCompleteMonth,
} from '../../composables/useApiStats';
import { formatNumber, formatBytes } from '../../utils/format';

const SECONDS_PER_DAY = 86400;
const ROLLING_WINDOW_DAYS = 7;
const TOP_STYLES = 10;

const stats = useApiStatsRaw();

function fmtDay(d: Date): string {
  return d.toLocaleDateString('en', { month: 'short', day: 'numeric' });
}

function weekStartKey(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const dow = d.getUTCDay();
  const offset = (dow + 6) % 7;

  d.setUTCDate(d.getUTCDate() - offset);

  return d.toISOString().slice(0, 10);
}

function fmtWeekRange(weekStartStr: string): string {
  const start = new Date(weekStartStr);
  const end = new Date(start.getTime() + 6 * SECONDS_PER_DAY * 1000);

  if (start.getMonth() === end.getMonth()) {
    return `${fmtDay(start)}–${end.getDate()}`;
  }

  return `${fmtDay(start)} – ${fmtDay(end)}`;
}

function completeWeeks(dayKeys: string[], weekOrder: string[]): string[] {
  if (weekOrder.length === 0) {
    return weekOrder;
  }

  const firstDow = new Date(`${dayKeys[0]}T00:00:00Z`).getUTCDay();
  const lastDow = new Date(
    `${dayKeys[dayKeys.length - 1]}T00:00:00Z`,
  ).getUTCDay();
  const start = firstDow !== 1 ? 1 : 0;
  const end = lastDow !== 0 ? weekOrder.length - 1 : weekOrder.length;

  return weekOrder.slice(start, end);
}

function aggregateWeekly(data: Record<string, number>): {
  labels: string[];
  values: number[];
} {
  const dayKeys = Object.keys(data).sort();

  if (dayKeys.length === 0) {
    return { labels: [], values: [] };
  }

  const sums: Record<string, number> = {};
  const weekOrder: string[] = [];

  for (const dayKey of dayKeys) {
    const wk = weekStartKey(dayKey);

    if (sums[wk] === undefined) {
      sums[wk] = 0;
      weekOrder.push(wk);
    }

    sums[wk] += data[dayKey];
  }

  const weeks = completeWeeks(dayKeys, weekOrder);

  return {
    labels: weeks.map((k) => fmtWeekRange(k)),
    values: weeks.map((week) => sums[week]),
  };
}

const requestsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return aggregateWeekly(stats.value.requests);
});

const downloadsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return aggregateWeekly(stats.value.downloads.npm);
});

function buildSeries(source: Record<string, [string, number][]>): {
  labels: string[];
  series: Array<{ name: string; values: number[] }>;
} | null {
  const dayKeys = Object.keys(source).sort();

  if (dayKeys.length === 0) {
    return null;
  }

  const sums: Record<string, Record<string, number>> = {};
  const dayCount: Record<string, number> = {};
  const weekOrder: string[] = [];

  for (const dayKey of dayKeys) {
    const wk = weekStartKey(dayKey);

    if (!sums[wk]) {
      sums[wk] = {};
      dayCount[wk] = 0;
      weekOrder.push(wk);
    }

    dayCount[wk] += 1;

    for (const [name, value] of source[dayKey]) {
      sums[wk][name] = (sums[wk][name] ?? 0) + value;
    }
  }

  const weeks = completeWeeks(dayKeys, weekOrder);

  if (weeks.length === 0) {
    return null;
  }

  const totals: Record<string, number> = {};

  for (const week of weeks) {
    const count = dayCount[week] || 1;

    for (const [name, sum] of Object.entries(sums[week])) {
      totals[name] = (totals[name] ?? 0) + sum / count;
    }
  }

  const ranked = Object.keys(totals).sort((a, b) => totals[b] - totals[a]);

  if (ranked.length === 0) {
    return null;
  }

  const labels = weeks.map((k) => fmtWeekRange(k));
  const series = ranked.map((name) => ({
    name,
    values: weeks.map(
      (week) => (sums[week][name] ?? 0) / (dayCount[week] || 1),
    ),
  }));

  return { labels, series };
}

function formatPercent(value: number): string {
  if (value === 0) {
    return '0%';
  }

  if (value < 0.1) {
    return '<0.1%';
  }

  return `${value.toFixed(1)}%`;
}

const stylesData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return buildSeries(stats.value.styles);
});

const versionsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return buildSeries(stats.value.versions);
});

const formatsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return buildSeries(stats.value.formats);
});

const showAllStyles = ref(false);
const activeTab = ref<'api' | 'npm'>('api');

const requestsPerSecond = computed(() => {
  if (!stats.value) {
    return 0;
  }

  const entries = Object.entries(stats.value.requests).sort(([a], [b]) =>
    a.localeCompare(b),
  );

  if (entries.length < 2) {
    return 0;
  }

  entries.pop();

  const window = entries.slice(-ROLLING_WINDOW_DAYS);
  const total = window.reduce((sum, [, v]) => sum + v, 0);
  const avgDaily = total / window.length;

  return avgDaily / SECONDS_PER_DAY;
});

const monthlyStats = computed(() => {
  if (!stats.value) {
    return null;
  }

  const requests = lastCompleteMonth(stats.value.requests);
  const traffic = lastCompleteMonth(stats.value.traffic);
  const downloads = lastCompleteMonth(stats.value.downloads.npm);

  if (!requests) {
    return null;
  }

  return {
    label: requests.label,
    requests: formatNumber(requests.total),
    traffic: traffic ? formatBytes(traffic.total) : null,
    downloads: downloads ? formatNumber(downloads.total) : null,
  };
});
</script>

<template>
  <AppSmallHero>
    <template #headline
      >Billions of Avatars.<br /><strong>One API.</strong></template
    >
    <template #description
      >Every avatar generated through our HTTP-API is tracked anonymously. This
      page gives you a transparent look at real usage data. It is updated weekly
      and broken down by requests, traffic, styles, and more.</template
    >
    <template #actions><!-- no actions --></template>
    <template #below-actions>
      <!--
        The numbers come from a runtime fetch, but the block is rendered from
        the first paint on. Letting it appear late moved everything below it
        down by its own height, which on narrow viewports put the map inside
        the viewport just long enough to trigger its lazy load.

        NBSP, not an empty string: an empty span has no line box, so the rows
        would collapse and reserve nothing.
      -->
      <div class="page-stats-hero-kpis">
        <p class="page-stats-hero-kpis-label">
          {{ monthlyStats ? `Statistics from ${monthlyStats.label}` : '\xa0' }}
        </p>
        <div class="page-stats-hero-kpis-row">
          <div class="page-stats-hero-kpi">
            <span class="page-stats-hero-kpi-value">{{
              monthlyStats?.requests ?? '\xa0'
            }}</span>
            <span class="page-stats-hero-kpi-label">API Requests</span>
          </div>
          <div class="page-stats-hero-kpi-divider"></div>
          <div
            v-if="!monthlyStats || monthlyStats.traffic"
            class="page-stats-hero-kpi"
          >
            <span class="page-stats-hero-kpi-value">{{
              monthlyStats?.traffic ?? '\xa0'
            }}</span>
            <span class="page-stats-hero-kpi-label">Data Served</span>
          </div>
          <div
            v-if="!monthlyStats || monthlyStats.downloads"
            class="page-stats-hero-kpi-divider"
          ></div>
          <div
            v-if="!monthlyStats || monthlyStats.downloads"
            class="page-stats-hero-kpi"
          >
            <span class="page-stats-hero-kpi-value">{{
              monthlyStats?.downloads ?? '\xa0'
            }}</span>
            <span class="page-stats-hero-kpi-label">npm Downloads</span>
          </div>
        </div>
      </div>
    </template>
    <template #aside>
      <ClientOnly>
        <AppStatsMap :rate="requestsPerSecond" />
      </ClientOnly>
    </template>
  </AppSmallHero>

  <UiSection divider>
    <UiContainer>
      <UiSectionHeader
        description="Weekly request and download volumes. Toggle between the HTTP API and npm packages."
      >
        <template #headline>Usage Over <strong>Time</strong></template>
      </UiSectionHeader>

      <div class="page-stats-tabs">
        <button
          :class="{ active: activeTab === 'api' }"
          @click="activeTab = 'api'"
        >
          HTTP API
        </button>
        <button
          :class="{ active: activeTab === 'npm' }"
          @click="activeTab = 'npm'"
        >
          npm
        </button>
      </div>

      <ClientOnly>
        <UiCard
          v-if="requestsData && activeTab === 'api'"
          padding="xl"
          class="page-stats-chart-card"
        >
          <h3 class="page-stats-chart-title">API Requests</h3>
          <AppStatsChart
            :labels="requestsData.labels"
            :values="requestsData.values"
            color="#0284c7"
            :format-value="formatNumber"
          />
        </UiCard>

        <UiCard
          v-if="downloadsData && activeTab === 'npm'"
          padding="xl"
          class="page-stats-chart-card"
        >
          <h3 class="page-stats-chart-title">Package Downloads</h3>
          <AppStatsChart
            :labels="downloadsData.labels"
            :values="downloadsData.values"
            color="#cb3837"
            :format-value="formatNumber"
          />
        </UiCard>
      </ClientOnly>
    </UiContainer>
  </UiSection>

  <UiSection divider>
    <UiContainer>
      <UiSectionHeader
        description="Based on API request data. Shows which styles, versions, and output formats are used most."
      >
        <template #headline>Usage <strong>Details</strong></template>
      </UiSectionHeader>

      <ClientOnly>
        <UiCard v-if="stylesData" padding="xl" class="page-stats-styles-card">
          <h3 class="page-stats-chart-title">Popular Styles</h3>
          <AppStatsMultiLineChart
            :labels="stylesData.labels"
            :series="
              showAllStyles
                ? stylesData.series
                : stylesData.series.slice(0, TOP_STYLES)
            "
            :format-value="formatPercent"
          />
          <button
            v-if="stylesData.series.length > TOP_STYLES"
            class="page-stats-show-all"
            @click="showAllStyles = !showAllStyles"
          >
            {{ showAllStyles ? `Show Top ${TOP_STYLES}` : 'Show All' }}
          </button>
        </UiCard>

        <div class="page-stats-breakdown-grid">
          <UiCard v-if="versionsData" padding="xl">
            <h3 class="page-stats-chart-title">API Versions</h3>
            <AppStatsMultiLineChart
              :labels="versionsData.labels"
              :series="versionsData.series"
              :format-value="formatPercent"
            />
          </UiCard>

          <UiCard v-if="formatsData" padding="xl">
            <h3 class="page-stats-chart-title">Output Formats</h3>
            <AppStatsMultiLineChart
              :labels="formatsData.labels"
              :series="formatsData.series"
              :format-value="formatPercent"
            />
          </UiCard>
        </div>
      </ClientOnly>
    </UiContainer>
  </UiSection>
</template>

<style lang="scss" scoped>
.page-stats-hero-kpis {
  margin-top: 32px;

  &-label {
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--vp-c-text-3);
    margin: 0 0 16px;
  }

  &-row {
    display: flex;
    align-items: center;
    gap: 28px;
  }
}

.page-stats-hero-kpi {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &-value {
    font-size: 28px;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--vp-c-text-1);
    font-variant-numeric: tabular-nums;
  }

  &-label {
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--vp-c-text-3);
  }

  &-divider {
    width: 1px;
    height: 40px;
    background: linear-gradient(
      180deg,
      transparent,
      var(--vp-c-border),
      transparent
    );
  }
}

.page-stats-tabs {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-bottom: 32px;
  background: var(--vp-c-bg-alt);
  border-radius: var(--vp-radius-sm);
  padding: 4px;
  width: fit-content;
  margin-inline: auto;

  button {
    padding: 8px 24px;
    border: none;
    background: transparent;
    color: var(--vp-c-text-2);
    font-size: 14px;
    font-weight: 500;
    border-radius: var(--vp-radius-xs);
    cursor: pointer;
    transition: all var(--duration-fast) var(--ease-smooth);

    &.active {
      background: var(--vp-c-bg-elv);
      color: var(--vp-c-text-1);
      box-shadow: var(--vp-shadow-1);
    }

    &:hover:not(.active) {
      color: var(--vp-c-text-1);
    }
  }
}

.page-stats-chart-card {
  overflow: hidden;
}

.page-stats-chart-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 24px;
}

.page-stats-show-all {
  display: block;
  margin: 16px auto 0;
  padding: 6px 16px;
  border: 1px solid var(--vp-c-border);
  background: transparent;
  color: var(--vp-c-text-2);
  font-size: 13px;
  font-weight: 500;
  border-radius: var(--vp-radius-xs);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-smooth);

  &:hover {
    color: var(--vp-c-text-1);
    border-color: var(--vp-c-text-2);
  }
}

.page-stats-styles-card {
  margin-bottom: 32px;
}

.page-stats-breakdown-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;

  > * {
    min-width: 0;
    overflow: hidden;
  }
}

@media (max-width: 768px) {
  .page-stats-hero-kpis {
    text-align: center;

    &-label {
      text-align: center;
    }

    &-row {
      justify-content: center;
      flex-wrap: wrap;
    }
  }

  .page-stats-hero-kpi {
    align-items: center;
  }

  .page-stats-breakdown-grid {
    grid-template-columns: 1fr;
  }
}
</style>
