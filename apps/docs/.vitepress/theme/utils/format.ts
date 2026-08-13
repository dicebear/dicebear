export interface NumberParts {
  value: string;
  unit: string;
}

export function formatNumberParts(value: number): NumberParts {
  if (value >= 1e12) return { value: (value / 1e12).toFixed(1), unit: 'T' };
  if (value >= 1e9) return { value: (value / 1e9).toFixed(1), unit: 'B' };
  if (value >= 1e6) return { value: (value / 1e6).toFixed(0), unit: 'M' };
  if (value >= 1e3) return { value: (value / 1e3).toFixed(0), unit: 'K' };

  return { value: value.toLocaleString('en'), unit: '' };
}

export function formatNumber(value: number): string {
  const { value: v, unit } = formatNumberParts(value);

  return `${v}${unit}`;
}

export function formatBytesParts(bytes: number): NumberParts {
  if (bytes >= 1e12) return { value: (bytes / 1e12).toFixed(1), unit: 'TB' };
  if (bytes >= 1e9) return { value: (bytes / 1e9).toFixed(0), unit: 'GB' };
  if (bytes >= 1e6) return { value: (bytes / 1e6).toFixed(0), unit: 'MB' };

  return { value: String(bytes), unit: '' };
}

export function formatBytes(bytes: number): string {
  const { value, unit } = formatBytesParts(bytes);

  return `${value}${unit}`;
}

export function formatPercent(value: number): string {
  if (value === 0) {
    return '0%';
  }

  if (value < 0.1) {
    return '<0.1%';
  }

  return `${value.toFixed(1)}%`;
}

export function formatLicenseName(name: string | undefined): string {
  return name?.replace(/\.$/, '') ?? '';
}

// Mirrors GitHub's own display: round to the nearest 0.1k and drop a
// trailing .0, so 9151 renders as "9.2k" just like on the repo page.
export function formatStars(count: number): string {
  if (count >= 1000) {
    const k = Math.round((count / 1000) * 10) / 10;

    return `${k}k`;
  }

  return `${count}`;
}
