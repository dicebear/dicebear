import { create as createMale } from '@dicebear/avatars-male-sprites';
import { create as createFemale } from '@dicebear/avatars-female-sprites';
import { Style, StyleSchema } from '@dicebear/avatars';
import { Options } from './options';
import schema from './schema.json';

export const style: Style<Options> = {
  meta: {
    title: 'Human / 8biticon',
    creator: 'Plastic Jam',
    contributor: 'Florian Körner',
    source: 'https://github.com/dicebear/dicebear',
    license: 'https://opensource.org/licenses/MIT',
  },
  schema: schema as StyleSchema,
  create: ({ prng, options }) => {
    if (prng.bool(50)) {
      return createMale({ prng, options });
    } else {
      return createFemale({ prng, options });
    }
  },
};
