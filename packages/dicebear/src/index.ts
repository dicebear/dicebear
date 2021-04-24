import { Command } from 'commander';
import updateNotifier from 'update-notifier';

import { create } from './commands/create';
import { build } from './commands/build';

(async () => {
  const packageJson = '../package.json';
  const pkg = await import(packageJson);

  updateNotifier({ pkg }).notify();

  const program = new Command('dicebear');

  program.version(pkg.version, '-v, --version');

  program.addCommand(create);
  program.addCommand(build);

  await program.parseAsync(process.argv);
})();
