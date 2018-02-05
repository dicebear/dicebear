import { CollectionInterface as ColorCollectionInterface } from './color/collection';
import Color, { ColorInterface } from './color';
import Random from '../helper/random';

import * as SpriteCollection from './sprite/collection';

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

      return group.replace(/(stroke|fill)=["'](.*?)["']/gi, (match, name, value) => {
        return name + '="' + this.calculateColor(value, color) + '"';
      });
    }

    return '';
  }

  /**
   * Calculates the target color
   *
   * @param sourceColor
   * @param targetColor
   */
  private calculateColor(sourceColor: string, targetColor: ColorInterface) {
    let sourceColorRgba = new Color(sourceColor).rgba;
    let targetColorRgba = targetColor.rgba;

    sourceColorRgba[0] = Math.round((255 - targetColorRgba[0]) * (sourceColorRgba[0] / 255) + targetColorRgba[0]);
    sourceColorRgba[1] = Math.round((255 - targetColorRgba[1]) * (sourceColorRgba[1] / 255) + targetColorRgba[1]);
    sourceColorRgba[2] = Math.round((255 - targetColorRgba[2]) * (sourceColorRgba[2] / 255) + targetColorRgba[2]);
    sourceColorRgba[3] = Math.round(sourceColorRgba[3] / 1 * targetColorRgba[3] * 100) / 100;

    let newColor = 'rgba(' + sourceColorRgba.join(',') + ')';

    return sourceColorRgba[3] != 1 ? newColor : new Color(newColor).hex;
  }
}

module.exports = Sprite;
