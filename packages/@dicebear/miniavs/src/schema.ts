/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/Vh7N9shKJTNHNo9prUzkZe
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    blushes: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['default'],
      },
      default: ['default'],
    },
    blushesProbability: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      default: 50,
    },
    body: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['tShirt', 'golf'],
      },
      default: ['tShirt', 'golf'],
    },
    bodyColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['e05a33', '3633e0', 'ff4dd8'],
    },
    eyes: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['normal', 'confident', 'happy'],
      },
      default: ['normal', 'confident', 'happy'],
    },
    glasses: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['normal'],
      },
      default: ['normal'],
    },
    glassesProbability: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      default: 20,
    },
    hair: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'balndess',
          'slaughter',
          'ponyTail',
          'long',
          'curly',
          'stylish',
          'elvis',
          'classic02',
          'classic01',
        ],
      },
      default: [
        'balndess',
        'slaughter',
        'ponyTail',
        'long',
        'curly',
        'stylish',
        'elvis',
        'classic02',
        'classic01',
      ],
    },
    hairColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['47280b', '1b0b47', 'ad3a20'],
    },
    head: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['normal', 'wide', 'thin'],
      },
      default: ['normal', 'wide', 'thin'],
    },
    mouth: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['default', 'missingTooth'],
      },
      default: ['default', 'missingTooth'],
    },
    mustache: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['pencilThinBeard', 'pencilThin', 'horshoe', 'freddy'],
      },
      default: ['pencilThinBeard', 'pencilThin', 'horshoe', 'freddy'],
    },
    mustacheProbability: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      default: 20,
    },
    skinColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['ffcb7e', 'f5d0c5', '836055'],
    },
  },
};
