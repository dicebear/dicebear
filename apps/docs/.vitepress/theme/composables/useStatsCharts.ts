/**
 * The series the statistics page draws, derived from the stats API: monthly
 * request totals, one monthly download series per registry, the latest
 * complete month's headline numbers, the request rate of that month, and
 * the share of API versions and output formats in the most recent complete
 * month.
 */
import { computed } from 'vue';
import {
  aggregateMonthly,
  formatMonthKey,
  completeMonths,
  daysInMonth,
  lastCompleteMonth,
} from './useApiStats';
import { useStyleRankings } from './useStyleRankings';

const SECONDS_PER_DAY = 86400;

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

function monthLabel(key: string): string {
  return formatMonthKey(key, { month: 'short', year: 'numeric' });
}

/** Headline numbers read as words at display size: 1.35 billion, 4.76 TB. */
/** A figure split into its number and its unit, which show at two sizes. */
export interface StatsFigure {
  value: string;
  unit: string;
}

export function spellNumber(value: number): StatsFigure {
  if (value >= 1e9) {
    return { value: (value / 1e9).toFixed(2), unit: 'billion' };
  }
  if (value >= 1e6) {
    return { value: (value / 1e6).toFixed(2), unit: 'million' };
  }
  return { value: Math.round(value).toLocaleString('en-US'), unit: '' };
}

/** 2.26M, 22.1k: the short form for the small registry figures. */
function shortNumber(value: number): string {
  if (value >= 1e6) {
    return `${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${(value / 1e3).toFixed(1)}k`;
  }
  return String(value);
}

function spellBytes(bytes: number): StatsFigure {
  if (bytes >= 1e12) {
    return { value: (bytes / 1e12).toFixed(2), unit: 'TB' };
  }
  if (bytes >= 1e9) {
    return { value: (bytes / 1e9).toFixed(1), unit: 'GB' };
  }
  return { value: (bytes / 1e6).toFixed(0), unit: 'MB' };
}

export function useStatsCharts() {
  const { stats, monthly, currentMonth, currentMonthLabel, rankings } =
    useStyleRankings();

  const requests = computed<StatsSeries | null>(() => {
    if (!stats.value) {
      return null;
    }
    const months = completeMonths(stats.value.requests);
    return {
      labels: months.map((month) => monthLabel(month.key)),
      values: months.map((month) => month.total),
    };
  });

  // Every registry chart runs on one shared month axis, so switching tabs
  // never changes the time range. Months a registry reports nothing for
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
    const axis = completeMonths(
      Object.assign({}, ...sources.map((source) => source.daily)),
    ).map((month) => month.key);
    if (axis.length === 0) {
      return [];
    }
    const labels = axis.map(monthLabel);
    return sources.map(({ daily, ...source }) => {
      const sums = Object.fromEntries(
        aggregateMonthly(daily).map((month) => [month.key, month.total]),
      );
      return {
        ...source,
        series: { labels, values: axis.map((key) => sums[key] ?? 0) },
      };
    });
  });

  /** Average requests per second across the latest complete month. */
  const requestsPerSecond = computed(() => {
    const latest = stats.value ? lastCompleteMonth(stats.value.requests) : null;
    if (!latest) {
      return 0;
    }
    return latest.total / (daysInMonth(latest.key) * SECONDS_PER_DAY);
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
    const registries = DOWNLOAD_SOURCES.map((source) => ({
      label: source.label,
      total:
        aggregateMonthly(stats.value?.downloads[source.key] ?? {}).find(
          (m) => m.key === total.key,
        )?.total ?? 0,
    })).filter((registry) => registry.total > 0);
    const downloads = registries.reduce((sum, r) => sum + r.total, 0);
    const websites = monthly.value?.referers[total.key] ?? null;
    return {
      key: total.key,
      label: formatMonthKey(total.key, { month: 'long', year: 'numeric' }),
      requests: spellNumber(total.total),
      traffic: traffic ? spellBytes(traffic.total) : null,
      downloads: downloads > 0 ? spellNumber(downloads) : null,
      registries: registries.map((r) => ({
        label: r.label,
        value: shortNumber(r.total),
      })),
      websites,
    };
  });

  /** Share of the websites active in the latest complete month, per name. */
  function latestShares(
    source: Record<string, [string, number][]> | undefined,
  ): StatsShare[] {
    const key = currentMonth.value;
    const total = key ? monthly.value?.referers[key] : undefined;
    if (!source || !key || !source[key] || !total) {
      return [];
    }
    return source[key]
      .map(([name, count]) => ({ name, share: (count / total) * 100 }))
      .sort((a, b) => b.share - a.share);
  }

  const versions = computed(() => latestShares(monthly.value?.versions));
  const formats = computed(() => latestShares(monthly.value?.formats));

  return {
    stats,
    rankings,
    currentMonthLabel,
    requests,
    downloads,
    requestsPerSecond,
    month,
    versions,
    formats,
  };
}
