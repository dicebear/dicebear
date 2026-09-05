import { chalkStderr } from 'chalk';

/**
 * Prints an error the way every command reports one and marks the process
 * as failed. The exit code is set rather than forced: an avatar may still be
 * on its way through a pipe.
 */
export function reportError(error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);

  console.error(chalkStderr.red(`\nError: ${message}`));
  process.exitCode = 1;
}
