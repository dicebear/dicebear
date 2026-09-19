<script setup lang="ts">
/**
 * Every style ranked by the websites that requested it in the latest
 * complete week. Ten rows to start with, the rest on request, a search
 * across all of them.
 */
import { computed, ref } from 'vue';
import { capitalCase, kebabCase } from 'change-case';
import { ArrowDown, ArrowUp } from '@lucide/vue';
import type { StyleRankingRow } from '@theme/utils/statsTrends';
import { formatGrowth, growthDirection } from '@theme/utils/statsTrends';
import SiteAvatar from './SiteAvatar.vue';
import SiteSearch from './SiteSearch.vue';
import SiteStatsSparkline from './SiteStatsSparkline.vue';

const props = defineProps<{
  rows: StyleRankingRow[];
  weekLabel: string;
  websites: number | null;
}>();

const SHOWN = 10;

const query = ref('');
const expanded = ref(false);

type SortKey = 'rank' | 'name' | 'websites' | 'share' | 'trend';

const sortKey = ref<SortKey>('rank');
const descending = ref(true);

/** Every column but the sparkline sorts. The rank keeps its number from the API. */
const columns: { key: SortKey; label: string; right?: boolean }[] = [
  { key: 'rank', label: '#' },
  { key: 'name', label: 'Style' },
  { key: 'websites', label: 'Websites', right: true },
  { key: 'share', label: 'Share', right: true },
  { key: 'trend', label: 'Trend', right: true },
];

function sortBy(key: SortKey) {
  if (sortKey.value === key) {
    descending.value = !descending.value;
    return;
  }
  sortKey.value = key;
  // Names read best A to Z, numbers largest first.
  descending.value = key !== 'name';
}

/** New styles have no growth figure yet and sort above every gain. */
function trendValue(row: StyleRankingRow): number {
  return row.isNew
    ? Number.POSITIVE_INFINITY
    : (row.growth ?? Number.NEGATIVE_INFINITY);
}

function compare(a: StyleRankingRow, b: StyleRankingRow): number {
  switch (sortKey.value) {
    case 'name':
      return capitalCase(a.name).localeCompare(capitalCase(b.name));
    case 'websites':
      return a.websites - b.websites;
    case 'share':
      return a.share - b.share;
    case 'trend':
      return trendValue(a) - trendValue(b);
    default:
      return b.rank - a.rank;
  }
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  const rows = q
    ? props.rows.filter((row) =>
        capitalCase(row.name).toLowerCase().includes(q),
      )
    : [...props.rows];
  rows.sort((a, b) => (descending.value ? compare(b, a) : compare(a, b)));
  return rows;
});

/** A new style counts as a gain, like the arrow beside it says. */
function direction(row: StyleRankingRow): 'up' | 'down' | 'flat' {
  return row.isNew ? 'up' : growthDirection(row.growth);
}

const shown = computed(() =>
  expanded.value || query.value.trim()
    ? filtered.value
    : filtered.value.slice(0, SHOWN),
);
</script>

<template>
  <section class="site-container site-stats-rankings">
    <div class="site-stats-rankings-head">
      <div class="site-stats-rankings-intro">
        <h2 class="site-headline">Style rankings</h2>
        <p class="site-lead">
          Every style, ranked by the number of websites that requested it in the
          week of {{ weekLabel }}. The trend compares the past four weeks with
          the four before.
        </p>
      </div>
      <SiteSearch
        v-model="query"
        placeholder="Search styles"
        label="Search styles"
        class="site-stats-rankings-search"
      />
    </div>
    <div class="site-stats-rankings-table">
      <div class="site-stats-rankings-columns site-label">
        <template v-for="column in columns" :key="column.key">
          <span v-if="column.key === 'name'"></span>
          <button
            type="button"
            class="site-stats-rankings-sort hv-seg"
            :class="{ 'is-right': column.right }"
            :aria-pressed="sortKey === column.key"
            :aria-sort="
              sortKey === column.key
                ? descending
                  ? 'descending'
                  : 'ascending'
                : undefined
            "
            @click="sortBy(column.key)"
          >
            {{ column.label }}
            <ArrowDown
              v-if="sortKey === column.key"
              :size="12"
              :class="{ 'is-up': !descending }"
              aria-hidden="true"
            />
          </button>
        </template>
        <span class="is-right">12 weeks</span>
      </div>
      <div
        class="site-stats-rankings-rows"
        :class="{ 'is-scrolling': shown.length > SHOWN }"
      >
        <a
          v-for="row in shown"
          :key="row.name"
          :href="`/styles/${kebabCase(row.name)}/`"
          class="site-stats-rankings-row hv-row"
        >
          <span class="site-stats-rankings-rank">{{ row.rank }}</span>
          <SiteAvatar
            :style-name="row.name"
            :options="{ seed: 'Felix' }"
            :size="40"
            :radius="10"
            :alt="`${capitalCase(row.name)} avatar`"
          />
          <span class="site-stats-rankings-name">{{
            capitalCase(row.name)
          }}</span>
          <span class="is-right site-stats-rankings-figure">{{
            row.websites.toLocaleString('en-US')
          }}</span>
          <span
            class="is-right site-stats-rankings-figure site-stats-rankings-share"
            >{{ row.share.toFixed(1) }}%</span
          >
          <span
            class="site-stats-rankings-figure site-stats-rankings-trend"
            :class="`is-${direction(row)}`"
          >
            <ArrowUp
              v-if="direction(row) === 'up'"
              :size="12"
              aria-hidden="true"
            />
            <ArrowDown
              v-else-if="direction(row) === 'down'"
              :size="12"
              aria-hidden="true"
            />
            {{ row.isNew ? 'New' : formatGrowth(row.growth) }}
          </span>
          <span class="site-stats-rankings-spark">
            <SiteStatsSparkline :values="row.spark" :width="120" :height="28" />
          </span>
        </a>
        <p
          v-if="shown.length === 0"
          class="site-text site-stats-rankings-empty"
        >
          No style matches.
        </p>
      </div>
    </div>
    <div class="site-stats-rankings-foot">
      <button
        v-if="!query.trim() && filtered.length > SHOWN"
        type="button"
        class="site-stats-rankings-more hv-outline"
        @click="expanded = !expanded"
      >
        {{ expanded ? 'Show the top 10' : `Show all ${rows.length} styles` }}
      </button>
      <span class="site-text site-stats-rankings-total">
        <template v-if="websites"
          >{{ websites.toLocaleString('en-US') }} websites in the week of
          {{ weekLabel }}</template
        >
      </span>
    </div>
  </section>
</template>

<style scoped lang="scss">
.site-stats-rankings {
  padding-top: 168px;

  &-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-end;
    justify-content: space-between;
    gap: 32px 48px;
  }

  &-intro {
    display: flex;
    flex-direction: column;
    gap: 32px;
    min-width: 0;

    .site-lead {
      max-width: 700px;
    }
  }

  &-search {
    flex-shrink: 0;
  }

  /* Below the width the columns need, the table scrolls sideways inside its
     own box and the page keeps its width. */
  &-table {
    margin-top: 48px;
    overflow-x: auto;
  }

  &-columns,
  &-row {
    display: grid;
    grid-template-columns: 48px 40px minmax(0, 1fr) 140px 100px 100px 140px;
    gap: 16px;
    align-items: center;
    min-width: 760px;
  }

  &-columns {
    height: 44px;
  }

  &-rows {
    min-width: 760px;
    border-top: 1px solid var(--db-line);
    border-bottom: 1px solid var(--db-line);

    /* The full list scrolls inside the height of the first ten rows. */
    @media (min-width: 768px) {
      &.is-scrolling {
        max-height: 640px;
        overflow-y: auto;
      }
    }
  }

  &-row {
    height: 64px;
    border-bottom: 1px solid var(--db-line);

    &:last-child {
      border-bottom: 0;
    }
  }

  .is-right {
    text-align: right;
  }

  &-sort {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: 0;
    background: none;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: inherit;
    cursor: pointer;

    &.is-right {
      justify-content: flex-end;
    }

    &[aria-pressed='true'] {
      color: var(--db-ink);
    }

    svg {
      transition: transform var(--duration-fast);

      &.is-up {
        transform: rotate(180deg);
      }
    }
  }

  &-rank,
  &-figure {
    font-family: var(--db-font-mono);
    font-size: 14px;
    line-height: 20px;
    font-variant-numeric: tabular-nums;
  }

  &-rank {
    color: var(--db-muted);
  }

  &-name {
    font-size: 16px;
    line-height: 26px;
    font-weight: 600;
  }

  &-figure {
    color: var(--db-ink);
  }

  &-share {
    color: var(--db-ink-2);
  }

  &-trend {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 4px;

    &.is-down,
    &.is-flat {
      color: var(--db-muted);
    }
  }

  &-spark {
    display: flex;
    justify-content: flex-end;
  }

  &-empty {
    padding: 24px 0;
    color: var(--db-muted);
  }

  &-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    margin-top: 20px;
  }

  &-more {
    display: inline-flex;
    align-items: center;
    height: 40px;
    padding: 0 16px;
    border: 1px solid var(--db-btn-border);
    border-radius: 10px;
    background: transparent;
    font: inherit;
    font-size: 15px;
    font-weight: 500;
    color: var(--db-ink);
    cursor: pointer;

    &:focus-visible {
      outline: 2px solid var(--db-brand);
      outline-offset: 2px;
    }
  }

  &-total {
    margin-left: auto;
    color: var(--db-muted);
  }

  @media (max-width: 767px) {
    padding-top: 96px;

    & &-search {
      width: 100%;
    }
  }
}
</style>
