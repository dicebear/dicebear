import updateNotifier from 'update-notifier';
import * as collection from '@dicebear/collection';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

import { getPackageJson } from './utils/getPackageJson.js';
import { addStyleCommand } from './utils/addStyleCommand.js';

(async () => {
  const pkg = await getPackageJson();
  updateNotifier({ pkg }).notify();

  const cli = yargs(hideBin(process.argv));

  for (let name of Object.keys(collection)) {
    const style = collection[name as keyof typeof collection];

    addStyleCommand(cli, name, style);
  }

  cli.demandCommand().help().locale('en').parse();
})();
