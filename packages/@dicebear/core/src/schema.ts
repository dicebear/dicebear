import { JSONSchema7 } from 'json-schema';

export const schema: JSONSchema7 = {
  type: 'object',
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    seed: {
      type: 'string',
    },
    flip: {
      type: 'boolean',
      default: false,
    },
    rotate: {
      type: 'integer',
      minimum: 0,
      maximum: 360,
      default: 0,
    },
    scale: {
      type: 'integer',
      minimum: 0,
      maximum: 200,
      default: 100,
    },
    radius: {
      type: 'integer',
      minimum: 0,
      maximum: 50,
      default: 0,
    },
    size: {
      type: 'integer',
      minimum: 1,
    },
    backgroundColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^(transparent|[a-fA-F0-9]{6})$',
      },
    },
    backgroundType: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['solid', 'gradientLinear'],
      },
      default: ['solid'],
    },
    backgroundRotation: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: -360,
        maximum: 360,
      },
      default: [
        0, 360,
      ],
    },
    translateX: {
      type: 'integer',
      minimum: -100,
      maximum: 100,
      default: 0,
    },
    translateY: {
      type: 'integer',
      minimum: -100,
      maximum: 100,
      default: 0,
    },
    clip: {
      type: 'boolean',
      default: true,
    },
    randomizeIds: {
      type: 'boolean',
      default: false,
    },
  },
};
