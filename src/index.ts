import SpriteCollection from './model/sprite/collection';

import Color from './model/color';
import Sprite from './model/sprite';

import Random from './helper/random';

export default class Avatars {
  public static model = {
    color: Color,
    sprite: Sprite
  };

  protected spriteCollection: SpriteCollection;

  /**
   * @param spriteCollection
   */
  public constructor(spriteCollection: SpriteCollection) {
    this.spriteCollection = spriteCollection;
  }

  /**
   * Creates an avatar
   *
   * @param seed
   */
  public create(seed: string) {
    return '<svg ' + this.getSvgAttributes() + '>' + this.getSvgPaths(new Random(seed)) + '</svg>';
  }

  /**
   * Get SVG attributes
   */
  protected getSvgAttributes() {
    let attributes = { ...{}, ...(this.spriteCollection.options.svg || {}) } as { [key: string]: any };
    let [x, y] = attributes.viewbox
      .replace(/[^\d,]/g, '')
      .split(',')
      .map((val: string) => parseInt(val));

    return Object.keys(attributes)
      .map(key => {
        return key + '="' + attributes[key] + '"';
      })
      .join('');
  }

  /**
   * Get generated SVG paths
   *
   * @param random
   */
  protected getSvgPaths(random: Random) {
    return this.spriteCollection.get(random).join('');
  }
}
