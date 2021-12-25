import { Command } from 'commander';
import { makeCreateStyleCommand } from './makeCreateStyleCommand.js';
import * as collection from '@dicebear/collection';

export async function makeCreateCommand() {
  const cmd = new Command('create');

  for (let name of Object.keys(collection)) {
    const style = collection[name as keyof typeof collection];

    console.log({
      name,
      style,
    });

    cmd.addCommand(await makeCreateStyleCommand(name, style));
  }

  return cmd;
}
