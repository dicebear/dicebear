import { Command } from 'commander';
import { makeNewCommand } from 'dicebear-project/lib/utils/command/makeNewCommand';
import { makeBuildCommand } from 'dicebear-project/lib/utils/command/makeBuildCommand';

export async function makeProjectCommand() {
  const cmd = new Command('project');

  cmd.addCommand(await makeNewCommand());
  cmd.addCommand(await makeBuildCommand());

  return cmd;
}
