import { SpriteInterface } from '../sprite';
import Random from '../../helper/random';

export interface CollectionInterface {
  get(random: Random): string[];
}

export interface CollectionOptions {
  svg?: { [key: string]: any };
}

export default class Collection implements CollectionInterface {
  public options: CollectionOptions;

  private sprites: SpriteInterface[] = [];
  private pickedSprites: { [key: string]: string[] } = {};

  /**
   * @param sprites
   */
  constructor(sprites: SpriteInterface[], size: number, options: CollectionOptions = {}) {
    this.sprites = sprites;

    let defaultOptions = {
      svg: {
        xmlns: 'http://www.w3.org/2000/svg',
        'xmlns:xlink': 'http://www.w3.org/1999/xlink',
        viewbox: [0, 0, size, size].join(','),
        version: 1.1,
        'shape-rendering': 'crispEdges'
      }
    };

    // Typeescript does not offer a Polyfill for `Object.assign`, but for Object spread syntax.
    this.options = {};
    this.options.svg = { ...defaultOptions.svg, ...(options.svg || {}) };
  }

  /**
   * Returns sprite set
   *
   * @param random
   */
  get(random: Random): string[] {
    return (this.pickedSprites[random.seed] =
      this.pickedSprites[random.seed] || this.sprites.map(sprite => sprite.get(random)));
  }
}
