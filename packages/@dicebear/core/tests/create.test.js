import { createAvatar } from '../lib/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

const __dirname = new URL('.', import.meta.url).pathname;

const seed = 'test';
const data = [
  { seed, backgroundColor: ['#FF0000'] },
  { seed, backgroundColor: ['#FF0000'], scale: 20, radius: 25 },
  { seed, backgroundColor: ['#FF0000'], rotate: 90 },
  { seed, backgroundColor: ['#FF0000'], scale: 50 },
  { seed, backgroundColor: ['#FF0000'], flip: true },
  { seed, backgroundColor: ['#FF0000'], size: 100 },
  { seed, backgroundColor: ['#FF0000'], translateX: -50 },
  { seed, backgroundColor: ['#FF0000'], translateY: 50 },
  {
    seed,
    backgroundColor: ['#FF0000'],
    size: 100,
    rotate: 120,
    scale: 50,
    flip: true,
    radius: 25,
    translateX: -50,
    translateY: 50,
  },
];

const style = {
  meta: {},
  schema: {},
  create: () => ({
    attributes: {
      viewBox: '-25 -25 100 100',
      version: '1.1',
    },
    body: `
      <rect width="25" height="25" fill="#00FFFF"/>
      <rect x="25" width="25" height="25" fill="#FFFF00"/>
      <rect y="25" width="25" height="25" fill="#FF00FF"/>
      <rect x="25" y="25" width="25" height="25" fill="black"/>
    `,
  }),
};

data.forEach((options, key) => {
  test(`Create avatar #${key}`, async () => {
    const svgPath = path.resolve(__dirname, 'svg', `${key}.svg`);

    if (false === fs.existsSync(svgPath)) {
      if (false === fs.existsSync(path.dirname(svgPath))) {
        fs.mkdirSync(path.dirname(svgPath));
      }

      await createAvatar(style, options).svg().toFile(svgPath);
    }

    const svg = fs.readFileSync(svgPath, { encoding: 'utf-8' });

    equal(createAvatar(style, options).toString(), svg);
  });
});

test.run();
