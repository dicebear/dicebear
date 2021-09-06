import { JSONSchema7 } from 'json-schema';

export const schema: JSONSchema7 = {
  type: 'object',
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'Options',
  properties: {
    seed: {
      type: 'string',
      examples: ['Jane Doe', 'John Doe'],
    },
    flip: {
      type: 'boolean',
      default: false,
      examples: [true, false],
    },
    rotate: {
      type: 'integer',
      minimum: 0,
      maximum: 360,
      default: 0,
      examples: [0, 45, 90, 135, 180, 225, 270, 315],
    },
    scale: {
      type: 'integer',
      minimum: 0,
      maximum: 200,
      default: 100,
      examples: [50, 100, 150],
    },
    radius: {
      type: 'integer',
      minimum: 0,
      maximum: 50,
      default: 0,
      examples: [0, 10, 20, 30, 40, 50],
    },
    size: {
      type: 'integer',
      minimum: 1,
      examples: [128, 256, 512, 1024],
    },
    backgroundColor: {
      type: 'array',
      uniqueItems: true,
      items: {
        type: 'string',
        pattern:
          '^([0-9a-zA-Z]+|#[a-fA-F0-9]{3}|#[a-fA-F0-9]{4}|#[a-fA-F0-9]{6}|#[a-fA-F0-9]{8})$',
      },
      examples: ['#FFD5DC', '#FFDFBF', '#C0EADE', '#B6E3F4', '#D1D4F9'],
    },
    translateX: {
      type: 'integer',
      minimum: -100,
      maximum: 100,
      default: 0,
      examples: [-50, -25, 0, 25, 50],
    },
    translateY: {
      type: 'integer',
      minimum: -100,
      maximum: 100,
      default: 0,
      examples: [-50, -25, 0, 25, 50],
    },
    clip: {
      type: 'boolean',
      default: true,
      examples: [true, false],
    },
  },
  additionalProperties: false,
};
