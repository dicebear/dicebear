import type { ArgumentsCamelCase } from 'yargs';
import chalk, { chalkStderr } from 'chalk';
import fs from 'fs-extra';
import * as path from 'node:path';

import type { Definition } from './definition.js';
import { loadDefinition } from './loadDefinition.js';
import { optimizeDefinition } from './optimizeDefinition.js';
import { resolveOutputTarget } from './resolveOutputTarget.js';
import { resolveBuiltInPath } from './resolveStyle.js';

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Handles the `optimize` command.
 *
 * Reads every definition, runs its element trees through svgo, and sends the
 * result to stdout, a file, or a directory. Under `--check` nothing is
 * written: the command reports whether each file would change and exits
 * non-zero if any would.
 */
export async function handleOptimizeCommand(
  argv: ArgumentsCamelCase<Record<string, unknown>>,
  files: string[],
): Promise<void> {
  const check = argv.check === true;
  const precision = argv.precision as number;
  const target = check
    ? undefined
    : resolveOutputTarget(argv.output as string | undefined, ['json']);

  if (target && target.kind !== 'dir' && files.length > 1) {
    throw new Error(
      'Optimizing more than one definition needs --output <dir>. Without ' +
        '--output a single optimized definition goes to stdout.',
    );
  }

  // In stdout mode the report must not mix with the JSON.
  const report = (line: string) =>
    target?.kind === 'stdout' ? console.error(line) : console.log(line);

  for (const file of files) {
    if (
      resolveBuiltInPath(file) &&
      !fs.existsSync(path.resolve(process.cwd(), file))
    ) {
      throw new Error(
        `The built-in style "${file}" has no definition file to optimize. ` +
          'Point the CLI at a definition file instead, for example ' +
          '`dicebear optimize ./my-style.json`.',
      );
    }

    // Loading validates the input before anything is rewritten, so a schema
    // error is never mistaken for something the optimizer did.
    const { definitionPath, source } = loadDefinition(file);
    const name = path.basename(definitionPath);
    const definition = JSON.parse(source) as Definition;

    const optimized = await optimizeDefinition(definition, precision);
    const result = `${JSON.stringify(optimized, null, 2)}\n`;
    const unchanged = result === source;

    let line = `  ${name}   already optimized`;

    if (!unchanged) {
      const sourceBytes = Buffer.byteLength(source);
      const resultBytes = Buffer.byteLength(result);
      const saving = 1 - resultBytes / sourceBytes;

      line =
        `  ${name}   ${formatSize(sourceBytes)} -> ${formatSize(resultBytes)} ` +
        `(${saving < 0 ? '+' : '-'}${Math.abs(saving * 100).toFixed(1)}%)`;

      if (check) {
        // A definition can be fully optimized and still differ, for instance
        // when it is missing the trailing newline, so say which of the two
        // it is.
        const reason =
          resultBytes < sourceBytes ? 'not optimized' : 'needs reformatting';

        line = chalk.yellow(`${line}   ${reason}`);
        process.exitCode = 1;
      }
    }

    if (!target) {
      console.log(line);

      continue;
    }

    switch (target.kind) {
      case 'stdout':
        await new Promise<void>((resolve, reject) => {
          process.stdout.write(result, (error) =>
            error ? reject(error) : resolve(),
          );
        });
        break;

      case 'file':
        await fs.ensureDir(path.dirname(target.path));
        await fs.writeFile(target.path, result);
        break;

      case 'dir':
        await fs.ensureDir(target.path);
        await fs.writeFile(path.join(target.path, name), result);
        break;
    }

    report(target.kind === 'stdout' ? chalkStderr.dim(line) : line);
  }
}
