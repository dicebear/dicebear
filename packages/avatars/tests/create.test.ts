import * as avatars from '@dicebear/avatars';
import { StyleOptions, Style } from '@dicebear/avatars';
import * as fs from 'fs';
import * as path from 'path';

const seed = 'test';
const data: Array<StyleOptions<{}>> = [
  { seed },
  { seed, backgroundColor: '#FF0000' },
  { seed, backgroundColor: '#FF0000', margin: 10 },
  { seed, backgroundColor: '#FF0000', margin: 10, radius: 25 },
  { seed, width: 100 },
  { seed, height: 100 },
  { seed, width: 100, height: 100 },
];

const style: Style<{}> = {
  meta: {},
  schema: {},
  create: () => ({
    attributes: {
      viewBox: '0 0 1 1',
      version: '1.1',
    },
    body: `<text x="50%" y="50%" style=" font-family: Arial,sans-serif; font-size: 0.5px" fill="#000" text-anchor="middle" dy="0.178">FK</text>`,
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
