import Random from 'lib/helper/random';

import { ColorInterface } from 'lib/model/color';
import { CollectionInterface } from 'lib/model/color/collection';

import Brighter from './brighter';
import Darker from './darker';

/**
 * Ensures that the selected color is darker or brighter than a reference color.
 */
export default class Difference implements CollectionInterface {
  private pickedColors: { [key: string]: ColorInterface } = {};

  private primaryCollection: CollectionInterface;
  private secondaryCollection: CollectionInterface;

  private brighter: Brighter;
  private darker: Darker;

  /**
   * @param colors
   * @param reference
   * @param difference
   */
  constructor(primaryCollection: CollectionInterface, secondaryCollection: CollectionInterface, difference: number) {
    this.primaryCollection = primaryCollection;
    this.secondaryCollection = secondaryCollection;

    this.brighter = new Brighter(primaryCollection, secondaryCollection, difference);
    this.darker = new Darker(primaryCollection, secondaryCollection, difference);
  }

  /**
   * Returns a color
   *
   * @param random
   */
  get(random: Random) {
    if (this.pickedColors[random.seed]) {
      return this.pickedColors[random.seed];
    }

    let primaryColor = this.primaryCollection.get(random);
    let secondaryColor = this.secondaryCollection.get(random);

    let primaryColorHsv = primaryColor.hsv;
    let secondaryColorHsv = secondaryColor.hsv;

    if (primaryColorHsv[2] <= secondaryColorHsv[2]) {
      return (this.pickedColors[random.seed] = this.brighter.get(random));
    } else {
      return (this.pickedColors[random.seed] = this.darker.get(random));
    }
  }
}
