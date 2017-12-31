import * as oneColor from 'onecolor';

export default class Color {
  private color: oneColor.Color;

  constructor(color: string) {
    this.color = oneColor(color);
  }

  rgb() {
    return this.color.rgb();
  }

  hsl() {
    return this.color.hsl();
  }

  clone() {
    return new Color(this.color.hex());
  }
}
