import { Command } from 'commander';
//import updateNotifier from 'update-notifier';

import { create } from './commands/create';

(async () => {
  const packageJson = '../package.json';
  const pkg = await import(packageJson);

  //updateNotifier({ pkg }).notify();

  const program = new Command('dicebear');

  program.version(pkg.version, '-v, --version');

  program.addCommand(create);

  await program.parseAsync(process.argv);
})();
