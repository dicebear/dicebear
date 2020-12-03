export function chunk<T>(arr: T[], size: number): T[][] {
  let result: T[][] = [];

  do {
    result.push(arr.splice(0, size));
  } while (arr.length > 0);

  return result;
}
