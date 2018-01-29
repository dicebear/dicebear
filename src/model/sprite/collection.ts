import { SpriteInterface } from '../sprite';
import Random from '../../helper/random';

export interface CollectionInterface {
  get(random: Random): SpriteInterface;
}

export default class Collection implements CollectionInterface {
  private sprites: SpriteInterface[];
  private width: number;
  private height: number;

  /**
   * @param sprites
   */
  constructor(sprites: SpriteInterface[], width: number, height: number = width) {
    this.sprites = sprites;
    this.width = width;
    this.height = height;
  }

  /**
   * Returns a sprite
   *
   * @param random
   */
  get(random: Random): SpriteInterface {
    return null;
  }
}
