/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/
 */

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
    const svgPath = path.resolve(__dirname, 'svg/create', `${key}.svg`);

    if (false === fs.existsSync(svgPath)) {
      if (false === fs.existsSync(path.dirname(svgPath))) {
        fs.mkdirSync(path.dirname(svgPath), { recursive: true });
      }

      await createAvatar(...params).toFile(svgPath);
    }

    const svg = fs.readFileSync(svgPath, { encoding: 'utf-8' });

    equal(createAvatar(...params).toString(), svg);
  });
});

test.run();
