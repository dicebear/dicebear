import { createPreview } from '@dicebear/core';
import * as style from '../lib/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

const __dirname = new URL('.', import.meta.url).pathname;

const data = [
  [style, { seed: 'test' }, 'hair'],
  [style, { seed: 'test' }, 'hairAccessories'],
  [style, { seed: 'test' }, 'head'],
  [style, { seed: 'test' }, 'eyes'],
  [style, { seed: 'test' }, 'eyebrows'],
  [style, { seed: 'test' }, 'earrings'],
  [style, { seed: 'test' }, 'freckles'],
  [style, { seed: 'test' }, 'nose'],
  [style, { seed: 'test' }, 'beard'],
  [style, { seed: 'test' }, 'mouth'],
  [style, { seed: 'test' }, 'glasses'],
  [style, { seed: 'test' }, 'hairColor'],
  [style, { seed: 'test' }, 'skinColor'],
  [style, { seed: 'test' }, 'earringsColor'],
  [style, { seed: 'test' }, 'eyebrowsColor'],
  [style, { seed: 'test' }, 'eyesColor'],
  [style, { seed: 'test' }, 'frecklesColor'],
  [style, { seed: 'test' }, 'glassesColor'],
  [style, { seed: 'test' }, 'mouthColor'],
  [style, { seed: 'test' }, 'noseColor'],
  [style, { seed: 'test' }, 'hairAccessoriesColor'],
  [style, { seed: 'test', backgroundColor: ['#ff0000'] }, 'backgroundColor'],
];

data.forEach((params, key) => {
  test(`Create avatar #${key}`, async () => {
    const svgComponent = path.resolve(__dirname, 'svg/preview', `${key}.svg`);

    if (false === fs.existsSync(svgComponent)) {
      if (false === fs.existsSync(path.dirname(svgComponent))) {
        fs.mkdirSync(path.dirname(svgComponent), { recursive: true });
      }

      fs.writeFileSync(svgComponent, createPreview(...params), {
        encoding: 'utf-8',
      });
    }

    const svg = fs.readFileSync(svgComponent, { encoding: 'utf-8' });

    equal(createPreview(...params), svg);
  });
});

test.run();
