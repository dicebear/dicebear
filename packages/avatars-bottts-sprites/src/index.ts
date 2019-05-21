import Color from '@dicebear/avatars/lib/color';
import Random from '@dicebear/avatars/lib/random';
import Options from './options';

import eyesCollection from './eyes';
import faceCollection from './face';
import mouthCollection from './mouth';
import sidesCollection from './sides';
import textureCollection from './texture';
import topCollection from './top';
import colorsCollection from './colors';

export default function(options: Options = {}) {
  options = {
    primaryColorLevel: 900,
    secondaryColorLevel: 800,
    mouthChance: 80,
    sidesChance: 80,
    textureChance: 50,
    topChange: 80
  };

  const group = (random: Random, content: string, chance: number, x: number, y: number) => {
    if (random.bool(chance)) {
      return `<g x="${x}" y="${y}">${content}</g>`;
    }

    return '';
  };

  return function(random: Random) {
    let primaryColorCollection = random.pickone(colorsCollection);
    let secondaryColorCollection = random.pickone(colorsCollection);

    let primaryColor = new Color(primaryColorCollection[options.primaryColorLevel]);
    let secondaryColor = new Color(primaryColorCollection[options.secondaryColorLevel]);

    if (false === options.colorful) {
      secondaryColor = new Color(secondaryColorCollection[options.secondaryColorLevel]);
    }

    let eyes = random.pickone(eyesCollection);
    let face = random.pickone(faceCollection);
    let mouth = random.pickone(mouthCollection);
    let sides = random.pickone(sidesCollection);
    let texture = random.pickone(textureCollection);
    let top = random.pickone(topCollection);

    // prettier-ignore
    return [
      '<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">',
      group(random, sides(secondaryColor), options.sidesChance, 0, 66),
      group(random, top(secondaryColor), options.sidesChance, 41, 0),
      group(random, face(primaryColor, random.bool(options.textureChance) ? texture() : undefined), options.sidesChance, 25, 44),
      group(random, mouth(), options.sidesChance, 52, 124),
      group(random, eyes(), options.sidesChance, 38, 76),
      '</svg>'
    ].join('');
  };
}
