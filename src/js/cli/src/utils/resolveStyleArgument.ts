import { Parser } from 'yargs/helpers';

/**
 * Extracts the `<style>` positional of the `create` command from the raw
 * CLI arguments, before yargs knows the style's own options.
 *
 * Flags and the values they consume are ignored, so `--count 2 lorelei`,
 * `lorelei --count 2` and `-o out.svg lorelei` all resolve to `lorelei`.
 * The boolean flags are declared so the parser does not swallow the style as
 * their value (`--json lorelei`). Pass the result of `cliArguments()`.
 */
export function resolveStyleArgument(args: string[]): string | undefined {
  // The per-animation switches (`--blinkAnimation`) are booleans too, but
  // their names depend on the style, which is what this function looks for.
  // Every flag ending in `Animation` is one of them.
  const animationSwitches = args
    .filter((arg) => /^--[A-Za-z0-9]+Animation$/.test(arg))
    .map((arg) => arg.slice(2));

  const parsed = Parser(args, {
    boolean: [
      'help',
      'version',
      'exif',
      'json',
      'idRandomization',
      'animation',
      'animationRespectReducedMotion',
      ...animationSwitches,
    ],
    string: ['output', 'format', 'seed'],
    alias: { output: ['o'] },
  });

  const positionals = parsed._.map(String);

  if (positionals[0] !== 'create') {
    return undefined;
  }

  return positionals[1];
}
