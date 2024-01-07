/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/3Te9c70BX2Aj4IUP35sWhF
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    accessories: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'catEars',
          'glasses',
          'sailormoonCrown',
          'clownNose',
          'sleepMask',
          'sunglasses',
          'faceMask',
          'mustache',
        ],
      },
      default: [
        'catEars',
        'glasses',
        'sailormoonCrown',
        'clownNose',
        'sleepMask',
        'sunglasses',
        'faceMask',
        'mustache',
      ],
    },
    accessoriesProbability: {
      type: 'integer',
      minimum: 0,
      maximum: 100,
      default: 50,
    },
    eyes: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'cheery',
          'normal',
          'confused',
          'starstruck',
          'winking',
          'sleepy',
          'sad',
          'angry',
        ],
      },
      default: [
        'cheery',
        'normal',
        'confused',
        'starstruck',
        'winking',
        'sleepy',
        'sad',
        'angry',
      ],
    },
    face: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['base'],
      },
      default: ['base'],
    },
    hair: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'shortHair',
          'mohawk',
          'wavyBob',
          'bowlCutHair',
          'curlyBob',
          'straightHair',
          'braids',
          'shavedHead',
          'bunHair',
          'froBun',
          'bangs',
          'halfShavedHead',
          'curlyShortHair',
        ],
      },
      default: [
        'shortHair',
        'mohawk',
        'wavyBob',
        'bowlCutHair',
        'curlyBob',
        'straightHair',
        'braids',
        'shavedHead',
        'bunHair',
        'froBun',
        'bangs',
        'halfShavedHead',
        'curlyShortHair',
      ],
    },
    hairColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: [
        '220f00',
        '3a1a00',
        '71472d',
        'e2ba87',
        '605de4',
        '238d80',
        'd56c0c',
        'e9b729',
      ],
    },
    mouth: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'openedSmile',
          'unimpressed',
          'gapSmile',
          'openSad',
          'teethSmile',
          'awkwardSmile',
          'braces',
          'kawaii',
        ],
      },
      default: [
        'openedSmile',
        'unimpressed',
        'gapSmile',
        'openSad',
        'teethSmile',
        'awkwardSmile',
        'braces',
        'kawaii',
      ],
    },
    skinColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: [
        'ffe4c0',
        'f5d7b1',
        'efcc9f',
        'e2ba87',
        'c99c62',
        'a47539',
        '8c5a2b',
        '643d19',
      ],
    },
  },
};
