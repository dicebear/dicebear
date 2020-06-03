// @ts-ignore
import * as hexToRgb from 'pure-color/parse/hex';
// @ts-ignore
import * as rgbToHsv from 'pure-color/convert/rgb2hsv';
// @ts-ignore
import * as rgbToHex from 'pure-color/convert/rgb2hex';
// @ts-ignore
import * as hsvToRgb from 'pure-color/convert/hsv2rgb';

function hexToHsl(color: string): number[] {
  return rgbToHsv(hexToRgb(color));
}

function hsvToHex(color: number[]): string {
  return rgbToHex(hsvToRgb(color));
}

export function brighterOrDarkerThan(color1: string, color2: string, difference: number) {
  let color1Hsl = hexToHsl(color1);
  let color2Hsl = hexToHsl(color2);

  if (color1Hsl[2] <= color2Hsl[2]) {
    return this.darkerThan(color1, color2, difference);
  } else {
    return this.lighterThan(color1, color2, difference);
  }
}

export function darkerThan(color1: string, color2: string, difference: number) {
  let color1Hsl = hexToHsl(color1);
  let color2Hsl = hexToHsl(color2);

  if (color1Hsl[2] >= color2Hsl[2] + difference) {
    return this;
  }

  color1Hsl[2] = color2Hsl[2] + difference;

  if (color1Hsl[2] > 360) {
    color1Hsl[2] = 360;
  }

  return hsvToHex(color1Hsl);
}

export function lighterThan(color1: string, color2: string, difference: number) {
  let color1Hsl = hexToHsl(color1);
  let color2Hsl = hexToHsl(color2);

  if (color1Hsl[2] <= color2Hsl[2] - difference) {
    return this;
  }

  color1Hsl[2] = color2Hsl[2] - difference;

  if (color1Hsl[2] < 0) {
    color1Hsl[2] = 0;
  }

  return hsvToHex(color1Hsl);
}
