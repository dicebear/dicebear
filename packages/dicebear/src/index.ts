import { Command } from 'commander';
import updateNotifier from 'update-notifier';

import { getPackageJson } from './utils/getPackageJson.js';
import { makeCreateCommand } from './utils/command/makeCreateCommand.js';

(async () => {
  const pkg = await getPackageJson();
  const program = new Command('dicebear');

  updateNotifier({ pkg }).notify();

  program.version(pkg.version, '-v, --version');

  program.addCommand(await makeCreateCommand());

  await program.parseAsync(process.argv);
})();
