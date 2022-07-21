import type { StyleSchema } from '@dicebear/core';

export const schema: StyleSchema = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  properties: {
    backgroundColor: {
      type: 'array',
      items: {
        type: 'string',
        pattern: '^[a-fA-F0-9]{6}$',
      },
      default: [
        'e53935',
        'd81b60',
        '8e24aa',
        '5e35b1',
        '3949ab',
        '1e88e5',
        '039be5',
        '00acc1',
        '00897b',
        '43a047',
        '7cb342',
        'c0ca33',
        'fdd835',
        'ffb300',
        'fb8c00',
        'f4511e',
      ],
    },
    fontFamily: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string',
        enum: [
          'Arial',
          'Verdana',
          'Helvetica',
          'Tahoma',
          'Trebuchet MS',
          'Times New Roman',
          'Georgia',
          'Garamond',
          'Courier New',
          'Brush Script MT',
          'sans-serif',
          'serif',
        ],
      },
      default: ['Arial', 'sans-serif'],
    },
    fontSize: {
      type: 'integer',
      minimum: 1,
      maximum: 100,
      default: 50,
    },
    chars: {
      type: 'number',
      minimum: 0,
      maximum: 2,
      default: 2,
    },
    fontWeight: {
      type: 'number',
      default: 400,
      enum: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
};
