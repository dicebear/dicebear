import type { Options } from 'yargs';

/** The output formats `create` can write, also the extensions `--output` understands. */
export const createFormats = [
  'svg',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'avif',
  'json',
] as const;

export type CreateFormat = (typeof createFormats)[number];

/**
 * The flags of the `create` command that do not come from the style. The
 * style's own options are appended by `getStyleCommandOptions`.
 */
export const createCommandOptions: Record<string, Options> = {
  output: {
    alias: 'o',
    type: 'string',
    describe:
      'Write to this file, or into this directory with --count. ' +
      'Without it the avatar goes to stdout.',
  },
  count: {
    type: 'number',
    default: 1,
    describe: 'How many avatars to create. More than one needs --output <dir>.',
    coerce: (value: number) => {
      if (!Number.isInteger(value) || value < 1) {
        throw new Error(
          'The --count value must be a whole number of 1 or more.',
        );
      }

      return value;
    },
  },
  format: {
    type: 'string',
    choices: createFormats,
    describe: 'Output format. Defaults to the --output extension, else svg.',
  },
  exif: {
    type: 'boolean',
    default: false,
    describe: 'Include Exif metadata in raster formats',
  },
  json: {
    type: 'boolean',
    default: false,
    describe: 'Save a JSON file next to each image (needs --output <dir>)',
  },
};
