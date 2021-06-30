import { Command } from 'commander';
import { makeCreateStyleCommand } from './makeCreateStyleCommand';
import type { Style } from '@dicebear/avatars';

export async function makeCreateCommand() {
  const { default: omitted, ...styles } = await import('@dicebear/collection');
  const cmd = new Command('create');

  for (let name of Object.keys(styles)) {
    const style: Style<any> = styles[name as keyof typeof styles];

    cmd.addCommand(await makeCreateStyleCommand(name, style));
  }

  return cmd;
}
