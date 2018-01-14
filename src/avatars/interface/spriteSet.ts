import Random from './helper/random';
import Sprite from './model/sprite';

export interface SpriteSet {
  (random: Random): Promise<{ [key: string]: Sprite }>;
}
