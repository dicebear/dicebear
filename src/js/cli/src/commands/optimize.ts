import type { CommandModule } from 'yargs';

import { reportError } from '../utils/reportError.js';

/**
 * `dicebear optimize <definition...>`: compresses the element trees of
 * definition files with svgo.
 */
export const optimizeCommand: CommandModule = {
  command: 'optimize <definition...>',
  describe: 'Compress definition files with svgo',
  builder: (yargs) =>
    yargs
      .positional('definition', {
        type: 'string',
        array: true,
        describe: 'One or more definition files',
      })
      .options({
        output: {
          alias: 'o',
          type: 'string',
          describe:
            'Write to this file, or into this directory for several ' +
            'definitions. Without it the result goes to stdout.',
        },
        check: {
          type: 'boolean',
          default: false,
          describe:
            'Only report whether the files are optimized, exit non-zero if not',
        },
        precision: {
          type: 'number',
          default: 3,
          describe: 'Float precision for path and transform data',
          coerce: (value: number) => {
            // yargs turns a non-numeric value into NaN instead of erroring,
            // and `toFixed` throws on negative digits, so bad input has to
            // be caught here before it surfaces as an svgo-internal crash.
            if (!Number.isInteger(value) || value < 0 || value > 8) {
              throw new Error(
                'The --precision value must be a whole number between 0 and 8.',
              );
            }

            return value;
          },
        },
      })
      .example('$0 optimize my-style.json > my-style.min.json', '')
      .example('$0 optimize src/*.json -o src', 'Rewrite the files in place')
      .example('$0 optimize src/*.json --check', 'Report stale files, for CI'),
  handler: async (argv) => {
    try {
      // Loaded on demand: the optimizer pulls in svgo's full module graph,
      // which every render and --help run would otherwise pay for.
      const { handleOptimizeCommand } =
        await import('../utils/handleOptimizeCommand.js');

      await handleOptimizeCommand(argv, argv.definition as string[]);
    } catch (error) {
      reportError(error);
    }
  },
};
