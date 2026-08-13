import { ref, onMounted } from 'vue';

const STATS_API_URL = 'https://api.dicebear.com/stats.json';
const MONTH_KEY_LENGTH = 7;

export interface StatsWeekly {
  /** Unique referer hosts per complete week, keyed by the week's Monday. */
  referers: Record<string, number>;
  /** Unique referer hosts per style and complete week, ranked per week. */
  styles: Record<string, [string, number][]>;
  versions: Record<string, [string, number][]>;
  formats: Record<string, [string, number][]>;
  /**
   * Weeks whose logs were only partially collected. Their referer counts
   * are removed from the records above, so charts and trends skip them;
   * the list itself is currently unused by the docs.
   */
  gaps?: string[];
}

export interface StatsData {
  requests: Record<string, number>;
  traffic: Record<string, number>;
  downloads: {
    npm: Record<string, number>;
    /** Absent while a CDN-cached response predates the extra registries. */
    packagist?: Record<string, number>;
    pypi?: Record<string, number>;
    crates?: Record<string, number>;
  };
  styles: Record<string, [string, number][]>;
  versions: Record<string, [string, number][]>;
  formats: Record<string, [string, number][]>;
  /** Absent while a CDN-cached response predates the weekly aggregates. */
  weekly?: StatsWeekly;
}

interface ApiStats {
  monthlyRequests: number;
  monthlyTraffic: number;
  monthlyNpmDownloads: number;
  monthLabel: string;
}

const cached = ref<ApiStats | null>(null);
const rawData = ref<StatsData | null>(null);
let fetching: Promise<void> | null = null;

export interface MonthlyEntry {
  key: string;
  total: number;
}

export function aggregateMonthly(
  daily: Record<string, number>,
): MonthlyEntry[] {
  const monthly: Record<string, number> = {};

  for (const [date, value] of Object.entries(daily)) {
    const key = date.slice(0, MONTH_KEY_LENGTH);
    monthly[key] = (monthly[key] || 0) + value;
  }

  return Object.entries(monthly)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, total]) => ({ key, total }));
}

export function formatMonthKey(
  key: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const [y, m] = key.split('-');

  return new Date(Number(y), Number(m) - 1).toLocaleDateString('en', options);
}

export function lastCompleteMonth(
  daily: Record<string, number>,
): { total: number; label: string } | null {
  const months = aggregateMonthly(daily);

  if (months.length < 2) {
    return null;
  }

  const last = months[months.length - 2];
  const label = formatMonthKey(last.key, { month: 'short', year: 'numeric' });

  return { total: last.total, label };
}

async function doFetch() {
  try {
    const res = await fetch(STATS_API_URL);
    const data: StatsData = await res.json();
    rawData.value = data;

    const requests = lastCompleteMonth(data.requests);
    const traffic = lastCompleteMonth(data.traffic);
    const npmDownloads = lastCompleteMonth(data.downloads?.npm ?? {});

    if (!requests || !traffic) {
      return;
    }

    cached.value = {
      monthlyRequests: requests.total,
      monthlyTraffic: traffic.total,
      monthlyNpmDownloads: npmDownloads?.total ?? 0,
      monthLabel: requests.label,
    };
  } catch (err) {
    console.warn('[useApiStats] Failed to fetch stats:', err);
  } finally {
    fetching = null;
  }
}

function ensureFetched() {
  if (!cached.value && !fetching) {
    fetching = doFetch();
  }
}

export function useApiStats() {
  onMounted(ensureFetched);

  return cached;
}

export function useApiStatsRaw() {
  onMounted(ensureFetched);

  return rawData;
}

/**
 * The same payload without the fetch-on-mount hookup, for module-scope
 * derivations that cannot register lifecycle hooks (useStyleRankings).
 */
export const apiStatsData = rawData;
