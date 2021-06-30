import spawn from 'cross-spawn';
import path from 'path';
import ora from 'ora';

import { getPackageJson } from './getPackageJson';

export async function installRequiredPackages() {
  const pkg = await getPackageJson();

  const requiredPackages = [
    //`@dicebear/avatars@${pkg.version}`,
    // `@dicebear/collection@${pkg.version}`
    `@dicebear/avatars`,
    `@dicebear/collection`,
  ];

  const installSpinner = ora('Check and install avatars packages').start();

  try {
    await spawn.sync('npm', ['install', '--no-save', ...requiredPackages], { cwd: path.resolve(__dirname, '..') });

    installSpinner.succeed();
  } catch (e) {
    installSpinner.fail();

    throw e;
  }
}
