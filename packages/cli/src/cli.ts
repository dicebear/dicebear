#!/usr/bin/env node

import sade from 'sade';
import * as commands from './commands';

(async () => {
  // package.json should not be bundled with microbundle
  const packageJson = '../package.json';
  const pkg = await import(packageJson);

  const name = Object.keys(pkg.bin)[0];
  const prog = sade(name);

  prog.version(pkg.version);

  prog
    .command('schema:create-types <input> <output>')
    .describe('Generates TypeScript types from JSON schema file.')
    .example(`${name} schema:create-type ./path/to/schema.json ./schema.js`)
    .action(commands.schema.createTypes);

  prog.parse(process.argv);
})();
