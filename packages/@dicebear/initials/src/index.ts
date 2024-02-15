/*!
 * DiceBear Initials (@dicebear/initials)
 *
 * Code licensed under MIT (https://github.com/dicebear/dicebear/blob/v4/packages/initials/LICENSE)
 * Copyright (c) 2024 Florian Körner
 */

import type { StyleCreate, StyleMeta } from '@dicebear/core';
import type { Options } from './types.js';
import { getInitials } from './utils/initials.js';
import { convertColor } from './utils/convertColor.js';

export const meta: StyleMeta = {
    title: 'Initials',
    creator: 'Florian Körner',
    source: 'https://github.com/dicebear/dicebear',
    license: {
        name: 'CC0 1.0',
        url: 'https://creativecommons.org/publicdomain/zero/1.0/',
    },
};

export const create: StyleCreate<Options> = ({ prng, options }) => {
    const fontFamily = options.fontFamily?.join(', ') ?? 'Arial, sans-serif';
    const fontSize = options.fontSize ?? 50;
    const textColor = convertColor(
        prng.pick(options.textColor ?? []) ?? 'ffffff'
    );
    const initials = (getInitials(prng.seed.trim()) as string).slice(
        0,
        options.chars ?? 2
    );

    // prettier-ignore
    const svg = [
    `<text x="50%" y="50%" font-family="${fontFamily}" font-size="${fontSize}" fill="${textColor}" text-anchor="middle" dy="${(fontSize * .356).toFixed(3)}">${initials}</text>`,
  ].join('');

    return {
        attributes: {
            viewBox: '0 0 100 100',
        },
        body: svg,
        extra: () => ({
            fontFamily,
            fontSize,
            textColor,
            initials,
        }),
    };
};

export { schema } from './schema.js';
export type { Options } from './types.js';
