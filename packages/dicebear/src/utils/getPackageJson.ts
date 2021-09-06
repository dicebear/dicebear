import fs from 'fs-extra';
import type { Package } from 'update-notifier';

export function getPackageJson(): Promise<Package> {
  const packageJson = new URL('../../package.json', import.meta.url).pathname;

  return fs.readJson(packageJson);
}
