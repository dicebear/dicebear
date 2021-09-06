import { Command } from 'commander';
import updateNotifier from 'update-notifier';
import * as collection from '@dicebear/collection';

import { getPackageJson } from './utils/getPackageJson.js';
import { makeStyleCommand } from './command/makeStyleCommand.js';

(async () => {
  const pkg = await getPackageJson();
  const program = new Command('dicebear');

  updateNotifier({ pkg }).notify();

  program.version(pkg.version, '-v, --version');

  for (let name of Object.keys(collection)) {
    const style = collection[name as keyof typeof collection];

    program.addCommand(await makeStyleCommand(name, style));
  }

  await program.parseAsync(process.argv);
})();
