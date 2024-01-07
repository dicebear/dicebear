import updateNotifier from 'update-notifier';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import fs from 'fs-extra';

import { createCommand } from './commands/create/index.js';

(async () => {
  const pkg = await fs.readJson(
    new URL('../package.json', import.meta.url).pathname
  );

  updateNotifier({ pkg }).notify();

  yargs(hideBin(process.argv))
    .command(createCommand)
    .strictCommands()
    .demandCommand()
    .help()
    .locale('en')
    .parse();
})();
