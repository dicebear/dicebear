import type { Style, StyleSchema } from '@dicebear/core';
import { schema as coreSchema } from '@dicebear/core';

export function getStyleCommandSchema(style: Style<any>): StyleSchema {
  return {
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      count: {
        description: 'Defines how many avatars to create.',
        type: 'number',
        default: 1,
      },
      format: {
        type: 'string',
        enum: ['svg', 'png', 'jpg', 'jpeg'],
        default: 'svg',
      },
      exif: {
        description: 'Include Exif Metadata',
        type: 'boolean',
        default: false,
      },
      ...coreSchema.properties,
      ...style.schema.properties,
    },
  };
}
