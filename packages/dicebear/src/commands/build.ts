import { Command } from 'commander';
import { build as buildAction } from '@dicebear/build';

export const build = new Command('build').arguments('<name>').action(buildAction);
