/**
 * Do not change this file manually! This file was generated with the "Dicebear Exporter"-Plugin for Figma.
 *
 * Plugin: https://www.figma.com/community/plugin/1005765655729342787
 * File: https://www.figma.com/file/sNI8OuD41VSfu5Gfl3eprv/%40dicebear%2Fthumbs
 */

import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    backgroundColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['0a5b83', '1c799f', '69d2e7', 'f1f4dc', 'f88c49'],
    },
    eyes: {
      type: 'array',
      items: {
        type: 'string',
        enum: [
          'variant1W10',
          'variant1W12',
          'variant1W14',
          'variant1W16',
          'variant2W10',
          'variant2W12',
          'variant2W14',
          'variant2W16',
          'variant3W10',
          'variant3W12',
          'variant3W14',
          'variant3W16',
          'variant4W10',
          'variant4W12',
          'variant4W14',
          'variant4W16',
          'variant5W10',
          'variant5W12',
          'variant5W14',
          'variant5W16',
          'variant6W10',
          'variant6W12',
          'variant6W14',
          'variant6W16',
          'variant7W10',
          'variant7W12',
          'variant7W14',
          'variant7W16',
          'variant8W10',
          'variant8W12',
          'variant8W14',
          'variant8W16',
          'variant9W10',
          'variant9W12',
          'variant9W14',
          'variant9W16',
        ],
      },
      default: [
        'variant1W10',
        'variant1W12',
        'variant1W14',
        'variant1W16',
        'variant2W10',
        'variant2W12',
        'variant2W14',
        'variant2W16',
        'variant3W10',
        'variant3W12',
        'variant3W14',
        'variant3W16',
        'variant4W10',
        'variant4W12',
        'variant4W14',
        'variant4W16',
        'variant5W10',
        'variant5W12',
        'variant5W14',
        'variant5W16',
        'variant6W10',
        'variant6W12',
        'variant6W14',
        'variant6W16',
        'variant7W10',
        'variant7W12',
        'variant7W14',
        'variant7W16',
        'variant8W10',
        'variant8W12',
        'variant8W14',
        'variant8W16',
        'variant9W10',
        'variant9W12',
        'variant9W14',
        'variant9W16',
      ],
    },
    eyesColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['000000', 'ffffff'],
    },
    face: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['variant1', 'variant2', 'variant3', 'variant5', 'variant4'],
      },
      default: ['variant1', 'variant2', 'variant3', 'variant5', 'variant4'],
    },
    faceOffsetX: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: -15,
        maximum: 15,
      },
      maxItems: 2,
      default: [-15, 15],
    },
    faceOffsetY: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: -15,
        maximum: 15,
      },
      maxItems: 2,
      default: [-15, 15],
    },
    faceRotation: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: -20,
        maximum: 20,
      },
      maxItems: 2,
      default: [-20, 20],
    },
    mouth: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['variant2', 'variant1', 'variant3', 'variant4', 'variant5'],
      },
      default: ['variant2', 'variant1', 'variant3', 'variant4', 'variant5'],
    },
    mouthColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['000000', 'ffffff'],
    },
    shape: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['default'],
      },
      default: ['default'],
    },
    shapeColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
      default: ['0a5b83', '1c799f', '69d2e7', 'f1f4dc', 'f88c49'],
    },
    shapeOffsetX: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: -5,
        maximum: 5,
      },
      maxItems: 2,
      default: [-5, 5],
    },
    shapeOffsetY: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: -5,
        maximum: 5,
      },
      maxItems: 2,
      default: [-5, 5],
    },
    shapeRotation: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: -20,
        maximum: 20,
      },
      maxItems: 2,
      default: [-20, 20],
    },
  },
};
