import type { CommandModule } from 'yargs';
import { hideBin } from 'yargs/helpers';

import { createCommandOptions } from '../utils/createCommandOptions.js';
import { getStyleCommandOptions } from '../utils/getStyleCommandOptions.js';
import { handleCreateCommand } from '../utils/handleCreateCommand.js';
import { listBuiltInStyles, resolveStyle } from '../utils/resolveStyle.js';
import { resolveStyleArgument } from '../utils/resolveStyleArgument.js';
import { reportError } from '../utils/reportError.js';

/**
 * `dicebear create <style>`: renders avatars from a built-in style or a
 * definition file. The style's own options are only known once the style
 * is, so the builder looks the argument up in the raw argv before yargs
 * parses it. That is what makes `dicebear create lorelei --help` list the
 * style's flags.
 */
export const createCommand: CommandModule = {
  command: 'create <style>',
  describe: 'Create avatars from a built-in style or a definition file',
  builder: (yargs) => {
    const argument = resolveStyleArgument(hideBin(process.argv));
    const styleOptions = argument
      ? getStyleCommandOptions(resolveStyle(argument).style)
      : {};

    return yargs
      .positional('style', {
        type: 'string',
        describe:
          'A built-in style or the path of a definition file. Built-in: ' +
          listBuiltInStyles().join(', '),
      })
      .options({ ...createCommandOptions, ...styleOptions })
      .example('$0 create lorelei --seed Alice', 'Print one SVG to stdout')
      .example(
        '$0 create lorelei --seed Alice -o alice.png',
        'Write one PNG, format taken from the extension',
      )
      .example(
        '$0 create lorelei -o ./avatars --count 10 --format webp',
        'Write ten WebP files into a directory',
      );
  },
  handler: async (argv) => {
    try {
      const { style, name } = resolveStyle(argv.style as string);

      await handleCreateCommand(argv, name, style);
    } catch (error) {
      reportError(error);
    }
  },
};
