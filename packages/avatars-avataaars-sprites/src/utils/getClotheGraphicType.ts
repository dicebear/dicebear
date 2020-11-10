import type Random from '@dicebear/avatars/lib/random';
import { clothingGraphic } from '../paths';

export default function (random: Random) {
  return random.pickone(Object.values(clothingGraphic));
}
