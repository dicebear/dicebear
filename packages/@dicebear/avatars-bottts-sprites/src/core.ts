import { Style, StyleSchema, utils, Color as ColorType, ColorCollection, Prng } from '@dicebear/avatars';
import Color from '@dicebear/avatars/lib/color';
import { Options } from './options';
import { schema } from './schema';

import eyesCollection from './eyes';
import faceCollection from './face';
import mouthCollection from './mouth';
import sidesCollection from './sides';
import textureCollection from './texture';
import topCollection from './top';

const group = (prng: Prng, content: string, chance: number, x: number, y: number) => {
  if (prng.bool(chance)) {
    return `<g transform="translate(${x}, ${y})">${content}</g>`;
  }

  return '';
};

export const style: Style<Options> = {
  meta: {
    title: 'Bottts',
    creator: 'Pablo Stanley',
    contributor: 'Florian Körner',
    source: 'https://bottts.com/',
    license: {
      name: 'Other - Free for personal and commercial use',
      url: 'https://bottts.com/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    let defaults = utils.schema.defaults(schema as StyleSchema);
    let colorsCollection: Array<ColorType> = [];

    Object.keys(Color.collection).forEach((color) => {
      if (
        options.colors === undefined ||
        options.colors.length === 0 ||
        options.colors.indexOf(color as keyof ColorCollection) !== -1
      ) {
        colorsCollection.push(Color.collection[color as keyof ColorCollection]);
      }
    });

    let primaryColorCollection = prng.pick(colorsCollection);
    let secondaryColorCollection = prng.pick(colorsCollection);

    let primaryColor = new Color(
      primaryColorCollection[
        options.primaryColorLevel || (defaults.primaryColorLevel as keyof typeof primaryColorCollection)
      ]
    );

    let secondaryColor = new Color(
      primaryColorCollection[
        options.secondaryColorLevel || (defaults.secondaryColorLevel as keyof typeof primaryColorCollection)
      ]
    );

    if (options.colorful) {
      secondaryColor = new Color(
        secondaryColorCollection[
          options.secondaryColorLevel || (defaults.secondaryColorLevel as keyof typeof primaryColorCollection)
        ]
      );
    }

    let eyes = prng.pick(eyesCollection);
    let face = prng.pick(faceCollection);
    let mouth = prng.pick(mouthCollection);
    let sides = prng.pick(sidesCollection);
    let texture = prng.pick(textureCollection);
    let top = prng.pick(topCollection);

    // prettier-ignore
    let body = [
      group(prng, sides(secondaryColor), options.sidesChance || defaults.sidesChance as number, 0, 66),
      group(prng, top(secondaryColor), options.topChance || defaults.topChance as number, 41, 0),
      group(prng, face(primaryColor, prng.bool(options.textureChance) ? texture() : undefined), 100, 25, 44),
      group(prng, mouth(), options.mouthChance || defaults.mouthChance as number, 52, 124),
      group(prng, eyes(), 100, 38, 76),
    ].join('');

    return {
      attributes: {
        viewBox: '0 0 180 180',
      },
      body,
    };
  },
};
