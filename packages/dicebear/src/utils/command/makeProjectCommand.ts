import { Command } from 'commander';
import { makeProjectNewCommand } from './makeProjectNewCommand';
import { makeProjectBuildCommand } from './makeProjectBuildCommand';

export async function makeProjectCommand() {
  const cmd = new Command('project');

  cmd.addCommand(await makeProjectNewCommand());
  cmd.addCommand(await makeProjectBuildCommand());

  return cmd;
}
