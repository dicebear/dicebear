import Random from '@dicebear/avatars/lib/random';
import Options from '../options';
import getOption from './getOption';

export default function(options: Options, random: Random) {
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

  return random.pickone(clotheType);
}
