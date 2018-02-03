import Random from '../../../../../helper/random';

import Color, { ColorInterface } from '../../../../color';
import { CollectionInterface } from '../../../collection';

/**
 * Returns the color in different transparency.
 */
export default class Variant implements CollectionInterface {
  private pickedColors: { [key: string]: ColorInterface } = {};

  private collection: CollectionInterface;
  private variants: number[];

  constructor(collection: CollectionInterface, variants: number[]) {
    this.collection = collection;
    this.variants = variants;
  }

  get(random: Random) {
    if (this.pickedColors[random.seed]) {
      return this.pickedColors[random.seed];
    }

    let color = this.collection.get(random);

    this.pickedColors[random.seed] = new Color('rgb(' + color.rgb.join(',') + ')');
    this.pickedColors[random.seed].alpha = random.pickone(this.variants);

    console.log(this.pickedColors[random.seed].alpha);

    return this.pickedColors[random.seed];
  }
}

module.exports = Variant;
