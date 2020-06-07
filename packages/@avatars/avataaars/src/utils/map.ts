export function flatten<T>(record: Record<string, T[]>) {
  return Object.keys(record).reduce<T[]>((val, key) => {
    return [...val, ...record[key]];
  }, []);
}
