/**
 * Trend math for the statistics page, based on the monthly unique-referer
 * counts the stats API reports per style, version, and format. Every month in
 * that data is a complete calendar month, so the values here can be compared
 * without re-checking completeness.
 */

/** The month before a month, both keyed YYYY-MM. */
export function previousMonthKey(key: string): string {
  const [year, month] = key.split('-').map(Number);

  return new Date(Date.UTC(year, month - 2, 1)).toISOString().slice(0, 7);
}

export interface MonthlySeries {
  /** Month keys (YYYY-MM), ascending. */
  months: string[];
  /** Monthly values per name, index-aligned with `months`; missing are 0. */
  byName: Record<string, number[]>;
}

export function buildMonthlySeries(
  source: Record<string, [string, number][]>,
): MonthlySeries {
  const months = Object.keys(source).sort();
  const byName: Record<string, number[]> = {};

  months.forEach((month, index) => {
    for (const [name, value] of source[month]) {
      (byName[name] ??= new Array(months.length).fill(0))[index] = value;
    }
  });

  return { months, byName };
}

export interface Trend {
  /**
   * Relative change of the latest month against the one before it, e.g.
   * 0.42 for +42%. Null when there is no usable baseline: the month before
   * is missing, or the style did not exist in it.
   */
  growth: number | null;
  /** The month before is empty but the style has usage now. */
  isNew: boolean;
}

/**
 * The latest month against the one before it. `comparable` is false when
 * the two are not neighbors, because the months between lost their logs.
 */
export function computeTrend(values: number[], comparable: boolean): Trend {
  if (!comparable || values.length < 2) {
    return { growth: null, isNew: false };
  }

  const latest = values[values.length - 1];
  const baseline = values[values.length - 2];

  // A style first used in either month has no real base to compare against.
  // A percentage would be huge and meaningless, so it reads "New" instead. A
  // style that was already there in the very first recorded month is never
  // "new"; the data cannot tell.
  const firstUsed = values.findIndex((v) => v > 0);
  const startedRecently = firstUsed > 0 && firstUsed >= values.length - 2;

  if (startedRecently && latest > 0) {
    return { growth: null, isNew: true };
  }

  if (baseline === 0) {
    return { growth: null, isNew: false };
  }

  return { growth: (latest - baseline) / baseline, isNew: false };
}

export type GrowthDirection = 'up' | 'down' | 'flat';

export function growthDirection(growth: number | null): GrowthDirection {
  if (growth === null || Math.round(Math.abs(growth) * 100) === 0) {
    return 'flat';
  }

  return growth > 0 ? 'up' : 'down';
}

export function formatGrowth(growth: number | null): string {
  if (growth === null) {
    return '·';
  }

  const pct = Math.round(Math.abs(growth) * 100);

  if (pct === 0) {
    return '0%';
  }

  return `${growth > 0 ? '+' : '-'}${pct}%`;
}

/**
 * The ranking policy for "sort by trend", shared by every consumer: a "New"
 * style outranks any percentage (its growth from zero has no meaningful
 * number), and a style without a trend value sinks below every real one.
 */
export function trendSortValue(row: {
  growth: number | null;
  isNew: boolean;
}): number {
  if (row.isNew) {
    return Number.POSITIVE_INFINITY;
  }

  return row.growth ?? Number.NEGATIVE_INFINITY;
}

/** One row of the style ranking table. */
export interface StyleRankingRow {
  rank: number;
  name: string;
  /** Unique referer hosts in the most recent complete month. */
  websites: number;
  /** Percentage of that month's active websites that used the style. */
  share: number;
  growth: number | null;
  isNew: boolean;
  /** Monthly websites for the line on a style's page, oldest first. */
  spark: number[];
}
