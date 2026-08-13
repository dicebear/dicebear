import { computed } from 'vue';
import { apiStatsData, useApiStatsRaw } from './useApiStats';
import {
  buildWeeklySeries,
  computeTrend,
  formatWeekRange,
  type StyleRankingRow,
} from '../utils/statsTrends';
import { findUncategorizedStyles } from '../config/styleCategories';

const SPARK_WEEKS = 12;

/**
 * The style ranking derived from the stats API's weekly unique-referer
 * counts, shared by the statistics page, the style pages, and the styles
 * overview so all three show the same numbers. Everything is null until the
 * client fetch has delivered a payload that carries the weekly aggregates.
 *
 * The computeds live at module scope, like the caches in useApiStats: they
 * depend only on the shared fetch state, so every consumer shares one
 * derivation instead of rebuilding the chain per component.
 */

const stats = apiStatsData;

const weekly = computed(() => {
  const data = stats.value?.weekly;

  if (!data || Object.keys(data.styles).length === 0) {
    return null;
  }

  return data;
});

const styleWeekly = computed(() =>
  weekly.value ? buildWeeklySeries(weekly.value.styles) : null,
);

const currentWeekLabel = computed(() => {
  const weeks = styleWeekly.value?.weeks;

  if (!weeks || weeks.length === 0) {
    return null;
  }

  return formatWeekRange(weeks[weeks.length - 1]);
});

const rankings = computed<StyleRankingRow[] | null>(() => {
  const sw = styleWeekly.value;

  if (!sw || sw.weeks.length === 0 || !weekly.value) {
    return null;
  }

  const lastWeek = sw.weeks[sw.weeks.length - 1];
  const total = weekly.value.referers[lastWeek] ?? 0;

  // The stats count whatever the API serves, which under old version paths
  // includes styles that are gone from the current catalog. The docs show
  // the catalog, so names without a docs page stay out of the ranking.
  const names = Object.keys(sw.byName);
  const unknown = new Set(findUncategorizedStyles(names));

  const rows = names
    .filter((name) => !unknown.has(name))
    .map((name) => {
      const values = sw.byName[name];
      const websites = values[values.length - 1];
      const trend = computeTrend(values);

      return {
        rank: 0,
        name,
        websites,
        share: total > 0 ? (websites / total) * 100 : 0,
        growth: trend.growth,
        isNew: trend.isNew,
        recentAvg: trend.recentAvg,
        spark: values.slice(-SPARK_WEEKS),
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
    weekly,
    currentWeekLabel,
    rankings,
    rankingByName,
  };
}
