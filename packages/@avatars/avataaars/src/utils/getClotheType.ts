import type { utils } from '@avatars/core';
import Options from '../options';
import getOption from './getOption';

export default function (options: Options, prng: utils.prng.IPrng) {
  let clotheType = [];

  if (getOption('clothes', 'blazer', options)) {
    clotheType.push('BlazerShirt', 'BlazerSweater');
  }

  if (getOption('clothes', 'sweater', options)) {
    clotheType.push('CollarSweater');
  }

  if (getOption('clothes', 'shirt', options)) {
    clotheType.push('GraphicShirt', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck');
  }

  if (getOption('clothes', 'hoodie', options)) {
    clotheType.push('Hoodie');
  }

  if (getOption('clothes', 'overall', options)) {
    clotheType.push('Overall');
  }

  return prng.pick(clotheType);
}
