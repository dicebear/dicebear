import type { utils, IStyle } from '@avatars/core';
import Options from './options';

import colors from 'material-colors/dist/colors.json';
import eyesCollection from './eyes';
import faceCollection from './face';
import mouthCollection from './mouth';
import sidesCollection from './sides';
import textureCollection from './texture';
import topCollection from './top';

const group = (prng: utils.prng.IPrng, content: string, chance: number, x: number, y: number) => {
  if (prng.bool(chance)) {
    return `<g transform="translate(${x}, ${y})">${content}</g>`;
  }

  return '';
};

const style: IStyle<Options> = function (prng, options = {}) {
  options = {
    primaryColorLevel: 600,
    secondaryColorLevel: 400,
    mouthChance: 100,
    sidesChance: 100,
    textureChance: 50,
    topChance: 100,
    ...options,
  };

  let colorsCollection: Array<Record<string, string>> = Object.keys(colors).map((color) => {
    if (options.colors === undefined || options.colors.length === 0 || options.colors.indexOf(color) !== -1) {
      // @ts-ignore
      return colors[color];
    }
  });

  let primaryColorCollection = prng.pick(colorsCollection);
  let secondaryColorCollection = prng.pick(colorsCollection);

  let primaryColor = primaryColorCollection[options.primaryColorLevel.toString()];
  let secondaryColor = primaryColorCollection[options.secondaryColorLevel.toString()];

  if (options.colorful) {
    secondaryColor = secondaryColorCollection[options.secondaryColorLevel.toString()];
  }

  let eyes = prng.pick(eyesCollection);
  let face = prng.pick(faceCollection);
  let mouth = prng.pick(mouthCollection);
  let sides = prng.pick(sidesCollection);
  let texture = prng.pick(textureCollection);
  let top = prng.pick(topCollection);

  // prettier-ignore
  return [
    '<svg viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg" fill="none">',
    group(prng, sides(secondaryColor), options.sidesChance, 0, 66),
    group(prng, top(secondaryColor), options.topChance, 41, 0),
    group(prng, face(primaryColor, prng.bool(options.textureChance) ? texture() : undefined), 100, 25, 44),
    group(prng, mouth(), options.mouthChance, 52, 124),
    group(prng, eyes(), 100, 38, 76),
    '</svg>'
  ].join('');
};

export default style;
