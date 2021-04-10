import { utils, StyleSchema, ColorCollection, Color as ColorType } from '@dicebear/avatars';
import Color from '@dicebear/avatars/lib/color';
import Random from '@dicebear/avatars/lib/random';
import { Options } from './options';
import schema from './schema.json';

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
  let defaults = utils.schema.defaults(schema as StyleSchema);
  let colorsCollection: Array<ColorType> = [];

  Object.keys(Color.collection).forEach((color) => {
    if (options.colors === undefined || options.colors.length === 0 || options.colors.indexOf(color as keyof ColorCollection) !== -1) {
      colorsCollection.push(Color.collection[color as keyof ColorCollection]);
    }
  });

  let primaryColorCollection = random.pickone(colorsCollection);
  let secondaryColorCollection = random.pickone(colorsCollection);

  let primaryColor = new Color(primaryColorCollection[options.primaryColorLevel || defaults.primaryColorLevel as keyof typeof primaryColorCollection]);
  let secondaryColor = new Color(primaryColorCollection[options.secondaryColorLevel || defaults.secondaryColorLevel as keyof typeof primaryColorCollection]);

  if (options.colorful) {
    secondaryColor = new Color(secondaryColorCollection[options.secondaryColorLevel || defaults.secondaryColorLevel as keyof typeof primaryColorCollection]);
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
    group(random, sides(secondaryColor), options.sidesChance || defaults.sidesChance as number, 0, 66),
    group(random, top(secondaryColor), options.topChance || defaults.topChance as number, 41, 0),
    group(random, face(primaryColor, random.bool(options.textureChance) ? texture() : undefined), 100, 25, 44),
    group(random, mouth(), options.mouthChance || defaults.mouthChance as number, 52, 124),
    group(random, eyes(), 100, 38, 76),
    '</svg>'
  ].join('');
}

export default create;
