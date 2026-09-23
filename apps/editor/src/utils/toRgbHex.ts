/**
 * Normalizes a 3-, 4-, 6- or 8-digit hex color, with or without `#`, to
 * lowercase `#rrggbb` without the alpha channel.
 */
export default function toRgbHex(hex: string): string {
  let h = hex.replace(/^#/, '').toLowerCase();

  if (h.length === 3 || h.length === 4) {
    h = h.replace(/./g, (c) => c + c);
  }

  return '#' + h.slice(0, 6);
}
