import { Command } from 'commander';
import updateNotifier from 'update-notifier';

import { create } from './commands/create';
import { project } from './commands/project';

(async () => {
  const packageJson = '../package.json';
  const pkg = await import(packageJson);

  updateNotifier({ pkg }).notify();

  const program = new Command('dicebear');

  program.version(pkg.version, '-v, --version');

  program.addCommand(create);
  program.addCommand(project);

  await program.parseAsync(process.argv);
})();
