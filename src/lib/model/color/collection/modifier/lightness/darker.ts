import Random from 'lib/helper/random';

import { default as Color, ColorInterface, ColorType } from 'lib/model/color';
import { CollectionInterface } from 'lib/model/color/collection';

/**
 * Ensures that the selected color is darker than a reference color.
 */
export default class Darker implements CollectionInterface {
  private pickedColors: { [key: string]: ColorInterface } = {};

  private primaryCollection: CollectionInterface;
  private secondaryCollection: CollectionInterface;

  private difference: number;

  constructor(primaryCollection: CollectionInterface, secondaryCollection: CollectionInterface, difference: number) {
    this.primaryCollection = primaryCollection;
    this.secondaryCollection = secondaryCollection;

    this.difference = difference;
  }

  get(random: Random) {
    if (this.pickedColors[random.seed]) {
      return this.pickedColors[random.seed];
    }

    let primaryColor = this.primaryCollection.get(random);
    let secondaryColor = this.secondaryCollection.get(random);

    let primaryColorHsv = primaryColor.hsv;
    let secondaryColorHsv = secondaryColor.hsv;

    if (primaryColorHsv[2] <= secondaryColorHsv[2] - this.difference) {
      return (this.pickedColors[random.seed] = primaryColor);
    }

    primaryColorHsv[2] = primaryColorHsv[2] - this.difference;

    if (primaryColorHsv[2] < 0) {
      primaryColorHsv[2] = 0;
    }

    return (this.pickedColors[random.seed] = new Color(primaryColorHsv, ColorType.hsv));
  }
}
