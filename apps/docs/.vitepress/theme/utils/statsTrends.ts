/**
 * Trend math for the statistics page, based on the weekly unique-referer
 * counts the stats API reports per style, version, and format. Every week in
 * that data is a complete Monday-to-Sunday week, so the values here can be
 * compared without re-checking completeness.
 */

/** How many trailing weeks a trend compares against the weeks before them. */
const TREND_WINDOW_WEEKS = 4;

const DAY_MS = 86_400_000;

/** The Monday of the week a date belongs to, e.g. "2026-08-05" -> "2026-08-03". */
export function weekStartKey(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const dow = d.getUTCDay();
  const offset = (dow + 6) % 7;

  d.setUTCDate(d.getUTCDate() - offset);

  return d.toISOString().slice(0, 10);
}

export function shiftDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T00:00:00Z`);

  d.setUTCDate(d.getUTCDate() + days);

  return d.toISOString().slice(0, 10);
}

/** "2026-08-03" -> "Aug 3–9"; crosses month borders as "Aug 31 – Sep 6". */
export function formatWeekRange(weekStartStr: string): string {
  const start = new Date(weekStartStr);
  const end = new Date(start.getTime() + 6 * DAY_MS);
  const fmt = (d: Date) =>
    d.toLocaleDateString('en', { month: 'short', day: 'numeric' });

  if (start.getMonth() === end.getMonth()) {
    return `${fmt(start)}–${end.getDate()}`;
  }

  return `${fmt(start)} – ${fmt(end)}`;
}

export interface WeeklySeries {
  /** Week start dates (Mondays, YYYY-MM-DD), ascending. */
  weeks: string[];
  /** Weekly values per name, index-aligned with `weeks`; missing weeks are 0. */
  byName: Record<string, number[]>;
}

export function buildWeeklySeries(
  source: Record<string, [string, number][]>,
): WeeklySeries {
  const weeks = Object.keys(source).sort();
  const byName: Record<string, number[]> = {};

  weeks.forEach((week, index) => {
    for (const [name, value] of source[week]) {
      (byName[name] ??= new Array(weeks.length).fill(0))[index] = value;
    }
  });

  return { weeks, byName };
}

export interface Trend {
  /**
   * Relative change of the recent window against the one before it, e.g.
   * 0.42 for +42%. Null when there is no usable baseline: the series is too
   * short, or the style did not exist in the baseline window.
   */
  growth: number | null;
  /** The baseline window is empty but the style has recent usage. */
  isNew: boolean;
  /** Average weekly value across the recent window. */
  recentAvg: number;
}

function average(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function computeTrend(values: number[]): Trend {
  const window = TREND_WINDOW_WEEKS;
  const recentAvg = average(values.slice(-window));
  const baseline = values.slice(-2 * window, -window);
  const baselineAvg = average(baseline);

  if (baseline.length < window) {
    return { growth: null, isNew: false, recentAvg };
  }

  // A style whose first usage falls inside the baseline window (or later)
  // has no real base to compare against. A percentage would be huge and
  // meaningless, so it reads "New" instead. A style that was already there
  // in the very first recorded week is never "new"; the data cannot tell.
  const firstUsed = values.findIndex((v) => v > 0);
  const startedRecently =
    firstUsed > 0 && firstUsed >= values.length - 2 * window;

  if (startedRecently && recentAvg > 0) {
    return { growth: null, isNew: true, recentAvg };
  }

  if (baselineAvg === 0) {
    return { growth: null, isNew: false, recentAvg };
  }

  return {
    growth: (recentAvg - baselineAvg) / baselineAvg,
    isNew: false,
    recentAvg,
  };
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
  /** Unique referer hosts in the most recent complete week. */
  websites: number;
  /** Percentage of that week's active websites that used the style. */
  share: number;
  growth: number | null;
  isNew: boolean;
  /** Average weekly websites across the recent trend window. */
  recentAvg: number;
  /** Weekly websites for the sparkline, oldest first. */
  spark: number[];
}
