#!/usr/bin/env node

import sade from 'sade';
import pkg from '../package.json';

import { commands } from './';

const name = Object.keys(pkg.bin)[0];
const prog = sade(name);

prog.version(pkg.version);

prog
  .command('schema:create-type')
  .describe('Generates types from JSON schema files.')
  .option('-i, --input', 'Set the path to the JSON schema input file.', './src/schema.json')
  .option('-o, --output', 'Set the path to the typings output files.', './src/options.ts')
  .example(`${name} options:build`)
  .example('${name} options:build -i ./path/to/schema.json')
  .action(commands.schema.createType);

prog.parse(process.argv);
