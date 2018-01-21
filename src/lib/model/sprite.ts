import { CollectionInterface as ColorCollectionInterface } from 'lib/model/color/collection';
import Random from 'lib/helper/random';

import SpriteCollection from './sprite/collection';

export interface SpriteInterface {
  get(random: Random): string;
}

export default class Sprite implements SpriteInterface {
  public static collection = SpriteCollection;

  protected groups: string;
  protected colorCollection: ColorCollectionInterface;
  protected chance: number;

  /**
   * @param paths
   * @param colorCollection
   * @param chance
   */
  constructor(groups: string, colorCollection: ColorCollectionInterface, chance: number = 100) {
    this.groups = groups;
    this.colorCollection = colorCollection;
    this.chance = chance;
  }

  /**
   * Creates an sprite
   *
   * @param random
   */
  get(random: Random): string {
    return '';
  }
}
