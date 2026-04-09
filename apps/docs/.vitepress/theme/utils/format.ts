export function formatNumber(value: number): string {
  if (value >= 1e12) return `${(value / 1e12).toFixed(1)}T`;
  if (value >= 1e9) return `${(value / 1e9).toFixed(1)}B`;
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
  if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;

  return value.toLocaleString('en');
}

export function formatLicenseName(name: string | undefined): string {
  return name?.replace(/\.$/, '') ?? '';
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1e12) return `${(bytes / 1e12).toFixed(1)}TB`;
  if (bytes >= 1e9) return `${(bytes / 1e9).toFixed(0)}GB`;
  if (bytes >= 1e6) return `${(bytes / 1e6).toFixed(0)}MB`;

  return `${bytes}`;
}

export function formatStars(count: number): string {
  if (count >= 1000) {
    const k = Math.floor((count / 1000) * 10) / 10;

    return `${k}k+`;
  }

  return `${count}+`;
}
