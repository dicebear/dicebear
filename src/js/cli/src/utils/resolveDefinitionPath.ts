import { Parser } from 'yargs/helpers';

import { optimizeModeFlags } from './optimizeCommandOptions.js';

/**
 * Extracts the definition file path (the first positional argument) from the
 * raw CLI arguments.
 *
 * Flags and the values they consume are ignored, so invocations like
 * `--count 2 my-style.json`, `my-style.json --count 2`, or `--version`
 * resolve correctly instead of mistaking a flag (or a flag's value) for the
 * definition path. Pass the result of `hideBin(process.argv)`.
 */
export function resolveDefinitionPath(args: string[]): string | undefined {
  // yargs' built-in `--help`/`--version`, the CLI's generic `--exif`/`--json`
  // and the optimize-mode flags are boolean. Declaring them keeps the parser
  // from greedily consuming the following definition path as their value
  // (e.g. `--json my-style.json`).
  const positional = Parser(args, {
    boolean: ['help', 'version', 'exif', 'json', ...optimizeModeFlags],
  })._[0];

  return positional === undefined ? undefined : String(positional);
}
