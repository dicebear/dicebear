import type { ArgumentsCamelCase } from 'yargs';
import cliProgress from 'cli-progress';
import * as path from 'node:path';

import { loadDefinition } from '../loadDefinition.js';
import { diffDefinition } from './diffDefinition.js';
import { formatReport } from './formatReport.js';
import { pairInputs } from './pairInputs.js';
import { sweep } from './sweep.js';
import { seedCases, sweepVariants } from './sweepCases.js';
import type { CompareOptions, PairReport } from './types.js';

function readOptions(
  argv: ArgumentsCamelCase<Record<string, unknown>>,
): CompareOptions {
  const output = argv.output as string | undefined;

  return {
    seeds: argv.seeds as number,
    tolerance: argv.tolerance as number,
    threshold: argv.threshold as number,
    size: argv.size as number,
    systemFonts: argv.systemFonts === true,
    output: output ? path.resolve(process.cwd(), output) : undefined,
  };
}

async function comparePair(
  name: string,
  beforePath: string,
  afterPath: string,
  options: CompareOptions,
): Promise<PairReport> {
  const before = loadDefinition(beforePath).style;
  const after = loadDefinition(afterPath).style;
  const changes = diffDefinition(before, after);
  const report: PairReport = { name, status: 'identical', changes };

  try {
    report.seeds = await sweep(
      name,
      seedCases(before, after, options.seeds),
      options,
    );
    report.variants = await sweepVariants(name, before, after, options);
  } catch (error) {
    report.note = `pixel comparison skipped: ${
      error instanceof Error ? error.message : String(error)
    }`;
  }

  if (
    changes.length > 0 ||
    report.note ||
    report.seeds?.different.length ||
    report.variants?.different.length
  ) {
    report.status = 'changed';
  }

  return report;
}

/**
 * Handles the `compare` command: pairs the inputs, compares every pair, and
 * prints the report as a table or as JSON. Exits non-zero when anything
 * differs.
 */
export async function handleCompareCommand(
  argv: ArgumentsCamelCase<Record<string, unknown>>,
): Promise<void> {
  const options = readOptions(argv);
  const pairs = pairInputs(argv.before as string, argv.after as string);
  const json = argv.json === true;
  const reports: PairReport[] = [];

  const bar =
    pairs.length > 1
      ? new cliProgress.SingleBar(
          {
            stream: process.stderr,
            format: '{bar} {value}/{total} {style}',
          },
          cliProgress.Presets.shades_classic,
        )
      : undefined;

  bar?.start(pairs.length, 0, { style: '' });

  for (const pair of pairs) {
    bar?.update({ style: pair.name });

    if (!pair.before || !pair.after) {
      reports.push({
        name: pair.name,
        status: pair.before ? 'only-before' : 'only-after',
        changes: [],
      });
    } else {
      try {
        reports.push(
          await comparePair(pair.name, pair.before, pair.after, options),
        );
      } catch (error) {
        reports.push({
          name: pair.name,
          status: 'error',
          changes: [],
          note: error instanceof Error ? error.message : String(error),
        });
      }
    }

    bar?.increment();
  }

  bar?.stop();

  if (json) {
    const { output, ...rest } = options;

    void output;
    console.log(JSON.stringify({ options: rest, styles: reports }, null, 2));
  } else {
    console.log(formatReport(reports));
  }

  if (reports.some((report) => report.status !== 'identical')) {
    process.exitCode = 1;
  }
}
