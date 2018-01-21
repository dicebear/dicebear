import Modifier from './collection/modifier';

import { ColorInterface } from 'lib/model/color';
import Random from 'lib/helper/random';

export interface CollectionInterface {
  get(random: Random): ColorInterface;
}

export default class Collection implements CollectionInterface {
  private colors: ColorInterface[];
  private pickedColors: { [key: string]: ColorInterface } = {};

  /**
   * @param colors
   */
  constructor(colors: ColorInterface[]) {
    this.colors = colors;
  }

  /**
   * Returns a color
   *
   * @param random
   */
  get(random: Random): ColorInterface {
    return (this.pickedColors[random.seed] = this.pickedColors[random.seed] || random.pickone(this.colors));
  }
}
