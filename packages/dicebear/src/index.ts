import updateNotifier from 'update-notifier';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getPackageJson } from './utils/getPackageJson.js';

import { createCommand } from './commands/create/index.js';

(async () => {
  const pkg = await getPackageJson();
  updateNotifier({ pkg }).notify();

  const cli = yargs(hideBin(process.argv));

  cli
    .command(createCommand)
    .strictCommands()
    .demandCommand()
    .help()
    .locale('en')
    .parse();
})();
