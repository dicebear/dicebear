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
  [style, { seed: 'Felix', fontSize: 90 }],
  [style, { seed: 'Felix', fontSize: 50 }],
  [style, { seed: 'Felix', fontFamily: ['Times New Roman', 'serif'] }],
  [
    style,
    { seed: 'Felix', backgroundColor: ['ffffff'], textColor: ['000000'] },
  ],
];

data.forEach((params, key) => {
  test(`Create avatar #${key}`, async () => {
    const svgPath = path.resolve(__dirname, 'static/create', `${key}.svg`);
    const jsonPath = path.resolve(__dirname, 'static/create', `${key}.json`);

    if (false === fs.existsSync(svgPath)) {
      if (false === fs.existsSync(path.dirname(svgPath))) {
        fs.mkdirSync(path.dirname(svgPath), { recursive: true });
      }

      await createAvatar(...params).toFile(svgPath);
    }

    if (false === fs.existsSync(jsonPath)) {
      if (false === fs.existsSync(path.dirname(jsonPath))) {
        fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
      }

      fs.writeFileSync(
        jsonPath,
        JSON.stringify(createAvatar(...params).toJson(), null, 2)
      );
    }

    const svg = fs.readFileSync(svgPath, { encoding: 'utf-8' });
    const json = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf-8' }));

    equal(createAvatar(...params).toString(), svg);
    equal(createAvatar(...params).toJson(), json);
  });
});

test.run();
