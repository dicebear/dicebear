import { Command } from 'commander';
import updateNotifier from 'update-notifier';

import { installRequiredPackages } from './utils/installRequiredPackages';
import { getPackageJson } from './utils/getPackageJson';
import { makeCreateCommand } from './utils/command/makeCreateCommand';
import { makeProjectCommand } from './utils/command/makeProjectCommand';

(async () => {
  await installRequiredPackages();

  const pkg = await getPackageJson();
  const program = new Command('dicebear');

  updateNotifier({ pkg }).notify();

  program.version(pkg.version, '-v, --version');
  program.addCommand(await makeCreateCommand());
  program.addCommand(await makeProjectCommand());

  await program.parseAsync(process.argv);
})();
