import { hideBin } from 'yargs/helpers';

/**
 * A value that starts with a minus sign and a digit, such as `-10`, `-10,10`
 * or `-0.5,-0.25`.
 */
const negativeValue = /^-\.?\d[\d.,\s-]*$/;

/**
 * Joins a long flag and a negative value that follows it into one argument,
 * so `--rotate -10,10` reaches the parser as `--rotate=-10,10`.
 *
 * The parser reads `-10,10` as a group of short flags (`-1`, `-0`, …) because
 * only a plain number such as `-10` counts as a negative value. Ranges and
 * lists with a negative first entry would otherwise fail with "Unknown
 * arguments". No option of this CLI takes a value that starts with a digit
 * after a single dash as a flag, so the join cannot swallow a real flag.
 */
export function joinNegativeValues(args: readonly string[]): string[] {
  const result: string[] = [];

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    if (
      arg.startsWith('--') &&
      arg.length > 2 &&
      !arg.includes('=') &&
      next !== undefined &&
      negativeValue.test(next)
    ) {
      result.push(`${arg}=${next}`);
      i++;

      continue;
    }

    result.push(arg);
  }

  return result;
}

/** The arguments of this process, without node and the script path. */
export function cliArguments(): string[] {
  return joinNegativeValues(hideBin(process.argv));
}
