/**
 * The series the statistics page draws, derived from the stats API: weekly
 * request totals, one weekly download series per registry, the latest
 * complete month's headline numbers, the request rate for the map, and the
 * share of API versions and output formats in the most recent complete week.
 */
import { computed } from 'vue';
import { aggregateMonthly, lastCompleteMonth } from './useApiStats';
import { useStyleRankings } from './useStyleRankings';
import { formatWeekRange, shiftDays, weekStartKey } from '../utils/statsTrends';

const SECONDS_PER_DAY = 86400;
const ROLLING_WINDOW_DAYS = 7;

export interface StatsSeries {
  labels: string[];
  values: number[];
}

export interface StatsShare {
  name: string;
  share: number;
}

/** One tab per registry the ports are published on. */
export const DOWNLOAD_SOURCES = [
  { key: 'npm', label: 'npm', color: '#cb3837' },
  { key: 'packagist', label: 'Packagist', color: '#f28d1a' },
  { key: 'pypi', label: 'PyPI', color: '#3775a9' },
  { key: 'crates', label: 'crates.io', color: '#b7410e' },
] as const;

export type DownloadSourceKey = (typeof DOWNLOAD_SOURCES)[number]['key'];

/** Weeks with both ends inside the data, so a partial first or last week is not drawn as a dip. */
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

function aggregateWeekly(data: Record<string, number>): StatsSeries {
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

/** Headline numbers read as words at display size: 1.35 billion, 4.76 TB. */
function spellNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)} billion`;
  }
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)} million`;
  }
  return value.toLocaleString('en-US');
}

function spellBytes(bytes: number): string {
  if (bytes >= 1e12) {
    return `${(bytes / 1e12).toFixed(2)} TB`;
  }
  if (bytes >= 1e9) {
    return `${(bytes / 1e9).toFixed(1)} GB`;
  }
  return `${(bytes / 1e6).toFixed(0)} MB`;
}

export function useStatsCharts() {
  const { stats, weekly, currentWeekLabel, rankings } = useStyleRankings();

  const requests = computed<StatsSeries | null>(() =>
    stats.value ? aggregateWeekly(stats.value.requests) : null,
  );

  // Every registry chart runs on one shared week axis, so switching tabs
  // never changes the time range. Weeks a registry reports nothing for
  // count as zero; the young ports simply had no downloads back then.
  const downloads = computed(() => {
    const data = stats.value?.downloads;
    if (!data) {
      return [];
    }
    const sources = DOWNLOAD_SOURCES.map((source) => ({
      ...source,
      daily: data[source.key] ?? {},
    })).filter((source) => Object.keys(source.daily).length > 0);
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
        series: { labels, values: axis.map((week) => sums[week] ?? 0) },
      };
    });
  });

  /** Average requests per second across the last seven complete days. */
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
    return total / window.length / SECONDS_PER_DAY;
  });

  const month = computed(() => {
    if (!stats.value) {
      return null;
    }
    const total = lastCompleteMonth(stats.value.requests);
    const traffic = lastCompleteMonth(stats.value.traffic);
    if (!total) {
      return null;
    }
    // Every registry counts, summed over the month the requests come from.
    const downloads = Object.values(stats.value.downloads).reduce(
      (sum, daily) =>
        sum +
        (aggregateMonthly(daily ?? {}).find((m) => m.key === total.key)
          ?.total ?? 0),
      0,
    );
    return {
      label: total.label,
      requests: spellNumber(total.total),
      traffic: traffic ? spellBytes(traffic.total) : null,
      downloads: downloads > 0 ? spellNumber(downloads) : null,
    };
  });

  /** Share of the websites active in the latest complete week, per name. */
  function latestShares(
    source: Record<string, [string, number][]> | undefined,
  ): StatsShare[] {
    const referers = weekly.value?.referers;
    if (!source || !referers) {
      return [];
    }
    const week = Object.keys(referers).sort().at(-1);
    if (!week || !source[week] || !referers[week]) {
      return [];
    }
    return source[week]
      .map(([name, count]) => ({ name, share: (count / referers[week]) * 100 }))
      .sort((a, b) => b.share - a.share);
  }

  const versions = computed(() => latestShares(weekly.value?.versions));
  const formats = computed(() => latestShares(weekly.value?.formats));

  const websites = computed(() => {
    const referers = weekly.value?.referers;
    if (!referers) {
      return null;
    }
    const week = Object.keys(referers).sort().at(-1);
    return week ? referers[week] : null;
  });

  return {
    stats,
    rankings,
    currentWeekLabel,
    requests,
    downloads,
    requestsPerSecond,
    month,
    versions,
    formats,
    websites,
  };
}
