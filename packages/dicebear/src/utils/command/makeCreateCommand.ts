import { Command } from 'commander';
import { makeCreateStyleCommand } from './makeCreateStyleCommand';
// @ts-ignore
import type { Style } from '@dicebear/avatars';

export async function makeCreateCommand() {
  const cmd = new Command('create');

  try {
    // @ts-ignore
    const { default: omitted, ...styles } = await import('@dicebear/collection');

    for (let name of Object.keys(styles)) {
      const style: Style<any> = styles[name as keyof typeof styles];

      cmd.addCommand(await makeCreateStyleCommand(name, style));
    }
  } catch {
    cmd.action(() => {
      throw new Error('Could not load `@dicebear/collection`.');
    });
  }

  return cmd;
}
