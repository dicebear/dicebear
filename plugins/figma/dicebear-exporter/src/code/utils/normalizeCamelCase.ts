export function normalizeCamelCase(val: string) {
  return val
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase());
}
