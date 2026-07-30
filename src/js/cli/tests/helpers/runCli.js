import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

export const binPath = fileURLToPath(
  new URL('../../bin/index.js', import.meta.url),
);

/** Runs the built CLI with the given arguments and captures the result. */
export function runCli(args) {
  return spawnSync('node', [binPath, ...args], {
    encoding: 'utf-8',
    // Keep update-notifier from emitting noise / hitting the network.
    env: { ...process.env, NO_UPDATE_NOTIFIER: '1' },
  });
}
