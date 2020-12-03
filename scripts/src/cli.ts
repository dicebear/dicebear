import { promises as fs } from 'fs';
import dotenv from 'dotenv';
import sade from 'sade';
import yaml from 'yaml';
import path from 'path';
import * as commands from './commands';

dotenv.config();

(async () => {
  const prog = sade('avatars-cdn');

  const config = yaml.parse(
    await fs.readFile(path.resolve(__dirname, '../config.yml'), {
      encoding: 'utf-8',
    })
  );

  prog.command('update').describe('Updates CDN Config.').action(commands.update(config));
  prog.command('stats').describe('Get last day CDN Stats.').action(commands.stats(config));

  prog.parse(process.argv);
})();
