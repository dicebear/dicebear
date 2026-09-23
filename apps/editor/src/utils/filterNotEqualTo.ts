import toRgbHex from '@/utils/toRgbHex';

/**
 * Removes the excluded colors from the candidates, ignoring case, notation
 * and alpha. Keeps all candidates when nothing would be left, as the core
 * does for a `notEqualTo` group.
 */
export default function filterNotEqualTo(
  candidates: readonly string[],
  excluded: readonly string[],
): string[] {
  const normalized = new Set(excluded.map(toRgbHex));
  const filtered = candidates.filter((c) => !normalized.has(toRgbHex(c)));

  return filtered.length > 0 ? filtered : Array.from(candidates);
}
