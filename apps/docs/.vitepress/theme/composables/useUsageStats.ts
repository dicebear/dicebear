/**
 * The usage numbers of the home page, read from the public stats endpoint
 * after mount: the monthly API requests of the last year, the package
 * downloads of the latest complete month and the websites of the latest
 * complete week. Everything is empty until the numbers have arrived.
 */
import { computed } from 'vue';
import {
  aggregateMonthly,
  formatMonthKey,
  useApiStatsRaw,
} from '@theme/composables/useApiStats';

const MAX_MONTHS = 12;
const WEBSITES_STEP = 10_000;

/** 1.5 billion, 2.29 million: numbers at display size read as words. */
export function spellNumber(value: number): { value: string; unit: string } {
  const trim = (n: number) => String(Number(n.toFixed(2)));

  if (value >= 1e9) {
    return { value: trim(value / 1e9), unit: 'billion' };
  }

  if (value >= 1e6) {
    return { value: trim(value / 1e6), unit: 'million' };
  }

  return { value: value.toLocaleString('en-US'), unit: '' };
}

/** 857M, 1.50B: the short form for chart labels. */
export function compactNumber(value: number): string {
  if (value >= 1e9) {
    return `${(value / 1e9).toFixed(2)}B`;
  }

  if (value >= 1e6) {
    return `${Math.round(value / 1e6)}M`;
  }

  return value.toLocaleString('en-US');
}

export function useUsageStats() {
  const stats = useApiStatsRaw();

  /** Complete months only. A month cut off at either end would read as a dip. */
  const months = computed(() => {
    const requests = stats.value?.requests;

    if (!requests) {
      return [];
    }

    const firstDay = Object.keys(requests).sort()[0] ?? '';
    const all = aggregateMonthly(requests).slice(0, -1);

    return (firstDay.endsWith('-01') ? all : all.slice(1))
      .slice(-MAX_MONTHS)
      .map((month) => ({
        ...month,
        short: formatMonthKey(month.key, { month: 'short', year: 'numeric' }),
        long: formatMonthKey(month.key, { month: 'long', year: 'numeric' }),
        name: formatMonthKey(month.key, { month: 'long' }),
      }));
  });

  const first = computed(() => months.value[0]);
  const last = computed(() => months.value[months.value.length - 1]);

  /** Downloads across every registry in the month the requests end with. */
  const downloads = computed(() => {
    const key = last.value?.key;
    const registries = stats.value?.downloads;

    if (!key || !registries) {
      return 0;
    }

    return Object.values(registries).reduce(
      (sum, daily) =>
        sum +
        (aggregateMonthly(daily ?? {}).find((month) => month.key === key)
          ?.total ?? 0),
      0,
    );
  });

  /** Websites that asked the hosted API in the latest complete week. */
  const websites = computed(() => {
    const referers = stats.value?.weekly?.referers;
    const week = referers ? Object.keys(referers).sort().at(-1) : undefined;
    const count = week && referers ? referers[week] : 0;

    return count >= WEBSITES_STEP
      ? Math.floor(count / WEBSITES_STEP) * WEBSITES_STEP
      : 0;
  });

  return { months, first, last, downloads, websites };
}
