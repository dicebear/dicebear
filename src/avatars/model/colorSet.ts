import Color from './color';
import Random from '../helper/random';

export default class ColorSet {
  private colors: Color[] | ColorSet;
  private pickedColors: { [key: string]: Color } = {};

  /**
   * @param colors
   */
  constructor(colors: Color[] | ColorSet) {
    this.colors = colors;
  }

  /**
   * Returns a color
   *
   * @param random
   */
  getColor(random: Random): Color {
    if (this.colors instanceof ColorSet) {
      return this.colors.getColor(random);
    } else {
      return (this.pickedColors[random.seed] = this.pickedColors[random.seed] || random.pickone(this.colors));
    }
  }
}
