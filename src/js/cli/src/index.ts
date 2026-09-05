import updateNotifier from 'update-notifier';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { chalkStderr } from 'chalk';

import { getPackageJson } from './utils/getPackageJson.js';
import { createCommand } from './commands/create.js';
import { optimizeCommand } from './commands/optimize.js';
import { compareCommand } from './commands/compare.js';
import { resolveBuiltInPath } from './utils/resolveStyle.js';
import { reportError } from './utils/reportError.js';

// A reader that stops early (`dicebear create ... | head -c 100`) closes the
// pipe. That is not an error worth a stack trace.
process.stdout.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EPIPE') {
    process.exit(0);
  }

  throw error;
});

(async () => {
  const pkg = await getPackageJson();
  updateNotifier({ pkg }).notify();

  const cli = yargs(hideBin(process.argv))
    .scriptName('dicebear')
    // With greedy arrays `--flip horizontal lorelei` would read the style
    // name as a second flip value. Lists are given as repeated flags or as
    // one comma-separated value instead.
    .parserConfiguration({ 'greedy-arrays': false })
    .command(createCommand)
    .command(optimizeCommand)
    .command(compareCommand)
    .demandCommand(1, 'Pick a command: create, optimize or compare.')
    .strict()
    .help()
    .version(pkg.version)
    .locale('en')
    .fail((message, error, instance) => {
      if (error) {
        throw error;
      }

      const unknown = /^Unknown arguments?: (.+)$/.exec(message)?.[1];
      const first = unknown?.split(',')[0].trim();
      const hint =
        first && (resolveBuiltInPath(first) || first.endsWith('.json'))
          ? `\nDid you mean \`dicebear create ${first}\`?`
          : '';

      instance.showHelp('error');
      console.error(chalkStderr.red(`\n${message}${hint}`));
      process.exitCode = 1;
    });

  try {
    await cli.parseAsync();
  } catch (error) {
    reportError(error);
  }
})();
