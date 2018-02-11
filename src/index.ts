import SpriteCollection from './model/sprite/collection';

import AvatarModel from './model/avatar';

import Avatar from './model/avatar';
import Color from './model/color';
import Sprite from './model/sprite';

import Random from './helper/random';

export default class Avatars {
  public static model = {
    avatar: Avatar,
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
  public create(seed: string, width: number = null, height: number = null) {
    return new AvatarModel(
      '<svg ' + this.getSvgAttributes(width, height) + '>' + this.getSvgPaths(new Random(seed)) + '</svg>'
    );
  }

  /**
   * Get SVG attributes
   *
   * @param width
   * @param height
   */
  protected getSvgAttributes(width: number = null, height: number = null) {
    let attributes = { ...{}, ...this.spriteCollection.options.svg } as { [key: string]: any };
    let [x, y, originalHeight, originalWidth] = attributes.viewbox
      .replace(/[^\d,]/g, '')
      .split(',')
      .map((val: string) => parseInt(val));

    if (width || height) {
      attributes['width'] = width || originalHeight / originalWidth * width;
      attributes['height'] = height || originalWidth / originalHeight * height;
    }

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
