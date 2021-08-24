import { Command } from 'commander';
import updateNotifier from 'update-notifier';

import { getPackageJson } from './utils/getPackageJson';
import { makeNewCommand } from './utils/command/makeNewCommand';
import { makeBuildCommand } from './utils/command/makeBuildCommand';

(async () => {
  const pkg = await getPackageJson();
  const program = new Command('dicebear');

  updateNotifier({ pkg }).notify();

  program.version(pkg.version, '-v, --version');

  program.addCommand(await makeNewCommand());
  program.addCommand(await makeBuildCommand());

  await program.parseAsync(process.argv);
})();
