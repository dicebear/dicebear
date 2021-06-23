export function omit<O extends {}, K extends keyof O>(obj: O, key: K): Omit<O, K> {
  let { [key]: omitted, ...result } = obj;

  return result;
}
