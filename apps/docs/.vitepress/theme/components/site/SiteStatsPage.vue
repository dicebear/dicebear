<script setup lang="ts">
/**
 * The statistics page: the head, the request map across the full width, the
 * latest month in three numbers, the weekly chart with one tab per source,
 * the style rankings, and the shares of API versions and output formats.
 */
import { computed, ref } from 'vue';
import { formatNumber } from '@theme/utils/format';
import { useStatsCharts } from '@theme/composables/useStatsCharts';
import SitePageHead from './SitePageHead.vue';
import SiteStatsChart from './SiteStatsChart.vue';
import SiteStatsMap from './SiteStatsMap.vue';
import SiteStatsRankings from './SiteStatsRankings.vue';
import SiteStatsShares from './SiteStatsShares.vue';

const {
  rankings,
  currentWeekLabel,
  requests,
  downloads,
  requestsPerSecond,
  month,
  versions,
  formats,
  websites,
} = useStatsCharts();

const activeTab = ref('api');

const tabs = computed(() => [
  { key: 'api', label: 'HTTP API' },
  ...downloads.value.map((chart) => ({ key: chart.key, label: chart.label })),
]);

const series = computed(() => {
  if (activeTab.value === 'api') {
    return requests.value ?? null;
  }
  return (
    downloads.value.find((item) => item.key === activeTab.value)?.series ?? null
  );
});

const numbers = computed(() =>
  month.value
    ? [
        { value: month.value.requests, label: 'API requests' },
        { value: month.value.traffic, label: 'served through the CDN' },
        { value: month.value.downloads, label: 'downloads' },
      ].filter((item) => item.value)
    : [],
);
</script>

<template>
  <div class="site-stats-page">
    <SitePageHead
      :crumbs="[{ text: 'Home', link: '/' }, { text: 'Statistics' }]"
      title="In numbers"
    >
      Every avatar the hosted API serves is counted, and the package registries
      report their downloads. The page updates once a week.
    </SitePageHead>

    <div class="site-stats-page-map site-rise">
      <ClientOnly>
        <SiteStatsMap :rate="requestsPerSecond" />
      </ClientOnly>
    </div>

    <section class="site-container site-stats-page-month">
      <span class="site-label">{{ month?.label ?? '\xa0' }}</span>
      <div class="site-stats-page-numbers">
        <div
          v-for="item in numbers"
          :key="item.label"
          class="site-stats-page-number"
        >
          <span class="site-stats-page-number-value">{{ item.value }}</span>
          <span class="site-body">{{ item.label }}</span>
        </div>
      </div>
    </section>

    <section class="site-container site-stats-page-chart">
      <div class="site-stats-page-chart-head">
        <div class="site-stats-page-intro">
          <h2 class="site-headline">Week by week</h2>
          <p class="site-lead">
            Weekly totals for the hosted HTTP API and the package registries. A
            week shows up once it is complete.
          </p>
        </div>
        <div class="site-stats-page-tabs" role="group" aria-label="Source">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            type="button"
            class="site-chip site-chip-lg hv-outline"
            :aria-pressed="activeTab === tab.key"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>
      <ClientOnly>
        <div v-if="series" class="site-stats-page-plot">
          <SiteStatsChart
            :labels="series.labels"
            :values="series.values"
            :format-value="formatNumber"
          />
        </div>
      </ClientOnly>
    </section>

    <SiteStatsRankings
      v-if="rankings && currentWeekLabel"
      :rows="rankings"
      :week-label="currentWeekLabel"
      :websites="websites"
    />

    <section class="site-container site-stats-page-shares">
      <h2 class="site-headline">Versions and formats</h2>
      <div class="site-stats-page-shares-grid">
        <SiteStatsShares
          title="API versions"
          :lead="`Share of the websites active in the week of ${currentWeekLabel ?? ''}.`"
          :items="versions"
        />
        <SiteStatsShares
          title="Output formats"
          lead="Share of the websites active in the same week."
          :items="formats"
        />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.site-stats-page {
  &-map {
    margin-top: 56px;
    animation-delay: 200ms;
  }

  &-month {
    padding-top: 96px;
  }

  &-numbers {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 48px;
    margin-top: 20px;
    padding-top: 28px;
    border-top: 1px solid var(--db-line);

    @media (max-width: 959px) {
      grid-template-columns: minmax(0, 1fr);
      gap: 32px;
    }
  }

  &-number {
    display: flex;
    flex-direction: column;
    gap: 10px;
    min-width: 0;

    &-value {
      font-size: clamp(40px, 4.5vw, 64px);
      line-height: 1;
      letter-spacing: -0.04em;
      font-weight: 700;
      font-variant-numeric: tabular-nums;
      color: var(--db-ink);
    }
  }

  &-intro {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0;

    .site-lead {
      max-width: 640px;
    }
  }

  &-chart {
    padding-top: 168px;

    &-head {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 32px 48px;
    }
  }

  &-tabs {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  &-plot {
    margin-top: 56px;
  }

  /* The last section of the page, so it also holds the space to the footer. */
  &-shares {
    padding-top: 168px;
    padding-bottom: 168px;

    &-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 80px;
      margin-top: 64px;

      @media (max-width: 959px) {
        grid-template-columns: minmax(0, 1fr);
        gap: 64px;
      }
    }
  }

  @media (max-width: 767px) {
    &-map {
      margin-top: 40px;
    }

    &-month {
      padding-top: 64px;
    }

    &-chart,
    &-shares {
      padding-top: 96px;
    }

    &-shares {
      padding-bottom: 96px;

      &-grid {
        margin-top: 40px;
      }
    }
  }
}
</style>
