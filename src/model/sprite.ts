import { CollectionInterface as ColorCollectionInterface } from './color/collection';
import { ColorInterface, default as Color } from './color';
import Random from '../helper/random';

import SpriteCollection from './sprite/collection';

export interface SpriteInterface {
  get(random: Random): string;
}

export default class Sprite implements SpriteInterface {
  public static collection = SpriteCollection;

  protected groups: string[];
  protected colorCollection: ColorCollectionInterface;
  protected chance: number;

  /**
   * @param paths
   * @param colorCollection
   * @param chance
   */
  constructor(groups: string[], colorCollection: ColorCollectionInterface, chance: number = 100) {
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
    if (random.bool(this.chance)) {
      let group = random.pickone(this.groups);
      let color = this.colorCollection.get(random);

      group.replace(/(stroke|fill)=["'](.*?)["']/, (match, name, value) => {
        return name + '="' + this.calculateColor(value, color) + '"';
      });
    }

    return '';
  }

  calculateColor(sourceColor: string, targetColor: ColorInterface) {
    let sourceColorModel = new Color(sourceColor);
  }
}
