import { SpriteInterface } from '../sprite';
import Random from '../../helper/random';

export interface CollectionInterface {
  get(random: Random): SpriteInterface[];
}

export default class Collection implements CollectionInterface {
  public width: number;
  public height: number;

  private sprites: SpriteInterface[];

  /**
   * @param sprites
   */
  constructor(sprites: SpriteInterface[], width: number, height: number = width) {
    this.sprites = sprites;
    this.width = width;
    this.height = height;
  }

  /**
   * Returns generated sprite spaths
   *
   * @param random
   */
  get(): SpriteInterface[] {
    return this.sprites;
  }
}

module.exports = Collection;
