import type { Style } from '@dicebear/core';
import type { Options } from './types.js';
import { schema } from './schema.js';
import initials from 'initials';

const colors: Record<string, string> = {
  amber: 'rgba(255, 179, 0, 1)',
  blue: 'rgba(30, 136, 229, 1)',
  blueGrey: 'rgba(84, 110, 122, 1)',
  brown: 'rgba(109, 76, 65, 1)',
  cyan: 'rgba(0, 172, 193, 1)',
  deepOrange: 'rgba(244, 81, 30, 1)',
  deepPurple: 'rgba(94, 53, 177, 1)',
  green: 'rgba(67, 160, 71, 1)',
  grey: 'rgba(117, 117, 117, 1)',
  indigo: 'rgba(57, 73, 171, 1)',
  lightBlue: 'rgba(3, 155, 229, 1)',
  lightGreen: 'rgba(124, 179, 66, 1)',
  lime: 'rgba(192, 202, 51, 1)',
  orange: 'rgba(251, 140, 0, 1)',
  pink: 'rgba(216, 27, 96, 1)',
  purple: 'rgba(142, 36, 170, 1)',
  red: 'rgba(229, 57, 53, 1)',
  teal: 'rgba(0, 137, 123, 1)',
  yellow: 'rgba(253, 216, 53, 1)',
};

export const style: Style<Options> = {
  meta: {
    title: 'Initials',
    creator: 'Florian Körner',
    source: 'https://github.com/dicebear/dicebear',
    license: {
      name: 'CC0 1.0',
      url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
  },
  schema: schema,
  create: ({ prng, options }) => {
    options.backgroundColor = options.backgroundColor?.map(
      (val) => colors[val] ?? val
    );

    let fontFamily = 'Arial,sans-serif';
    let fontSize = (options.fontSize ?? 50) / 100;
    let seedInitials = (initials(prng.seed.trim()) as string)
      .toLocaleUpperCase()
      .slice(0, options.chars ?? 2);

    // prettier-ignore
    let svg = [
      `<text x="50%" y="50%" style="${options.bold ? 'font-weight: bold;' : ''} font-family: ${fontFamily}; font-size: ${fontSize}px" fill="#FFF" text-anchor="middle" dy="${(fontSize * .356).toFixed(3)}">${seedInitials}</text>`,
    ].join('');

    return {
      attributes: {
        viewBox: '0 0 1 1',
      },
      body: svg,
    };
  },
};
