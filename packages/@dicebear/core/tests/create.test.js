import { createAvatar } from '../lib/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const seed = 'test';
const data = [
  { seed, backgroundColor: ['ff0000'] },
  { seed, backgroundColor: ['ff0000'], scale: 20, radius: 25 },
  { seed, backgroundColor: ['ff0000'], rotate: 90 },
  { seed, backgroundColor: ['ff0000'], scale: 50 },
  { seed, backgroundColor: ['ff0000'], flip: true },
  { seed, backgroundColor: ['ff0000'], size: 100 },
  { seed, backgroundColor: ['ff0000'], translateX: -50 },
  { seed, backgroundColor: ['ff0000'], translateY: 50 },
  {
    seed,
    backgroundColor: ['ff0000'],
    size: 100,
    rotate: 120,
    scale: 50,
    flip: true,
    radius: 25,
    translateX: -50,
    translateY: 50,
  },
  {
    seed,
    backgroundColor: ['ff0000', '00ff00', '0000ff'],
    backgroundType: ['gradientLinear'],
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
    const svgPath = path.resolve(__dirname, 'static/create', `${key}.svg`);
    const jsonPath = path.resolve(__dirname, 'static/create', `${key}.json`);

    if (false === fs.existsSync(svgPath)) {
      if (false === fs.existsSync(path.dirname(svgPath))) {
        fs.mkdirSync(path.dirname(svgPath), { recursive: true });
      }

      fs.writeFileSync(svgPath, createAvatar(style, options).toString());
    }

    if (false === fs.existsSync(jsonPath)) {
      if (false === fs.existsSync(path.dirname(jsonPath))) {
        fs.mkdirSync(path.dirname(jsonPath), { recursive: true });
      }

      fs.writeFileSync(
        jsonPath,
        JSON.stringify(createAvatar(style, options).toJson(), null, 2)
      );
    }

    const svg = fs.readFileSync(svgPath, { encoding: 'utf-8' });
    const json = JSON.parse(fs.readFileSync(jsonPath, { encoding: 'utf-8' }));

    equal(createAvatar(style, options).toString(), svg);
    equal(
      JSON.parse(JSON.stringify(createAvatar(style, options).toJson())),
      json
    );
  });
});

test.run();
