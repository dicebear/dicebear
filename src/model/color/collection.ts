import Modifier from './collection/modifier';

import { ColorInterface } from '../color';
import Random from '../../helper/random';

export interface CollectionInterface {
  get(random: Random): ColorInterface;
}

export default class Collection implements CollectionInterface {
  public static modifier = Modifier;

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
