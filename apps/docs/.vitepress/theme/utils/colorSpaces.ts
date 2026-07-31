import { Color } from '@dicebear/core';

export type Rgb = { r: number; g: number; b: number };
export type Hsl = { h: number; s: number; l: number };
export type Hsv = { h: number; s: number; v: number };

export function clamp(value: number, min: number, max: number): number {
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

export function hexToRgb(hex: string): Rgb {
  const [r, g, b] = Color.parseHex(hex);
  return { r, g, b };
}

export function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (n: number) =>
    clamp(Math.round(n), 0, 255).toString(16).padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function rgbToHsv({ r, g, b }: Rgb): Hsv {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const h = max === min ? 0 : hueFromRgb({ r, g, b }, max, min);
  const s = max === 0 ? 0 : ((max - min) / max) * 100;
  const v = max * 100;

  return { h, s, v };
}

export function hsvToRgb({ h, s, v }: Hsv): Rgb {
  const sn = s / 100;
  const vn = v / 100;
  const c = vn * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = vn - c;

  const [r, g, b] = hueSegment(hp, c, x);

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

export function rgbToHsl({ r, g, b }: Rgb): Hsl {
  const max = Math.max(r, g, b) / 255;
  const min = Math.min(r, g, b) / 255;
  const l = (max + min) / 2;
  const h = max === min ? 0 : hueFromRgb({ r, g, b }, max, min);
  const s =
    max === min
      ? 0
      : l > 0.5
        ? (max - min) / (2 - max - min)
        : (max - min) / (max + min);

  return { h, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }: Hsl): Rgb {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const hp = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hp % 2) - 1));
  const m = ln - c / 2;

  const [r, g, b] = hueSegment(hp, c, x);

  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function hueSegment(
  hp: number,
  c: number,
  x: number,
): [number, number, number] {
  if (hp < 1) return [c, x, 0];
  if (hp < 2) return [x, c, 0];
  if (hp < 3) return [0, c, x];
  if (hp < 4) return [0, x, c];
  if (hp < 5) return [x, 0, c];
  return [c, 0, x];
}

export function hsvToHex(hsv: Hsv): string {
  return rgbToHex(hsvToRgb(hsv));
}

// At S=0 (achromatic), hue is undefined. Preserve the caller's previous hue so
// the canvas crosshair doesn't snap to red when the user picks a gray.
export function rgbToHsvPreservingHue(rgb: Rgb, fallback: Hsv): Hsv {
  const max = Math.max(rgb.r, rgb.g, rgb.b) / 255;
  const min = Math.min(rgb.r, rgb.g, rgb.b) / 255;
  const v = max * 100;
  const s = max === 0 ? 0 : ((max - min) / max) * 100;
  const h = max === min ? fallback.h : hueFromRgb(rgb, max, min);

  return { h, s, v };
}

function hueFromRgb(rgb: Rgb, max: number, min: number): number {
  const rn = rgb.r / 255;
  const gn = rgb.g / 255;
  const bn = rgb.b / 255;
  const delta = max - min;

  let h: number;
  if (max === rn) h = ((gn - bn) / delta) % 6;
  else if (max === gn) h = (bn - rn) / delta + 2;
  else h = (rn - gn) / delta + 4;
  h *= 60;
  if (h < 0) h += 360;
  return h;
}

export function isValidHex(value: string): boolean {
  return /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test(value.trim());
}
