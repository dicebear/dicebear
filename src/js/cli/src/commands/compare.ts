import type { CommandModule } from 'yargs';

import { reportError } from '../utils/reportError.js';

function wholeNumber(flag: string, min: number) {
  return (value: number) => {
    if (!Number.isInteger(value) || value < min) {
      throw new Error(
        `The ${flag} value must be a whole number of ${min} or more.`,
      );
    }

    return value;
  };
}

/**
 * `dicebear compare <before> <after>`: reports whether two versions of a
 * style, or two directories of styles, still render the same.
 */
export const compareCommand: CommandModule = {
  command: 'compare <before> <after>',
  describe: 'Compare two versions of a style, or two directories of styles',
  builder: (yargs) =>
    yargs
      .positional('before', {
        type: 'string',
        describe: 'Definition file or directory of the earlier version',
      })
      .positional('after', {
        type: 'string',
        describe: 'Definition file or directory of the later version',
      })
      .options({
        seeds: {
          type: 'number',
          default: 20,
          describe: 'How many seeds to render with default options',
          coerce: wholeNumber('--seeds', 0),
        },
        tolerance: {
          type: 'number',
          default: 0,
          describe:
            'Share of differing pixels, in percent, a render may have ' +
            'before it is reported',
        },
        threshold: {
          type: 'number',
          default: 0.1,
          describe: 'Per-pixel color sensitivity, 0 (strict) to 1 (lenient)',
        },
        size: {
          type: 'number',
          default: 128,
          describe: 'Render size in pixels',
          coerce: wholeNumber('--size', 8),
        },
        'system-fonts': {
          type: 'boolean',
          default: false,
          describe:
            'Load the system fonts for text styles. Slower, off by default.',
        },
        json: {
          type: 'boolean',
          default: false,
          describe: 'Print the report as JSON instead of a table',
        },
        output: {
          alias: 'o',
          type: 'string',
          describe:
            'Write before/after/diff PNGs of every reported difference ' +
            'into this directory',
        },
      })
      .example('$0 compare lorelei-10.json lorelei.json', '')
      .example(
        '$0 compare node_modules/@dicebear/styles/dist src --seeds 50',
        'Every style of the package against the source tree',
      ),
  handler: async (argv) => {
    try {
      const { handleCompareCommand } =
        await import('../utils/compare/handleCompareCommand.js');

      await handleCompareCommand(argv);
    } catch (error) {
      reportError(error);
    }
  },
};
