import * as fs from 'node:fs';
import * as path from 'node:path';

export type OutputTarget =
  | { kind: 'stdout' }
  | { kind: 'file'; path: string; format: string }
  | { kind: 'dir'; path: string };

/**
 * Turns the `--output` value into a target. No value means stdout. A path
 * whose extension names one of the given formats is a single file, unless a
 * directory of that name already exists. Everything else is a directory.
 */
export function resolveOutputTarget(
  output: string | undefined,
  formats: readonly string[],
): OutputTarget {
  if (output === undefined || output === '') {
    return { kind: 'stdout' };
  }

  const resolved = path.resolve(process.cwd(), output);
  const extension = path.extname(resolved).slice(1).toLowerCase();

  if (formats.includes(extension)) {
    const isDirectory =
      fs.existsSync(resolved) && fs.statSync(resolved).isDirectory();

    if (!isDirectory) {
      return { kind: 'file', path: resolved, format: extension };
    }
  }

  return { kind: 'dir', path: resolved };
}
