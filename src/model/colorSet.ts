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
   * @param callback
   */
  getColor(random: Random): Promise<Color> {
    if (this.colors instanceof ColorSet) {
      return this.colors.getColor(random);
    } else {
      this.pickedColors[random.seed] = this.pickedColors[random.seed] || random.pickone(this.colors);

      return Promise.resolve(this.pickedColors[random.seed]);
    }
  }
}
