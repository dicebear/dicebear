import { Parser } from 'yargs/helpers';

import { isOptimizeMode, optimizeModeFlags } from './optimizeCommandOptions.js';

/**
 * Detects `--optimize` / `--optimize-check` in the raw CLI arguments.
 *
 * The default command builds its options from the definition it is about to
 * render, which means the flags have to be known before that happens. Pass the
 * result of `hideBin(process.argv)`.
 */
export function resolveOptimizeMode(args: string[]): boolean {
  return isOptimizeMode(Parser(args, { boolean: optimizeModeFlags }));
}
