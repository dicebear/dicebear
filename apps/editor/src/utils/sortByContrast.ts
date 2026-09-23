import toRgbHex from '@/utils/toRgbHex';

/**
 * Orders the candidates by their WCAG 2.1 contrast ratio against the
 * reference color, highest first, as the core does for a `contrastTo` group.
 * The sort is stable, so a tie keeps the declared order.
 */
export default function sortByContrast(
  candidates: readonly string[],
  refColor: string,
): string[] {
  const refLuminance = getLuminance(refColor);

  return candidates
    .map((color) => {
      const l = getLuminance(color);
      const ratio =
        (Math.max(l, refLuminance) + 0.05) / (Math.min(l, refLuminance) + 0.05);

      return { color, ratio };
    })
    .sort((a, b) => b.ratio - a.ratio)
    .map((entry) => entry.color);
}

function getLuminance(hex: string): number {
  const h = toRgbHex(hex);
  const r = linearize(parseInt(h.slice(1, 3), 16));
  const g = linearize(parseInt(h.slice(3, 5), 16));
  const b = linearize(parseInt(h.slice(5, 7), 16));

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function linearize(channel: number): number {
  const s = channel / 255;

  return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}
