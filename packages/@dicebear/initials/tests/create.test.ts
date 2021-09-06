import { createAvatar } from '@dicebear/core';
import { StyleOptions } from '@dicebear/core';
import * as style from '../dist';
import * as fs from 'fs';
import * as path from 'path';

const seed = 'test';
const data: Array<StyleOptions<style.Options>> = [{ seed }, { seed, backgroundColor: ['#FF0000'] }];

data.forEach((options, key) => {
  test(`Create avatar #${key}`, async () => {
    const svgPath = path.resolve(__dirname, 'svg', `${key}.svg`);

    if (false === fs.existsSync(svgPath)) {
      if (false === fs.existsSync(path.dirname(svgPath))) {
        fs.mkdirSync(path.dirname(svgPath));
      }

      fs.writeFileSync(svgPath, createAvatar(style, options), {
        encoding: 'utf-8',
      });
    }

    const svg = fs.readFileSync(svgPath, { encoding: 'utf-8' });

    expect(createAvatar(style, options)).toEqual(svg);
  });
});
