import hexToRgb = require('pure-color/parse/hex');
import rgbToHsv = require('pure-color/convert/rgb2hsv');
import rgbToHex = require('pure-color/convert/rgb2hex');
import hsvToRgb = require('pure-color/convert/hsv2rgb');

import ColorCollection from './color/collection';

export enum ColorType {
  hex = 'hex',
  rgb = 'rgb',
  rgba = 'rgba',
  hsv = 'hsv'
}

export interface ColorInterface {
  alpha: number;
  hex: string;
  rgb: [number, number, number];
  rgba: [number, number, number, number];
  hsv: [number, number, number];
}

export default class Color implements ColorInterface {
  public static collection = ColorCollection;

  public alpha: number = 1;

  private color: {
    rgb?: [number, number, number];
    hsv?: [number, number, number];
    hex?: string;
  };

  constructor(color: string = '#000') {
    this.setString(color);
  }

  set rgb(rgb: [number, number, number]) {
    this.alpha = 1;
    this.color = {
      rgb: rgb
    };
  }

  get rgb() {
    return (this.color.rgb = this.color.rgb || (this.color.hex ? hexToRgb(this.hex) : hsvToRgb(this.hsv)));
  }

  set rgba(rgba: [number, number, number, number]) {
    this.rgb = [rgba[0], rgba[1], rgba[2]];
    this.alpha = rgba[3];
  }

  get rgba() {
    return [this.rgb[0], this.rgb[1], this.rgb[2], this.alpha];
  }

  set hsv(hsv: [number, number, number]) {
    this.alpha = 1;
    this.color = {
      hsv: hsv
    };
  }

  get hsv() {
    return (this.color.hsv = this.color.hsv || rgbToHsv(this.rgb));
  }

  set hex(hex: string) {
    this.alpha = 1;
    this.color = {
      hex: hex
    };
  }

  get hex() {
    return (this.color.hex = this.color.hex || rgbToHex(this.rgb));
  }

  setString(color: string) {
    if (color[0] == '#') {
      this.hex = ColorType.hex;
    } else {
      let match = /(.*)\(.*\)/.exec(color);

      if (match) {
        let values = match[2].split(',').map(val => parseInt(val.trim()));

        switch (match[1].trim()) {
          case ColorType.rgb:
            if (values.length == 3) {
              this.rgb = values as [number, number, number];

              return ColorType.rgb;
            }

            break;

          case ColorType.rgba:
            if (values.length == 4) {
              this.rgba = values as [number, number, number, number];

              return ColorType.rgba;
            }

            break;

          case ColorType.hsv:
            if (values.length == 3) {
              this.hsv = values as [number, number, number];

              return ColorType.hsv;
            }

            break;
        }
      }

      return Error('Unsupported color format: ' + color);
    }
  }

  getString(format: ColorType) {
    switch (format) {
      case ColorType.hex:
        return this.hex;

      case ColorType.hsv:
        return 'hsv(' + this.hsv.join(',') + ')';

      case ColorType.rgb:
        return 'rgb(' + this.rgb.join(',') + ')';

      case ColorType.rgba:
        return 'rgba(' + this.rgba.join(',') + ')';
    }

    return Error('Unsupported color format: ' + format);
  }
}
