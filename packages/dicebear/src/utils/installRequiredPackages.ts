import execa from 'execa';
import path from 'path';
import ora from 'ora';
import semver from 'semver';

import { getPackageJson } from './getPackageJson';

/**
 * The DiceBear packages are installed here, because otherwise there would be a circular dependency in the repository.
 */
export async function installRequiredPackages() {
  const pkg = await getPackageJson();

  const requiredPackages: Record<string, string> = {
    '@dicebear/avatars': pkg.version,
    '@dicebear/collection': pkg.version,
  };

  const installSpinner = ora('Check and install dicebear packages').start();

  try {
    try {
      for (let pkgName in requiredPackages) {
        if (requiredPackages.hasOwnProperty(pkgName)) {
          let requiredPkg = await getPackageJson(pkgName);

          if (false === semver.satisfies(requiredPkg.version, `~${requiredPkg.version}`)) {
            throw new Error('Invalid version installed');
          }
        }
      }
    } catch {
      await execa(
        'npm',
        ['install', '--no-save', ...Object.keys(requiredPackages).map((v) => `${v}@${requiredPackages[v]}`)],
        {
          cwd: path.resolve(__dirname, '..'),
          stdio: 'ignore',
        }
      );
    }

    installSpinner.succeed();
  } catch (e) {
    installSpinner.fail();

    throw e;
  }
}
