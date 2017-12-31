import Random from './helper/random';
import Sprite from './model/sprite';

export interface SpriteSetInterface {
  (random: Random): Promise<{ [key: string]: Sprite }>;
}
