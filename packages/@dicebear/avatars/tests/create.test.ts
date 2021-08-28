import * as avatars from '../dist';
import { StyleOptions, Style } from '@dicebear/avatars';
import * as fs from 'fs';
import * as path from 'path';

const seed = 'test';
const data: Array<StyleOptions<{}>> = [
  { seed, backgroundColor: '#FF0000' },
  { seed, backgroundColor: '#FF0000', margin: 10 },
  { seed, backgroundColor: '#FF0000', margin: 10, radius: 25 },
  { seed, backgroundColor: '#FF0000', width: 100 },
  { seed, backgroundColor: '#FF0000', height: 100 },
  { seed, backgroundColor: '#FF0000', width: 100, height: 100 },
  { seed, backgroundColor: '#FF0000', rotate: 90 },
  { seed, backgroundColor: '#FF0000', scale: 50 },
  { seed, backgroundColor: '#FF0000', flip: true },
  { seed, backgroundColor: '#FF0000', size: 100 },
  { seed, backgroundColor: '#FF0000', x: -50 },
  { seed, backgroundColor: '#FF0000', y: 50 },
  { seed, backgroundColor: '#FF0000', size: 100, rotate: 120, scale: 50, flip: true, radius: 25, x: -50, y: 50 },
];

const style: Style<{}> = {
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

const legacyStyle = avatars.utils.style.createLegacyWrapper(style);

data.forEach((options, key) => {
  test(`Create avatar #${key}`, async () => {
    const svgPath = path.resolve(__dirname, 'svg', `${key}.svg`);

    if (false === fs.existsSync(svgPath)) {
      if (false === fs.existsSync(path.dirname(svgPath))) {
        fs.mkdirSync(path.dirname(svgPath));
      }

      fs.writeFileSync(svgPath, avatars.createAvatar(style, options), { encoding: 'utf-8' });
    }

    const svg = fs.readFileSync(svgPath, { encoding: 'utf-8' });

    expect(avatars.createAvatar(style, options)).toEqual(svg);
    expect(new avatars.default(legacyStyle, options).create(seed)).toEqual(svg);
  });
});
