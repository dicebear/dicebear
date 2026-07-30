import type { Style } from '@dicebear/core';
import yargs from 'yargs';
import chalk from 'chalk';

import { getStyleCommandOptions } from './getStyleCommandOptions.js';
import { handleStyleCommand } from './handleStyleCommand.js';
import { isOptimizeMode } from './optimizeCommandOptions.js';

/**
 * Registers a `<name> [outputPath]` subcommand on the given yargs instance,
 * wired up to render avatars for the given style.
 */
export function addStyleCommand(
  cli: yargs.Argv<Record<string, unknown>>,
  name: string,
  style: Style,
) {
  const options = getStyleCommandOptions(style);

  return cli.command({
    command: `${name} [outputPath]`,
    describe: `Generate "${name}" avatar(s)`,
    builder: (yargs) => {
      return yargs.default('outputPath', '.').options(options);
    },
    handler: async (argv) => {
      try {
        // yargs does not run in strict mode, so an --optimize here would
        // otherwise be dropped and the CLI would quietly render avatars.
        // Built-in styles ship inside @dicebear/styles, with no file to
        // rewrite.
        if (isOptimizeMode(argv)) {
          throw new Error(
            `The built-in style "${name}" has no definition file to ` +
              'optimize. Point the CLI at a definition file instead, for ' +
              'example `dicebear ./my-style.json --optimize`.',
          );
        }

        await handleStyleCommand(argv, name, style);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        console.error(chalk.red(`\nError: ${message}`));
        process.exit(1);
      }
    },
  });
}
