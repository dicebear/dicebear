import updateNotifier from 'update-notifier';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import type { Options } from 'yargs';
import chalk from 'chalk';

import { getPackageJson } from './utils/getPackageJson.js';
import { resolveDefinitionPath } from './utils/resolveDefinitionPath.js';
import { resolveOptimizeMode } from './utils/resolveOptimizeMode.js';
import { addStyleCommand } from './utils/addStyleCommand.js';
import { loadStyles } from './utils/loadStyles.js';
import { loadDefinition } from './utils/loadDefinition.js';
import { handleStyleCommand } from './utils/handleStyleCommand.js';
import { getStyleCommandOptions } from './utils/getStyleCommandOptions.js';
import {
  isOptimizeMode,
  optimizeCommandOptions,
} from './utils/optimizeCommandOptions.js';

(async () => {
  const pkg = await getPackageJson();
  updateNotifier({ pkg }).notify();

  const cli = yargs(hideBin(process.argv));
  const styles = loadStyles();

  for (const [name, style] of styles) {
    addStyleCommand(cli, name, style);
  }

  cli.command({
    command: '* <definition> [outputPath]',
    describe: false,
    builder: (yargs) => {
      // Optimizing rewrites the definition instead of rendering from it, so
      // the style's own options are irrelevant and are left out of the help
      // output.
      const optimizeMode = resolveOptimizeMode(hideBin(process.argv));
      const filePath = optimizeMode
        ? undefined
        : resolveDefinitionPath(hideBin(process.argv));

      // Optimize mode ignores the generic flags, but they stay declared as
      // booleans so yargs does not consume the definition path as their value
      // (e.g. `dicebear --json my-style.json --optimize-check`).
      let styleOptions: Record<string, Options> = optimizeMode
        ? {
            exif: { type: 'boolean', hidden: true },
            json: { type: 'boolean', hidden: true },
          }
        : {};

      if (filePath) {
        try {
          const { style } = loadDefinition(filePath);
          styleOptions = getStyleCommandOptions(style);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);

          console.error(chalk.red(`\nError: ${message}`));
          process.exit(1);
        }
      }

      return yargs
        .default('outputPath', '.')
        .options({ ...optimizeCommandOptions, ...styleOptions });
    },
    handler: async (argv) => {
      try {
        const definition = argv.definition as string;

        if (isOptimizeMode(argv)) {
          // Loaded on demand: the optimize path pulls in svgo's full module
          // graph, which every render / --help run would otherwise pay for.
          const { handleOptimizeCommand } =
            await import('./utils/handleOptimizeCommand.js');

          await handleOptimizeCommand(argv, definition);

          return;
        }

        const { style, name } = loadDefinition(definition);

        await handleStyleCommand(argv, name, style);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        console.error(chalk.red(`\nError: ${message}`));
        process.exit(1);
      }
    },
  });

  cli.demandCommand().help().version(pkg.version).locale('en').parse();
})();
