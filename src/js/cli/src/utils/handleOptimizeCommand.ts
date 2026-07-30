import type { ArgumentsCamelCase } from 'yargs';
import chalk from 'chalk';
import * as fs from 'node:fs';
import * as path from 'node:path';

import type { Definition } from './definition.js';
import { loadDefinition } from './loadDefinition.js';
import { optimizeDefinition } from './optimizeDefinition.js';

function formatSize(bytes: number): string {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

/**
 * Handles `--optimize` and `--optimize-check` on the default command.
 *
 * Reads the definition, runs every element tree through svgo, and either
 * rewrites the file in place or, under `--optimize-check`, reports whether it
 * would change and exits non-zero if it would. Optimizing is always in place;
 * the `outputPath` positional is ignored here.
 */
export async function handleOptimizeCommand(
  argv: ArgumentsCamelCase<Record<string, unknown>>,
  filePath: string,
): Promise<void> {
  const check = argv.optimizeCheck === true;
  const precision = argv.optimizePrecision as number;

  // Loading validates the input before anything is rewritten, so a schema
  // error is never mistaken for something the optimizer did.
  const { definitionPath, source } = loadDefinition(filePath);
  const name = path.basename(definitionPath);
  const definition = JSON.parse(source) as Definition;

  const optimized = await optimizeDefinition(definition, precision);
  const result = `${JSON.stringify(optimized, null, 2)}\n`;

  if (result === source) {
    console.log(`  ${name}   already optimized`);

    return;
  }

  const sourceBytes = Buffer.byteLength(source);
  const resultBytes = Buffer.byteLength(result);
  const saving = 1 - resultBytes / sourceBytes;
  const report =
    `  ${name}   ${formatSize(sourceBytes)} -> ${formatSize(resultBytes)} ` +
    `(${saving < 0 ? '+' : '-'}${Math.abs(saving * 100).toFixed(1)}%)`;

  if (check) {
    // A definition can be fully optimized and still differ, for instance when
    // it is missing the trailing newline, so say which of the two it is.
    const reason =
      resultBytes < sourceBytes ? 'not optimized' : 'needs reformatting';

    console.log(chalk.yellow(`${report}   ${reason}`));

    process.exitCode = 1;

    return;
  }

  fs.writeFileSync(definitionPath, result);

  console.log(report);
}
