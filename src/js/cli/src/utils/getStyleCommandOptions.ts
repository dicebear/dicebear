import { Style, OptionsDescriptor } from '@dicebear/core';
import type { Options } from 'yargs';

/**
 * Builds the yargs options map for a single style command. Combines the
 * shared CLI flags (`count`, `format`, `exif`, `json`) with one entry per
 * field returned by the style's {@link OptionsDescriptor}.
 */
export function getStyleCommandOptions(style: Style): Record<string, Options> {
  const descriptor = new OptionsDescriptor(style).toJSON();
  const result: Record<string, Options> = {
    count: {
      description: 'Defines how many avatars to create.',
      type: 'number',
      default: 1,
    },
    format: {
      type: 'string',
      choices: ['svg', 'png', 'jpg', 'jpeg', 'webp', 'avif', 'json'],
      default: 'svg',
    },
    exif: {
      description: 'Include Exif Metadata',
      type: 'boolean',
      default: false,
    },
    json: {
      description: 'Save JSON file in addition to image file',
      type: 'boolean',
      default: false,
    },
  };

  for (const [key, field] of Object.entries(descriptor)) {
    const option: Options = {};

    switch (field.type) {
      case 'string':
        option.type = 'string';
        if (field.list) {
          option.array = true;
        }
        break;
      case 'number':
        option.type = 'number';
        if (field.list) {
          option.array = true;
        }
        break;
      case 'range':
        option.type = 'string';
        break;
      case 'boolean':
        option.type = 'boolean';
        break;
      case 'enum':
        option.type = 'string';
        if (field.list) {
          option.array = true;
        }
        if (!field.weighted && !field.open) {
          option.choices = field.values as string[];
        }

        break;
      case 'color':
        option.type = 'string';
        if (field.list) {
          option.array = true;
        }
        break;
    }

    result[key] = option;
  }

  return result;
}
