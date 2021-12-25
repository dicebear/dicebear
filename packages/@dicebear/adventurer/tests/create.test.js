import { createAvatar } from '@dicebear/core';
import * as style from '../lib/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

const __dirname = new URL('.', import.meta.url).pathname;

const data = [
  [style, { seed: 'John Doe' }],
  [style, { seed: 'Jane Doe' }],
  [style, { seed: 'Florian' }],
  [style, { seed: 'Aneka' }],
  [style, { seed: 'Felix' }],
];

data.forEach((params, key) => {
  test(`Create avatar #${key}`, async () => {
    const svgComponent = path.resolve(__dirname, 'svg/create', `${key}.svg`);

    if (false === fs.existsSync(svgComponent)) {
      if (false === fs.existsSync(path.dirname(svgComponent))) {
        fs.mkdirSync(path.dirname(svgComponent), { recursive: true });
      }

      fs.writeFileSync(svgComponent, createAvatar(...params), {
        encoding: 'utf-8',
      });
    }

    const svg = fs.readFileSync(svgComponent, { encoding: 'utf-8' });

    equal(createAvatar(...params), svg);
  });
});

test.run();
