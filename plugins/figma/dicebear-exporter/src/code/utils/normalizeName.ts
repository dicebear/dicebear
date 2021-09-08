export function normalizeName(name: string): string {
  return name
    .replace(/[^a-z0-9]/gi, ' ')
    .trim()
    .split(/\s+/)
    .map((v, k) => {
      if (k === 0) {
        return v.charAt(0).toLowerCase() + v.slice(1);
      }

      return v.charAt(0).toUpperCase() + v.slice(1);
    })
    .join('');
}
