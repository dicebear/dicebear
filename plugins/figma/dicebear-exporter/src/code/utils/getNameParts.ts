import { normalizeName } from './normalizeName';

export function getNameParts(name: string) {
  const parts = name
    .split('/')
    .map((v) => v.trim())
    .filter((v) => v);

  return {
    group: normalizeName(parts.slice(0, -1).join('/')),
    name: normalizeName(parts.pop() ?? 'Unnamed'),
  };
}
