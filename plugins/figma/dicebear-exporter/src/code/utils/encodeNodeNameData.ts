export function encodeNodeNameData(data: Map<string, string>): string {
  return [...data]
    .sort((a, b) => {
      if (a[1].length === b[1].length) {
        return 0;
      }

      return a[1].length === 0 ? 0 : -1;
    })
    .map(([key, val]) => {
      if (val) {
        return `${key}=${val}`;
      }

      return key;
    })
    .join(' ');
}
