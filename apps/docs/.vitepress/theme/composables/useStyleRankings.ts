import { computed } from 'vue';
import { apiStatsData, formatMonthKey, useApiStatsRaw } from './useApiStats';
import {
  buildMonthlySeries,
  computeTrend,
  previousMonthKey,
  type StyleRankingRow,
} from '../utils/statsTrends';
import { findUncategorizedStyles } from '../config/styleCategories';

export const SPARK_MONTHS = 12;

/**
 * The style ranking derived from the stats API's monthly unique-referer
 * counts, shared by the statistics page, the style pages, and the styles
 * overview so all three show the same numbers. Everything is null until the
 * client fetch has delivered a payload that carries the monthly aggregates.
 *
 * The computeds live at module scope, like the caches in useApiStats: they
 * depend only on the shared fetch state, so every consumer shares one
 * derivation instead of rebuilding the chain per component.
 */

const stats = apiStatsData;

const monthly = computed(() => {
  const data = stats.value?.monthly;

  if (!data || Object.keys(data.styles).length === 0) {
    return null;
  }

  return data;
});

const styleMonthly = computed(() =>
  monthly.value ? buildMonthlySeries(monthly.value.styles) : null,
);

const currentMonth = computed(() => styleMonthly.value?.months.at(-1) ?? null);

/** "October 2026": the month every ranking figure belongs to. */
const currentMonthLabel = computed(() =>
  currentMonth.value
    ? formatMonthKey(currentMonth.value, { month: 'long', year: 'numeric' })
    : null,
);

/** The month the trend compares with, when it has complete data. */
const previousMonth = computed(() => {
  const months = styleMonthly.value?.months;

  if (!months || months.length < 2 || !currentMonth.value) {
    return null;
  }

  const key = months[months.length - 2];

  return key === previousMonthKey(currentMonth.value) ? key : null;
});

const previousMonthLabel = computed(() =>
  previousMonth.value
    ? formatMonthKey(previousMonth.value, { month: 'long' })
    : null,
);

/** The months the line on a style's page runs over, as short labels. */
const sparkMonths = computed(() =>
  (styleMonthly.value?.months ?? [])
    .slice(-SPARK_MONTHS)
    .map((key) => formatMonthKey(key, { month: 'short', year: 'numeric' })),
);

const rankings = computed<StyleRankingRow[] | null>(() => {
  const series = styleMonthly.value;

  if (!series || !currentMonth.value || !monthly.value) {
    return null;
  }

  const total = monthly.value.referers[currentMonth.value] ?? 0;

  // The stats count whatever the API serves, which under old version paths
  // includes styles that are gone from the current catalog. The docs show
  // the catalog, so names without a docs page stay out of the ranking.
  const names = Object.keys(series.byName);
  const unknown = new Set(findUncategorizedStyles(names));

  const rows = names
    .filter((name) => !unknown.has(name))
    .map((name) => {
      const values = series.byName[name];
      const websites = values[values.length - 1];
      const trend = computeTrend(values, previousMonth.value !== null);

      return {
        rank: 0,
        name,
        websites,
        share: total > 0 ? (websites / total) * 100 : 0,
        growth: trend.growth,
        isNew: trend.isNew,
        spark: values.slice(-SPARK_MONTHS),
      };
    });

  rows.sort((a, b) => b.websites - a.websites);
  rows.forEach((row, index) => {
    row.rank = index + 1;
  });

  return rows;
});

const rankingByName = computed<Record<string, StyleRankingRow> | null>(() => {
  if (!rankings.value) {
    return null;
  }

  return Object.fromEntries(rankings.value.map((row) => [row.name, row]));
});

export function useStyleRankings() {
  // Re-invoked per consumer for its onMounted hook, which starts the fetch
  // on whichever page renders first.
  useApiStatsRaw();

  return {
    stats,
    monthly,
    currentMonth,
    currentMonthLabel,
    previousMonthLabel,
    sparkMonths,
    rankings,
    rankingByName,
  };
}
