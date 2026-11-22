<script setup lang="ts">
/**
 * The statistics page: the head, the figures as color tiles (the request
 * rate first, then the latest complete month), the weeks as bars with one
 * chip per source, the style rankings with a podium, and the shares of API
 * versions and output formats. Everything arrives after mount; the tiles
 * keep their room until then.
 */
import { computed, ref } from 'vue';
import { formatNumber } from '@theme/utils/format';
import { spellNumber, useStatsCharts } from '@theme/composables/useStatsCharts';
import SiteAvatar from './SiteAvatar.vue';
import SitePageHead from './SitePageHead.vue';
import SiteSection from './SiteSection.vue';
import SiteStat from './SiteStat.vue';
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

const perSecond = computed(() =>
  requestsPerSecond.value ? Math.round(requestsPerSecond.value) : null,
);

const perDay = computed(() => {
  if (!requestsPerSecond.value) return null;

  const day = spellNumber(requestsPerSecond.value * 86400);

  return `${day.value} ${day.unit}`.trim();
});

/** The stickers around the rate, placed by hand. */
const CLOUD = [
  { style: 'avataaars', x: 6, y: 8, w: 18.5, turn: -8 },
  { style: 'notionists', x: 44, y: 2, w: 13.8, turn: 6 },
  { style: 'thumbs', x: 70, y: 30, w: 16.9, turn: -5 },
  { style: 'lorelei', x: 22, y: 46, w: 15.4, turn: 7 },
  { style: 'bottts', x: 56, y: 62, w: 13.1, turn: -6 },
  { style: 'pixel-art', x: 2, y: 70, w: 11.5, turn: 5 },
  { style: 'shapes', x: 84, y: 74, w: 10.8, turn: 8 },
];

/* Week by week */

const WEEKS = 26;
const LABELS = 6;

const source = ref('api');

const sources = computed(() => [
  { key: 'api', label: 'HTTP API' },
  ...downloads.value.map((chart) => ({ key: chart.key, label: chart.label })),
]);

const series = computed(() =>
  source.value === 'api'
    ? (requests.value ?? null)
    : (downloads.value.find((item) => item.key === source.value)?.series ??
      null),
);

const weeks = computed(() => {
  const s = series.value;

  if (!s) return [];

  const labels = s.labels.slice(-WEEKS);
  const values = s.values.slice(-WEEKS);
  const top = Math.max(...values, 1);

  return values.map((value, index) => ({
    label: labels[index],
    value,
    height: `${Math.max(2, (value / top) * 100).toFixed(1)}%`,
    // Older weeks fade, the latest stands in full color.
    opacity: (0.35 + (0.65 * index) / Math.max(1, values.length - 1)).toFixed(
      2,
    ),
  }));
});

const axis = computed(() => {
  const list = weeks.value;

  if (list.length === 0) return [];

  const step = (list.length - 1) / (LABELS - 1);

  return Array.from(
    { length: LABELS },
    (_, i) => list[Math.round(i * step)].label,
  );
});

const chartLabel = computed(() => {
  const list = weeks.value;
  const name = sources.value.find((s) => s.key === source.value)?.label;

  if (list.length === 0) return `Weekly totals for ${name}`;

  const first = list[0];
  const last = list[list.length - 1];

  return `Weekly totals for ${name} over the last ${list.length} complete weeks, from ${formatNumber(first.value)} in the week of ${first.label} to ${formatNumber(last.value)} in the week of ${last.label}`;
});
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

    <section class="site-stats-page-figures" aria-label="The figures">
      <div class="site-box is-sky site-stats-page-rate">
        <SiteStat
          size="xl"
          :value="perSecond?.toLocaleString('en-US') ?? '\xa0'"
          label="avatars a second"
          :note="
            perDay
              ? `On average over the last seven days. That is ${perDay} a day.`
              : 'On average over the last seven days.'
          "
        />
        <div class="site-stats-page-cloud" aria-hidden="true">
          <SiteAvatar
            v-for="item in CLOUD"
            :key="item.style"
            sticker
            :style-name="item.style"
            :options="{ seed: 'Felix' }"
            :style="{
              left: `${item.x}%`,
              top: `${item.y}%`,
              width: `${item.w}%`,
              transform: `rotate(${item.turn}deg)`,
            }"
          />
        </div>
      </div>

      <div class="site-stats-page-tiles">
        <div class="site-box is-tile is-sun">
          <SiteStat
            :value="month?.requests.value ?? '\xa0'"
            :unit="month?.requests.unit"
            label="API requests"
            :note="month?.label"
          />
        </div>
        <div class="site-box is-tile is-lilac">
          <SiteStat
            :value="month?.websites?.toLocaleString('en-US') ?? '\xa0'"
            label="websites a week"
            :note="month ? `${month.label}, on average` : undefined"
          />
        </div>
        <div class="site-box is-tile is-mint">
          <SiteStat
            :value="month?.traffic?.value ?? '\xa0'"
            :unit="month?.traffic?.unit"
            label="served through the CDN"
            :note="month?.label"
          />
        </div>
      </div>

      <div class="site-box is-tile is-soft site-stats-page-downloads">
        <SiteStat
          :value="month?.downloads?.value ?? '\xa0'"
          :unit="month?.downloads?.unit"
          label="downloads"
          :note="month ? `${month.label}, all registries` : undefined"
        />
        <div class="site-stats-page-registries">
          <div
            v-for="registry in month?.registries ?? []"
            :key="registry.label"
            class="site-box is-inset"
          >
            <SiteStat
              size="sm"
              :value="registry.value"
              :label="registry.label"
            />
          </div>
        </div>
      </div>
    </section>

    <SiteSection
      tone="lilac"
      layout="stack"
      title="Week by week"
      hint="Weekly totals for the hosted HTTP API and the package registries. A week shows up once it is complete."
      class="site-stats-page-weeks"
    >
      <div class="site-stats-page-sources" role="group" aria-label="Source">
        <button
          v-for="item in sources"
          :key="item.key"
          type="button"
          class="site-pill site-pill-outline"
          :aria-pressed="source === item.key"
          @click="source = item.key"
        >
          {{ item.label }}
        </button>
      </div>
      <div class="site-stats-page-chart">
        <div class="site-stats-page-bars" role="img" :aria-label="chartLabel">
          <span
            v-for="week in weeks"
            :key="week.label"
            :title="`${week.label}: ${formatNumber(week.value)}`"
            :style="{ height: week.height, opacity: week.opacity }"
          ></span>
        </div>
        <div class="site-stats-page-axis" aria-hidden="true">
          <span v-for="label in axis" :key="label">{{ label }}</span>
        </div>
      </div>
    </SiteSection>

    <SiteStatsRankings
      v-if="rankings && currentWeekLabel"
      :rows="rankings"
      :week-label="currentWeekLabel"
      :websites="websites"
    />

    <SiteSection
      tone="soft"
      layout="stack"
      title="Versions and formats"
      class="site-stats-page-shares"
    >
      <div class="site-pair is-top">
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
    </SiteSection>
    <div class="site-end"></div>
  </div>
</template>

<style scoped lang="scss">
.site-stats-page {
  /* The figures: a column of tiles, as wide as a block. */
  &-figures {
    display: flex;
    flex-direction: column;
    gap: var(--db-edge);
    width: min(var(--db-content), 100% - 2 * var(--db-wrap));
    margin: clamp(40px, 5vw, 72px) auto 0;
  }

  &-rate {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px clamp(32px, 4vw, 64px);
    padding: clamp(32px, 4.5vw, 64px);
    border-radius: var(--db-radius-block);

    > .site-stat {
      flex: 1 1 360px;
    }
  }

  /* Stickers scattered around the rate, placed in percent of the cloud. */
  &-cloud {
    position: relative;
    flex: 1 1 320px;
    max-width: 520px;
    aspect-ratio: 1.25;

    > :deep(.site-sticker) {
      position: absolute;
    }
  }

  &-tiles {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
    gap: var(--db-edge);
  }

  &-downloads {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 24px clamp(32px, 4vw, 64px);

    > .site-stat {
      flex: 0 1 360px;
    }
  }

  &-registries {
    display: grid;
    flex: 999 1 420px;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 12px;
  }

  &-weeks {
    margin-top: var(--db-edge);
  }

  &-sources {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* Bars with round tops, the older weeks fainter. */
  &-bars {
    display: flex;
    align-items: flex-end;
    gap: 0.8%;
    height: clamp(240px, 28vw, 380px);

    > span {
      flex: 1;
      border-radius: 999px 999px 4px 4px;
      background: var(--db-accent);
      transition: height 0.4s var(--ease-smooth);
    }
  }

  &-axis {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    margin-top: 14px;
    overflow: hidden;
    font-family: var(--db-font-display);
    font-size: 14px;
    line-height: 20px;
    font-weight: 600;
    color: var(--db-ink-2);
    white-space: nowrap;
  }
}
</style>
