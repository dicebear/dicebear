import hexToRgb = require('pure-color/parse/hex');
import rgbToHsv = require('pure-color/convert/rgb2hsv');
import hsvToRgb = require('pure-color/convert/hsv2rgb');

export default class Color {
  public rgb: [number, number, number];

  constructor(color: string | [number, number, number]) {
    if (color instanceof Array) {
      this.rgb = color;
    } else {
      this.hex = color;
    }
  }

  /**
   * Get color hsl value
   */
  get hsl() {
    return rgbToHsv(this.rgb);
  }

  /**
   * Set color hsl value and calculate rgb
   */
  set hsl(hsv: [number, number, number]) {
    this.rgb = hsvToRgb(hsv);
  }

  /**
   * Set color hex value and calculate rgb
   */
  set hex(hex: string) {
    this.rgb = hexToRgb(hex);
  }

  /**
   * Create new color object with same rgb value
   */
  clone() {
    return new Color(this.rgb);
  }
}
