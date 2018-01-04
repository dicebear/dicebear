import Avatar from './model/avatar';
import { SpriteSetInterface } from './spriteSet';
import { createCanvas, createImage } from './helper/canvas';

import Random from './helper/random';

import maleSpriteSet from './spriteSet/male';
import femaleSpriteSet from './spriteSet/female';
import identiconSpriteSet from './spriteSet/identicon';
import Sprite from './model/sprite';

export default class Avatars {
  public static SPRITE_SETS = {
    male: maleSpriteSet,
    female: femaleSpriteSet,
    identicon: identiconSpriteSet
  };

  protected spriteSet: SpriteSetInterface;

  /**
   * @param spriteSet
   * @param options
   */
  public constructor(spriteSet: SpriteSetInterface) {
    this.spriteSet = spriteSet;
  }

  /**
   * Creates an avatar
   *
   * @param seed
   * @param options
   */
  public async create(seed: string | Random) {
    let random = seed instanceof Random ? seed : new Random(seed);
    let spriteSet = await this.spriteSet(random);

    let spriteSetKeys = Object.keys(spriteSet);
    let loadAllSprites = spriteSetKeys.map(key => spriteSet[key].load());

    let images = await Promise.all(loadAllSprites);

    let canvas = createCanvas();
    let context = canvas.getContext('2d');

    canvas.width = images[0].height;
    canvas.height = images[0].height;

    let canvasSprites = await Promise.all(spriteSetKeys.map(key => spriteSet[key].create(random)));

    canvasSprites.forEach(canvasSprite => {
      context.drawImage(canvasSprite, 0, 0, canvas.width, canvas.height);
    });

    return new Avatar(canvas);
  }
}
