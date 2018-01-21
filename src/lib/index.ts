import SpriteCollection from './model/sprite/collection';

import Avatar from './model/avatar';
import Color from './model/color';
import Sprite from './model/sprite';

import Random from './helper/random';

export default class Avatars {
  public static model = {
    avatar: Avatar,
    color: Color,
    spirte: Sprite
  };

  protected spriteCollection: SpriteCollection;

  /**
   * @param spriteCollection
   * @param options
   */
  public constructor(spriteCollection: SpriteCollection) {
    this.spriteCollection = spriteCollection;
  }

  /**
   * Creates an avatar
   *
   * @param seed
   */
  public async create(seed: string) {
    let random = new Random(seed);

    return new Avatar('');
  }
}
