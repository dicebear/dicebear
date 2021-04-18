import { create as createMale } from '@dicebear/avatars-male-sprites';
import { create as createFemale } from '@dicebear/avatars-female-sprites';
import { Style, StyleSchema } from '@dicebear/avatars';
import { Options } from './options';
import { schema } from './schema';

export const style: Style<Options> = {
  meta: {
    title: 'Human / 8biticon',
    creator: 'Plastic Jam',
    contributor: 'Florian Körner',
    source: 'https://github.com/dicebear/dicebear',
    license: {
      name: 'MIT',
      url: 'https://github.com/dicebear/dicebear/blob/v4/packages/avatars-human-sprites/LICENSE',
    },
  },
  schema,
  create: ({ prng, options }) => {
    if (prng.bool(50)) {
      return createMale({ prng, options });
    } else {
      return createFemale({ prng, options });
    }
  },
};
