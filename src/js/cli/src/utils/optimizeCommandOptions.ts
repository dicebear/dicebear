import type { Options } from 'yargs';

/**
 * The flags that switch the default command from rendering into optimize mode.
 * Both the raw-argv pre-scans and {@link isOptimizeMode} read this one list, so
 * the two sides of the mode switch cannot disagree.
 */
export const optimizeModeFlags = ['optimize', 'optimize-check'];

/**
 * The yargs options for the optimize mode of the default command.
 *
 * Every name carries the `--optimize` prefix so the group reads as one feature
 * and cannot be confused with an option derived from the style itself.
 */
export const optimizeCommandOptions: Record<string, Options> = {
  optimize: {
    type: 'boolean',
    describe: 'Compress the definition file with svgo and rewrite it in place',
    conflicts: 'optimize-check',
  },
  'optimize-check': {
    type: 'boolean',
    describe:
      'Report whether the definition file is optimized, without writing it',
    conflicts: 'optimize',
  },
  'optimize-precision': {
    type: 'number',
    describe: 'Float precision for path and transform data',
    default: 3,
    coerce: (value: number) => {
      // yargs turns a non-numeric value into NaN instead of erroring, and
      // `toFixed` throws on negative digits, so bad input has to be caught
      // here before it surfaces as an svgo-internal crash.
      if (!Number.isInteger(value) || value < 0 || value > 8) {
        throw new Error(
          'The --optimize-precision value must be a whole number between 0 and 8.',
        );
      }

      return value;
    },
  },
};

/**
 * Whether a parsed argv asks for the optimize mode instead of rendering.
 *
 * Works on both a full yargs argv and a raw `yargs-parser` result: each keeps
 * the kebab-case key alongside the camelCase one, so checking the declared
 * name covers both.
 */
export function isOptimizeMode(argv: Record<string, unknown>): boolean {
  return optimizeModeFlags.some((flag) => argv[flag] === true);
}
