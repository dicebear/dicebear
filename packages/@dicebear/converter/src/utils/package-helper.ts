import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export async function ensurePackage(name: string, version: string) {
  let packageJson: { version: string };

  try {
    packageJson = require(`${name}/package.json`);
  } catch (e) {
    // prettier-ignore
    throw new Error(`Please install \`${name}@^${version}\` to use this feature.'`);
  }

  const packageVersion = packageJson.version.split('.').map((v) => parseInt(v));
  const requiredVersion = version.split('.').map((v) => parseInt(v));

  if (
    packageVersion[0] !== requiredVersion[0] ||
    packageVersion[1] < requiredVersion[1]
  ) {
    throw new Error(
      `Please install \`${name}@^${version}\` to use this feature. (Currently installed version: \`${packageJson.version})\`})'`
    );
  }
}
