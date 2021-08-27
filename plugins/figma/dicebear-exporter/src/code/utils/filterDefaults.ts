export function filterDefaults(defaults: Record<string, boolean>): string[] {
  return Object.entries(defaults)
    .filter(([, value]) => value)
    .map(([key]) => key);
}
