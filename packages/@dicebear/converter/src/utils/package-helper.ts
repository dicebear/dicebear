import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export async function ensurePackage(name: string, version: string) {
  try {
    require.resolve(name);
  } catch (e) {
    // prettier-ignore
    throw new Error(`Please install \`${name}@^${version}\` to use this feature.'`);
  }
}
