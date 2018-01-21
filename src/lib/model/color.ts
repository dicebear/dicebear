import hexToRgb = require('pure-color/parse/hex');
import rgbToHsv = require('pure-color/convert/rgb2hsv');
import rgbToHex = require('pure-color/convert/rgb2hex');
import hsvToRgb = require('pure-color/convert/hsv2rgb');

import ColorCollection from './color/collection';

export enum ColorType {
  rgb = 'rgb',
  hsv = 'hsv'
}

export interface ColorInterface {
  hex: string;
  rgb: [number, number, number];
  hsv: [number, number, number];
}

export default class Color implements ColorInterface {
  public static collection = ColorCollection;

  private color: {
    rgb?: [number, number, number];
    hsv?: [number, number, number];
    hex?: string;
  };

  constructor(color: string | [number, number, number], type: ColorType = ColorType.rgb) {
    if (color instanceof Array) {
      switch (type) {
        case ColorType.rgb:
          this.rgb = color;
          break;

        case ColorType.hsv:
          this.hsv = color;
          break;
      }
    } else {
      this.hex = color;
    }
  }

  set rgb(rgb: [number, number, number]) {
    this.color = {
      rgb: rgb
    };
  }

  get rgb() {
    return (this.color.rgb = this.color.rgb || (this.color.hex ? hexToRgb(this.hex) : hsvToRgb(this.hsv)));
  }

  set hsv(hsv: [number, number, number]) {
    this.color = {
      hsv: hsv
    };
  }

  get hsv() {
    return (this.color.hsv = this.color.hsv || rgbToHsv(this.rgb));
  }

  set hex(hex: string) {
    this.color = {
      hex: hex
    };
  }

  get hex() {
    return (this.color.hex = this.color.hex || rgbToHex(this.rgb));
  }
}
