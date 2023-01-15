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
        enum: ['solid', 'linear'],
      },
      default: ['solid'],
    },
    backgroundRotation: {
      type: 'array',
      items: {
        type: 'integer',
        minimum: 0,
        maximum: 360,
      },
      default: [
        0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140, 150,
        160, 170, 180, 190, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290,
        300, 310, 320, 330, 340, 350,
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
  },
};
