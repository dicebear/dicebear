import { Command } from 'commander';
import { makeCreateStyleCommand } from './makeCreateStyleCommand';
import * as collection from '@dicebear/collection';

export async function makeCreateCommand() {
  const cmd = new Command('create');

  try {
    for (let name of Object.keys(collection)) {
      const style = collection[name as keyof typeof collection];

      cmd.addCommand(await makeCreateStyleCommand(name, style));
    }
  } catch {
    cmd.action(() => {
      throw new Error('Could not load `@dicebear/collection`.');
    });
  }

  return cmd;
}
