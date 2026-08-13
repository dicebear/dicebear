<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vitepress';
import InputText from 'primevue/inputtext';
import { UiCard, UiAvatar } from '../ui';
import AppStatsSparkline from './AppStatsSparkline.vue';
import AppStatsTrendBadge from './AppStatsTrendBadge.vue';
import { trendSortValue, type StyleRankingRow } from '../../utils/statsTrends';
import { formatPercent } from '../../utils/format';
import {
  styleDisplayName,
  stylePageUrl,
  styleSeed,
} from '../../utils/styleMeta';

const props = defineProps<{
  rows: StyleRankingRow[];
  weekLabel: string;
}>();

const query = ref('');

const router = useRouter();

// The whole row navigates; the name link stays for middle-click and
// semantics and handles itself, so its clicks are left alone here.
function onRowClick(row: StyleRankingRow, event: MouseEvent) {
  if ((event.target as HTMLElement).closest('a')) {
    return;
  }

  router.go(stylePageUrl(row.name));
}

// Share bars are scaled to the most used style, so the top row fills the
// track and everything else reads relative to it.
const maxShare = computed(() =>
  props.rows.reduce((max, row) => Math.max(max, row.share), 0),
);

// Stable per-row option objects: an inline literal in the template would be
// recreated on every render and make all avatars re-run their URL builds.
const avatarOptions = computed(
  () =>
    new Map(
      props.rows.map((row) => [
        row.name,
        { seed: styleSeed(row.name), size: 64 },
      ]),
    ),
);

type SortKey = 'rank' | 'name' | 'websites' | 'share' | 'trend';
type SortDir = 'asc' | 'desc';

// The initial direction is the reading a column is usually asked for: names
// A to Z, numbers biggest first. A second click on the same column flips it.
const SORT_COLUMNS: {
  key: SortKey;
  label: string;
  class: string;
  initialDir: SortDir;
}[] = [
  { key: 'rank', label: '#', class: 'col-rank', initialDir: 'asc' },
  { key: 'name', label: 'Style', class: 'col-style', initialDir: 'asc' },
  {
    key: 'websites',
    label: 'Websites',
    class: 'col-websites',
    initialDir: 'desc',
  },
  { key: 'share', label: 'Share', class: 'col-share', initialDir: 'desc' },
  { key: 'trend', label: 'Trend', class: 'col-trend', initialDir: 'desc' },
];

const sortKey = ref<SortKey>('rank');
const sortDir = ref<SortDir>('asc');

function setSort(column: (typeof SORT_COLUMNS)[number]) {
  if (sortKey.value === column.key) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = column.key;
    sortDir.value = column.initialDir;
  }
}

function ariaSort(key: SortKey): 'ascending' | 'descending' | undefined {
  if (sortKey.value !== key) {
    return undefined;
  }

  return sortDir.value === 'asc' ? 'ascending' : 'descending';
}

// The slug orders the same way as the display name (hyphens read as the
// spaces capitalCase turns them into), so sorting skips the case mapping.
function compare(a: StyleRankingRow, b: StyleRankingRow): number {
  switch (sortKey.value) {
    case 'rank':
      return a.rank - b.rank;
    case 'name':
      return a.name.localeCompare(b.name);
    case 'websites':
      return a.websites - b.websites;
    case 'share':
      return a.share - b.share;
    case 'trend':
      return trendSortValue(a) - trendSortValue(b);
  }
}

const sortedRows = computed(() => {
  const dir = sortDir.value === 'asc' ? 1 : -1;

  return [...props.rows].sort((a, b) => {
    // Styles without a trend value sit at the end in both directions;
    // "no data" is neither the biggest gain nor the biggest loss.
    if (sortKey.value === 'trend') {
      const aMissing = !a.isNew && a.growth === null;
      const bMissing = !b.isNew && b.growth === null;

      if (aMissing !== bMissing) {
        return aMissing ? 1 : -1;
      }
    }

    const primary = dir * compare(a, b);

    if (Number.isNaN(primary) || primary === 0) {
      return a.rank - b.rank;
    }

    return primary;
  });
});

// Typed spaces match the hyphens of the slugs, so "big ears" finds
// big-ears; filtering runs on the already sorted list, which keeps a
// keystroke at one linear pass instead of a re-sort.
const visibleRows = computed(() => {
  const q = query.value.trim().toLowerCase().replace(/\s+/g, '-');

  if (!q) {
    return sortedRows.value;
  }

  return sortedRows.value.filter((row) => row.name.includes(q));
});
</script>

<template>
  <UiCard padding="xl" class="app-stats-style-table">
    <div class="app-stats-style-table-head">
      <div>
        <h3 class="app-stats-style-table-title">All Styles</h3>
        <p class="app-stats-style-table-week">Week of {{ weekLabel }}</p>
      </div>
      <InputText
        v-model="query"
        type="search"
        placeholder="Search styles"
        aria-label="Search styles"
        class="app-stats-style-table-search"
      />
    </div>

    <div class="app-stats-style-table-scroll">
      <table>
        <thead>
          <tr>
            <th
              v-for="column in SORT_COLUMNS"
              :key="column.key"
              scope="col"
              :class="column.class"
              :aria-sort="ariaSort(column.key)"
            >
              <button class="th-sort" @click="setSort(column)">
                {{ column.label }}
                <span
                  v-if="sortKey === column.key"
                  class="th-sort-arrow"
                  aria-hidden="true"
                  >{{ sortDir === 'asc' ? '▲' : '▼' }}</span
                >
              </button>
            </th>
            <th scope="col" class="col-spark">Last 12 weeks</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in visibleRows"
            :key="row.name"
            class="style-row"
            @click="onRowClick(row, $event)"
          >
            <td class="col-rank">{{ row.rank }}</td>
            <td class="col-style">
              <a :href="stylePageUrl(row.name)" class="style-link">
                <UiAvatar
                  :size="32"
                  :style-name="row.name"
                  :style-options="avatarOptions.get(row.name)!"
                  alt=""
                />
                <span>{{ styleDisplayName(row.name) }}</span>
              </a>
            </td>
            <td class="col-websites">
              {{ row.websites.toLocaleString('en') }}
            </td>
            <td class="col-share">
              <div class="share">
                <span class="share-value">{{ formatPercent(row.share) }}</span>
                <span class="share-track" aria-hidden="true">
                  <span
                    class="share-bar"
                    :style="{
                      width: `${maxShare > 0 ? (row.share / maxShare) * 100 : 0}%`,
                    }"
                  ></span>
                </span>
              </div>
            </td>
            <td class="col-trend">
              <AppStatsTrendBadge :growth="row.growth" :is-new="row.isNew" />
            </td>
            <td class="col-spark">
              <AppStatsSparkline :values="row.spark" />
            </td>
          </tr>
          <tr v-if="visibleRows.length === 0">
            <td colspan="6" class="empty">No style matches "{{ query }}".</td>
          </tr>
        </tbody>
      </table>
    </div>
  </UiCard>
</template>

<style lang="scss" scoped>
.app-stats-style-table {
  &-head {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
    margin-bottom: 20px;
  }

  &-title {
    font-size: 18px;
    font-weight: 600;
    color: var(--vp-c-text-1);
  }

  &-week {
    margin: 2px 0 0;
    font-size: 13px;
    color: var(--vp-c-text-3);
  }

  &-search {
    width: 220px;
  }

  &-scroll {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 14px;
  }

  th {
    text-align: left;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--vp-c-text-3);
    padding: 8px 12px;
    border-bottom: 1px solid var(--vp-c-border);
    white-space: nowrap;
  }

  .th-sort {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    font-size: inherit;
    font-weight: inherit;
    font-family: inherit;
    text-transform: inherit;
    letter-spacing: inherit;
    color: inherit;
    transition: color var(--duration-fast) var(--ease-smooth);

    &:hover {
      color: var(--vp-c-text-1);
    }
  }

  th[aria-sort] .th-sort {
    color: var(--vp-c-text-1);
  }

  .th-sort-arrow {
    font-size: 8px;
  }

  td {
    padding: 8px 12px;
    border-bottom: 1px solid var(--vp-c-divider);
    vertical-align: middle;
    white-space: nowrap;
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  tbody tr.style-row {
    cursor: pointer;
  }

  // The whole row is the click target, so the row hover carries both
  // signals: the surface tint and the brand color on the style name.
  tbody tr.style-row:hover td {
    background: var(--vp-c-bg-alt);
  }

  tbody tr.style-row:hover .style-link span {
    color: var(--vp-c-brand-1);
  }

  .col-rank {
    width: 40px;
    color: var(--vp-c-text-3);
    font-variant-numeric: tabular-nums;
  }

  .col-websites {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }

  th.col-websites {
    text-align: right;
  }

  .col-share {
    width: 220px;
  }

  .col-trend {
    width: 90px;
  }

  .col-spark {
    width: 120px;
    color: var(--vp-c-text-3);
  }

  .style-link {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--vp-c-text-1);
    font-weight: 500;
    text-decoration: none;

    .ui-avatar {
      flex-shrink: 0;
    }
  }

  .share {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .share-value {
    font-variant-numeric: tabular-nums;
    min-width: 48px;
    text-align: right;
    color: var(--vp-c-text-2);
  }

  .share-track {
    flex: 1;
    height: 6px;
    border-radius: 3px;
    background: var(--vp-c-bg-alt);
    overflow: hidden;
  }

  .share-bar {
    display: block;
    height: 100%;
    border-radius: 3px;
    background: var(--vp-c-brand-1);
  }

  .empty {
    text-align: center;
    color: var(--vp-c-text-2);
    padding: 24px 12px;
  }
}

@media (max-width: 768px) {
  .app-stats-style-table {
    .col-spark,
    .share-track {
      display: none;
    }

    .col-share {
      width: auto;
    }

    .share-value {
      text-align: left;
      min-width: 0;
    }
  }
}
</style>
