import type { Style } from '@dicebear/avatars';
import { utils } from '@dicebear/avatars';
import type { Options } from './options';
import * as paths from './paths';
import * as colors from './colors';
import { schema } from './schema';

export const style: Style<Options> = {
  meta: {
    title: 'Avatar Illustration System',
    creator: 'Micah Lanier',
    contributor: 'Florian Körner',
    source: 'https://www.figma.com/community/file/829741575478342595',
    license: {
      name: 'CC BY 4.0',
      url: 'https://creativecommons.org/licenses/by/4.0/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    const pickColor = (values: string[], filter: string[] = []): string => {
      let result: string[] = values
        .map((val) => colors[val as keyof typeof colors] || val)
        .filter((val) => false === filter.includes(val));

      if (result.length === 0) {
        result.push('transparent');
      }

      return prng.pick(result);
    };

    const pickPath = <T>(paths: Record<string, T>, values: string[] = []): T | undefined => {
      let result: Array<T | undefined> = values.map((val) => paths[val]);

      if (result.length === 0) {
        result.push(undefined);
      }

      return prng.pick(result);
    };

    const baseColor = pickColor(options.baseColor ?? []);
    const hairColor = pickColor(options.hairColor ?? [], [baseColor]);
    const shirtColor = pickColor(options.shirtColor ?? [], [baseColor]);
    const earringColor = pickColor(options.earringColor ?? [], [baseColor, hairColor]);
    const glassesColor = pickColor(options.glassesColor ?? [], [baseColor, hairColor]);
    const eyeColor = pickColor(options.eyeColor ?? [], [baseColor, glassesColor]);
    const eyebrowColor = pickColor(options.eyebrowColor ?? [], [baseColor, glassesColor, eyeColor]);
    const facialHairColor = pickColor(options.facialHairColor ?? [], [baseColor]);

    const earringsPath = pickPath(paths.earrings, options.earrings);
    const glassesPath = pickPath(paths.glasses, options.glasses);
    const hairPath = pickPath(paths.hair, options.hair);
    const facialHairPath = pickPath(paths.facialHair, options.facialHair);

    const shirt = pickPath(paths.shirt, options.shirt);
    const earrings = prng.bool(options.earringsProbability) && earringsPath;
    const ears = pickPath(paths.ears, options.ears);
    const nose = pickPath(paths.nose, options.nose);
    const glasses = prng.bool(options.glassesProbability) && glassesPath;
    const eyes = pickPath(paths.eyes, options.eyes);
    const eyebrows = pickPath(paths.eyebrows, options.eyebrows);
    const mouth = pickPath(paths.mouth, options.mouth);
    const hair = prng.bool(options.hairProbability) && hairPath;
    const facialHair = prng.bool(options.facialHairProbability) && facialHairPath;
    const base = pickPath(paths.base, options.base);

    return {
      attributes: {
        viewBox: '0 0 360 360',
        fill: 'none',
      },
      body: `
        ${base ? utils.svg.createGroup({ children: base(baseColor), x: 90, y: 43 }) : ''}
        ${facialHair ? utils.svg.createGroup({ children: facialHair(facialHairColor), x: 124, y: 145.3 }) : ''}
        ${mouth ? utils.svg.createGroup({ children: mouth('#000'), x: 180, y: 203 }) : ''}
        ${eyebrows ? utils.svg.createGroup({ children: eyebrows(eyebrowColor), x: 120, y: 122 }) : ''}
        ${hair ? utils.svg.createGroup({ children: hair(hairColor), x: 59, y: 31 }) : ''}
        ${eyes ? utils.svg.createGroup({ children: eyes(eyeColor), x: 152, y: 139 }) : ''}
        ${glasses ? utils.svg.createGroup({ children: glasses(glassesColor), x: 112, y: 131 }) : ''}
        ${nose ? utils.svg.createGroup({ children: nose('#000'), x: 186.37, y: 168.42 }) : ''}
        ${ears ? utils.svg.createGroup({ children: ears(baseColor), x: 94, y: 174 }) : ''}
        ${earrings ? utils.svg.createGroup({ children: earrings(earringColor), x: 97, y: 209 }) : ''}
        ${shirt ? utils.svg.createGroup({ children: shirt(shirtColor), x: 63, y: 292 }) : ''}
      `,
    };
  },
};
