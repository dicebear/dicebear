<script setup lang="ts">
import { computed, ref } from 'vue';
import { UiSection, UiContainer, UiSectionHeader, UiCard } from '../ui';
import AppSmallHero from '../app/AppSmallHero.vue';
import AppStatsChart from '../app/AppStatsChart.vue';
import AppStatsMultiLineChart from '../app/AppStatsMultiLineChart.vue';
import AppStatsMap from '../app/AppStatsMap.vue';
import AppStatsStyleTable from '../app/AppStatsStyleTable.vue';
import AppStatsTrendingCard from '../app/AppStatsTrendingCard.vue';
import { lastCompleteMonth } from '../../composables/useApiStats';
import { useStyleRankings } from '../../composables/useStyleRankings';
import {
  buildWeeklySeries,
  formatWeekRange,
  shiftDays,
  weekStartKey,
} from '../../utils/statsTrends';
import { formatNumber, formatBytes, formatPercent } from '../../utils/format';

const SECONDS_PER_DAY = 86400;
const ROLLING_WINDOW_DAYS = 7;
const TRENDING_COUNT = 4;

const {
  stats,
  weekly,
  currentWeekLabel,
  rankings: styleRows,
} = useStyleRankings();

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
    labels: weeks.map((k) => formatWeekRange(k)),
    values: weeks.map((week) => sums[week]),
  };
}

const requestsData = computed(() => {
  if (!stats.value) {
    return null;
  }

  return aggregateWeekly(stats.value.requests);
});

// One tab per registry the ports are published on. Registries whose data
// has not arrived yet (or whose history is empty) get no tab.
const DOWNLOAD_SOURCES = [
  { key: 'npm', label: 'npm', title: 'npm Downloads', color: '#cb3837' },
  {
    key: 'packagist',
    label: 'Packagist',
    title: 'Packagist Downloads',
    color: '#f28d1a',
  },
  { key: 'pypi', label: 'PyPI', title: 'PyPI Downloads', color: '#3775a9' },
  {
    key: 'crates',
    label: 'crates.io',
    title: 'crates.io Downloads',
    color: '#b7410e',
  },
] as const;

const downloadCharts = computed(() => {
  const downloads = stats.value?.downloads;

  if (!downloads) {
    return [];
  }

  const sources = DOWNLOAD_SOURCES.map((source) => ({
    ...source,
    daily: downloads[source.key] ?? {},
  })).filter((source) => Object.keys(source.daily).length > 0);

  // Every registry chart runs on one shared week axis, so switching tabs
  // never changes the time range. Weeks a registry reports nothing for
  // count as zero; the young ports simply had no downloads back then.
  const days = sources.flatMap((source) => Object.keys(source.daily)).sort();

  if (days.length === 0) {
    return [];
  }

  const startMonday = weekStartKey(days[0]);
  const firstWeek =
    startMonday === days[0] ? startMonday : shiftDays(startMonday, 7);
  const lastWeek = weekStartKey(shiftDays(days[days.length - 1], -6));

  const axis: string[] = [];

  for (let week = firstWeek; week <= lastWeek; week = shiftDays(week, 7)) {
    axis.push(week);
  }

  const labels = axis.map(formatWeekRange);

  return sources.map(({ daily, ...source }) => {
    const sums: Record<string, number> = {};

    for (const [day, value] of Object.entries(daily)) {
      const week = weekStartKey(day);
      sums[week] = (sums[week] ?? 0) + value;
    }

    return {
      ...source,
      data: { labels, values: axis.map((week) => sums[week] ?? 0) },
    };
  });
});

// The biggest gainers among styles with enough usage that a handful of
// websites cannot swing the percentage. The floor scales with the total
// so it works at any traffic level, but stays low: 0.05% of the weekly
// volume (~150 websites at the current scale). A tighter floor silently
// dropped mid-tail styles whose growth was the most interesting number
// on the page.
const trendingStyles = computed(() => {
  const rows = styleRows.value;

  if (!rows) {
    return null;
  }

  const totalRecent = rows.reduce((sum, row) => sum + row.recentAvg, 0);
  const floor = Math.max(50, totalRecent * 0.0005);

  const eligible = rows.filter(
    (row) =>
      row.recentAvg >= floor &&
      (row.isNew || (row.growth !== null && row.growth > 0)),
  );

  eligible.sort((a, b) => {
    if (a.isNew !== b.isNew) {
      return a.isNew ? -1 : 1;
    }

    if (a.isNew) {
      return b.websites - a.websites;
    }

    return (b.growth ?? 0) - (a.growth ?? 0);
  });

  return eligible.slice(0, TRENDING_COUNT);
});

// Weeks with lost logs never reach the weekly records (the API drops
// them), so the share charts simply skip them; shares stay comparable
// across the missing weeks.
function weeklyShareData(
  source: Record<string, [string, number][]>,
  referers: Record<string, number>,
): {
  labels: string[];
  series: Array<{ name: string; values: number[] }>;
} | null {
  const { weeks, byName } = buildWeeklySeries(source);

  if (weeks.length === 0) {
    return null;
  }

  const names = Object.keys(byName).sort(
    (a, b) => byName[b][weeks.length - 1] - byName[a][weeks.length - 1],
  );

  return {
    labels: weeks.map(formatWeekRange),
    series: names.map((name) => ({
      name,
      values: byName[name].map((value, index) => {
        const total = referers[weeks[index]] ?? 0;

        return total > 0 ? (value / total) * 100 : 0;
      }),
    })),
  };
}

const versionsData = computed(() =>
  weekly.value
    ? weeklyShareData(weekly.value.versions, weekly.value.referers)
    : null,
);

const formatsData = computed(() =>
  weekly.value
    ? weeklyShareData(weekly.value.formats, weekly.value.referers)
    : null,
);

const activeTab = ref<string>('api');

const activeDownload = computed(
  () =>
    downloadCharts.value.find((chart) => chart.key === activeTab.value) ?? null,
);

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
        description="Weekly totals for API requests and package downloads, shown once a week is complete."
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
          v-for="chart in downloadCharts"
          :key="chart.key"
          :class="{ active: activeTab === chart.key }"
          @click="activeTab = chart.key"
        >
          {{ chart.label }}
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
          v-if="activeDownload"
          padding="xl"
          class="page-stats-chart-card"
        >
          <h3 class="page-stats-chart-title">{{ activeDownload.title }}</h3>
          <AppStatsChart
            :labels="activeDownload.data.labels"
            :values="activeDownload.data.values"
            :color="activeDownload.color"
            :format-value="formatNumber"
          />
        </UiCard>
      </ClientOnly>
    </UiContainer>
  </UiSection>

  <UiSection v-if="styleRows" divider>
    <UiContainer>
      <UiSectionHeader
        description="Every style, ranked by the number of websites that used it in the last complete week. Trends compare the past four weeks with the four before."
      >
        <template #headline>Style <strong>Rankings</strong></template>
      </UiSectionHeader>

      <ClientOnly>
        <div
          v-if="trendingStyles && trendingStyles.length > 0"
          class="page-stats-trending"
        >
          <h3 class="page-stats-block-title">Trending</h3>
          <div class="page-stats-trending-grid">
            <AppStatsTrendingCard
              v-for="row in trendingStyles"
              :key="row.name"
              :row="row"
            />
          </div>
        </div>

        <AppStatsStyleTable
          v-if="styleRows && currentWeekLabel"
          :rows="styleRows"
          :week-label="currentWeekLabel"
        />
      </ClientOnly>
    </UiContainer>
  </UiSection>

  <UiSection v-if="versionsData || formatsData" divider>
    <UiContainer>
      <UiSectionHeader
        description="The API versions and output formats in use, as a share of the websites active each week."
      >
        <template #headline>Usage <strong>Details</strong></template>
      </UiSectionHeader>

      <ClientOnly>
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

.page-stats-block-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}

.page-stats-trending {
  margin-bottom: 32px;
}

.page-stats-trending-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 20px;
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
