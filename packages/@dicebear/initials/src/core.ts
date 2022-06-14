import type { Style } from '@dicebear/core';
import type { Options } from './types.js';
import { schema } from './schema.js';
import initials from 'initials';

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
    const fontFamily = options.fontFamily?.join(', ') ?? 'Arial, sans-serif';
    const fontSize = options.fontSize ?? 50;
    const fontWeight = options.fontWeight ?? 400;
    const seedInitials = (initials(prng.seed.trim()) as string)
      .toLocaleUpperCase()
      .slice(0, options.chars ?? 2);

    // prettier-ignore
    const svg = [
      `<text x="50%" y="50%" font-family="${fontFamily}" font-size="${fontSize}" fontWeight="${fontWeight}" fill="#FFF" text-anchor="middle" dy="${(fontSize * .356).toFixed(3)}">${seedInitials}</text>`,
    ].join('');

    return {
      attributes: {
        viewBox: '0 0 100 100',
      },
      body: svg,
    };
  },
};
