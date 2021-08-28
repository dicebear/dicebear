export function decodeNodeNameData(name: string): Map<string, string> {
  return new Map(
    name.split(' ').map((val) => {
      const [key, ...value] = val.split('=');

      return [key, value.join('=').replace(/\_\d+$/, '')];
    })
  );
}
