import Color from '@dicebear/avatars/lib/color';
import Random from '@dicebear/avatars/lib/random';
import { ColorCollection, Color as ColorType } from '@dicebear/avatars/lib/types';
import { Options } from './options';

import eyesCollection from './eyes';
import faceCollection from './face';
import mouthCollection from './mouth';
import sidesCollection from './sides';
import textureCollection from './texture';
import topCollection from './top';

const group = (random: Random, content: string, chance: number, x: number, y: number) => {
  if (random.bool(chance)) {
    return `<g transform="translate(${x}, ${y})">${content}</g>`;
  }

  return '';
};

export function create(random: Random, options: Options = {}) {
  options = {
    primaryColorLevel: 600,
    secondaryColorLevel: 400,
    mouthChance: 100,
    sidesChance: 100,
    textureChance: 50,
    topChance: 100,
    ...options,
  };

  let colorsCollection: Array<ColorType> = [];

  Object.keys(Color.collection).forEach((color: keyof ColorCollection) => {
    if (options.colors === undefined || options.colors.length === 0 || options.colors.indexOf(color) !== -1) {
      colorsCollection.push(Color.collection[color]);
    }
  });

  let primaryColorCollection = random.pickone(colorsCollection);
  let secondaryColorCollection = random.pickone(colorsCollection);

  let primaryColor = new Color(primaryColorCollection[options.primaryColorLevel]);
  let secondaryColor = new Color(primaryColorCollection[options.secondaryColorLevel]);

  if (options.colorful) {
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
    '<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" fill="none">',
    group(random, sides(secondaryColor), options.sidesChance, 0, 66),
    group(random, top(secondaryColor), options.topChance, 41, 0),
    group(random, face(primaryColor, random.bool(options.textureChance) ? texture() : undefined), 100, 25, 44),
    group(random, mouth(), options.mouthChance, 52, 124),
    group(random, eyes(), 100, 38, 76),
    '</svg>'
  ].join('');
}

export default create;
