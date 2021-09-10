import * as avatars from '@dicebear/core';
import { StyleOptions } from '@dicebear/core';
import * as style from '../dist';
import * as fs from 'fs';
import * as path from 'path';

const seed = 'test';
const data: Array<StyleOptions<style.Options>> = [
  { seed },
  { seed, backgroundColor: '#FF0000' },
  { seed, baseColor: ['sky'] },
  { seed, baseColor: ['sky'], hairColor: ['lavender'] },
  {
    seed,
    backgroundColor: 'topaz',
    baseColor: ['topaz'],
    hairColor: ['topaz'],
    hairProbability: 100,
    earringColor: ['topaz'],
    earringsProbability: 100,
    eyebrowColor: ['topaz'],
    facialHairColor: ['topaz'],
    facialHairProbability: 100,
    glassesColor: ['topaz'],
    glassesProbability: 100,
    shirtColor: ['topaz'],
  },
  {
    seed,
    hair: ['dougFunny'],
    hairColor: ['lavender'],
  },
  {
    seed,
    eyes: ['eyesShadow'],
    eyeColor: ['mellow'],
  },
  {
    seed,
    eyes: ['eyesShadow'],
    eyeShadowColor: ['mellow'],
  },
  {
    seed,
    hair: ['mrT'],
    facialHair: ['beard'],
    facialHairColor: ['black'],
    facialHairProbability: 100,
  },
];

data.forEach((options, key) => {
  test(`Create avatar #${key}`, async () => {
    const svgComponent = path.resolve(__dirname, 'svg', `${key}.svg`);

    if (false === fs.existsSync(svgComponent)) {
      if (false === fs.existsSync(path.dirname(svgComponent))) {
        fs.mkdirSync(path.dirname(svgComponent));
      }

      fs.writeFileSync(svgComponent, avatars.createAvatar(style, options), { encoding: 'utf-8' });
    }

    const svg = fs.readFileSync(svgComponent, { encoding: 'utf-8' });

    expect(avatars.createAvatar(style, options)).toEqual(svg);
    expect(new avatars.default(style.default, options).create(options.seed)).toEqual(svg);
  });
});
