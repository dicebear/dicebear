export function objectMap<T extends {}, R>(obj: T, fn: (val: T[keyof T], key: keyof T) => R): Record<keyof T, R> {
  const result = {} as Record<keyof T, R>;

  Object.keys(obj).forEach((key) => {
    result[key as keyof T] = fn(obj[key as keyof T], key as keyof T);
  });

  return result;
}
