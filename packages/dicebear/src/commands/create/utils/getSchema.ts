import type { Style } from '@dicebear/core';
import type { JSONSchema7 } from 'json-schema';

import { schema as coreSchema } from '@dicebear/core';
import mergeAllOf from 'json-schema-merge-allof';

export function getSchema(style: Style<any>): JSONSchema7 {
  return mergeAllOf(
    {
      allOf: [
        {
          properties: {
            count: {
              description: 'Defines how many avatars to create.',
              type: 'number',
              default: 1,
            },
            format: {
              type: 'string',
              enum: ['svg', 'png', 'jpg', 'jpeg', 'json'],
              default: 'svg',
            },
            includeExif: {
              description: 'Include Exif Metadata',
              type: 'boolean',
              default: true,
            },
            json: {
              description: 'Save JSON file in addition to image file',
              type: 'boolean',
              default: false,
            },
          },
        },
        coreSchema,
        style.schema ?? {},
      ],
      additionalItems: true,
    },
    { ignoreAdditionalProperties: true }
  );
}
