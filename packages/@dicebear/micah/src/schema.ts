/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/YHb4ShTgmO8Lqhkz1plLfL
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    base: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['standard'],
      },
      default: ['standard'],
    },
    baseColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['f9c9b6', 'ac6651', '77311d'],
    },
    earringColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: [
        'f9c9b6',
        'd2eff3',
        '000000',
        'e0ddff',
        'f4d150',
        'ac6651',
        '9287ff',
        'ffeba4',
        'fc909f',
        'ffedef',
        '6bd9e9',
        '77311d',
        'ffffff',
      ],
    },
    earrings: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['hoop', 'stud'],
      },
      default: ['hoop', 'stud'],
    },
    earringsProbability: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      default: 30,
    },
    ears: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['attached', 'detached'],
      },
      default: ['attached', 'detached'],
    },
    eyeShadowColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['d2eff3', 'e0ddff', 'ffeba4', 'ffedef', 'ffffff'],
    },
    eyebrows: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['up', 'down', 'eyelashesUp', 'eyelashesDown'],
      },
      default: ['up', 'down', 'eyelashesUp', 'eyelashesDown'],
    },
    eyebrowsColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['000000'],
    },
    eyes: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['eyes', 'round', 'eyesShadow', 'smiling', 'smilingShadow'],
      },
      default: ['eyes', 'round', 'eyesShadow', 'smiling', 'smilingShadow'],
    },
    eyesColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['000000'],
    },
    facialHair: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['beard', 'scruff'],
      },
      default: ['beard', 'scruff'],
    },
    facialHairColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['000000'],
    },
    facialHairProbability: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      default: 10,
    },
    glasses: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['round', 'square'],
      },
      default: ['round', 'square'],
    },
    glassesColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: [
        'f9c9b6',
        'd2eff3',
        '000000',
        'e0ddff',
        'f4d150',
        'ac6651',
        '9287ff',
        'ffeba4',
        'fc909f',
        'ffedef',
        '6bd9e9',
        '77311d',
        'ffffff',
      ],
    },
    glassesProbability: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      default: 30,
    },
    hair: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'fonze',
          'mrT',
          'dougFunny',
          'mrClean',
          'dannyPhantom',
          'full',
          'turban',
          'pixie',
        ],
      },
      default: [
        'fonze',
        'mrT',
        'dougFunny',
        'mrClean',
        'dannyPhantom',
        'full',
        'turban',
        'pixie',
      ],
    },
    hairColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: [
        'f9c9b6',
        'd2eff3',
        '000000',
        'e0ddff',
        'f4d150',
        'ac6651',
        '9287ff',
        'ffeba4',
        'fc909f',
        'ffedef',
        '6bd9e9',
        '77311d',
        'ffffff',
      ],
    },
    hairProbability: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      default: 100,
    },
    mouth: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'surprised',
          'laughing',
          'nervous',
          'smile',
          'sad',
          'pucker',
          'frown',
          'smirk',
        ],
      },
      default: [
        'surprised',
        'laughing',
        'nervous',
        'smile',
        'sad',
        'pucker',
        'frown',
        'smirk',
      ],
    },
    mouthColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['000000'],
    },
    nose: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['curve', 'pointed', 'tound'],
      },
      default: ['curve', 'pointed', 'tound'],
    },
    shirt: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['open', 'crew', 'collared'],
      },
      default: ['open', 'crew', 'collared'],
    },
    shirtColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: [
        'f9c9b6',
        'd2eff3',
        '000000',
        'e0ddff',
        'f4d150',
        'ac6651',
        '9287ff',
        'ffeba4',
        'fc909f',
        'ffedef',
        '6bd9e9',
        '77311d',
        'ffffff',
      ],
    },
  },
};
