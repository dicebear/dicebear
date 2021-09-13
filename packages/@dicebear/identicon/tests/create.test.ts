import { createAvatar, StyleOptions } from '@dicebear/core';
import * as style from '../dist';
import * as fs from 'fs';
import * as path from 'path';

const data: Array<StyleOptions<style.Options>> = [
  { seed: 'John Doe' },
  { seed: 'Jane Doe' },
  { seed: 'Florian' },
  { seed: 'Aneka' },
  { seed: 'Felix' },
];

data.forEach((options, key) => {
  test(`Create avatar #${key}`, async () => {
    const svgComponent = path.resolve(__dirname, 'svg', `${key}.svg`);

    if (false === fs.existsSync(svgComponent)) {
      if (false === fs.existsSync(path.dirname(svgComponent))) {
        fs.mkdirSync(path.dirname(svgComponent));
      }

      fs.writeFileSync(svgComponent, createAvatar(style, options), {
        encoding: 'utf-8',
      });
    }

    const svg = fs.readFileSync(svgComponent, { encoding: 'utf-8' });

    expect(createAvatar(style, options)).toEqual(svg);
  });
});
