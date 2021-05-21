export function getFilename(seed?: string, format: string = 'svg') {
  if (seed) {
    return `${decodeURIComponent(seed)}.${Date.now()}.${format}`;
  }

  return `${Date.now()}.${format}`;
}
