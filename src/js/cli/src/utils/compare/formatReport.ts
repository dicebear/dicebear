import chalk from 'chalk';

import type { DefinitionChange, PairReport } from './types.js';

/** `+1 -0 ~2` for the changes of one scope, or `-` when there are none. */
function countCell(changes: DefinitionChange[], scopes: string[]): string {
  const own = changes.filter((change) => scopes.includes(change.scope));

  if (own.length === 0) {
    return '-';
  }

  const added = own.filter((change) => change.kind === 'added').length;
  const removed = own.filter((change) => change.kind === 'removed').length;
  const changed = new Set(
    own.filter((change) => change.kind === 'changed').map((c) => c.name),
  ).size;

  return `+${added} -${removed} ~${changed}`;
}

function sweepCell(report: PairReport, key: 'seeds' | 'variants'): string {
  const sweep = report[key];

  return sweep ? `${sweep.different.length}/${sweep.total}` : '-';
}

function resultCell(report: PairReport): string {
  switch (report.status) {
    case 'identical':
      return chalk.green('identical');
    case 'changed':
      return chalk.yellow('changed');
    case 'only-before':
      return chalk.red('only in before');
    case 'only-after':
      return chalk.red('only in after');
    case 'error':
      return chalk.red('error');
  }
}

function stripAnsi(value: string): string {
  // eslint-disable-next-line no-control-regex
  return value.replace(/\u001b\[[0-9;]*m/g, '');
}

/** Pads the cells to column width. The last column is left as it is. */
function renderTable(rows: string[][]): string {
  const widths = rows[0].map((_, column) =>
    Math.max(...rows.map((row) => stripAnsi(row[column]).length)),
  );

  return rows
    .map((row) =>
      row
        .map((cell, column) => {
          const padding = widths[column] - stripAnsi(cell).length;

          return column === row.length - 1 ? cell : cell + ' '.repeat(padding);
        })
        .join('   ')
        .trimEnd(),
    )
    .join('\n');
}

function describeChange(change: DefinitionChange): string {
  const subject = `${change.scope} "${change.name}"`;

  switch (change.kind) {
    case 'added':
      return `${subject}: added`;
    case 'removed':
      return `${subject}: removed`;
    case 'changed':
      return `${subject}: ${change.detail}`;
  }
}

/**
 * Formats the summary table, followed by one detail block per style that
 * is not identical.
 */
export function formatReport(reports: PairReport[]): string {
  const rows = [
    ['Style', 'Seeds', 'Variants', 'Components', 'Colors', 'Result'].map(
      (cell) => chalk.bold(cell),
    ),
    ...reports.map((report) => [
      report.name,
      sweepCell(report, 'seeds'),
      sweepCell(report, 'variants'),
      countCell(report.changes, ['component', 'variant']),
      countCell(report.changes, ['color']),
      resultCell(report),
    ]),
  ];

  const blocks = [renderTable(rows)];

  for (const report of reports) {
    if (report.status === 'identical') {
      continue;
    }

    const lines = [chalk.bold(report.name)];

    if (report.note) {
      lines.push(`  ${chalk.red(report.note)}`);
    }

    for (const change of report.changes) {
      lines.push(`  ${describeChange(change)}`);
    }

    for (const key of ['seeds', 'variants'] as const) {
      for (const difference of report[key]?.different ?? []) {
        lines.push(
          `  ${key === 'seeds' ? 'seed' : 'variant'} "${difference.name}": ` +
            `${difference.share.toFixed(2)}% of pixels differ`,
        );
      }
    }

    blocks.push(lines.join('\n'));
  }

  return blocks.join('\n\n');
}
