import type { Package } from 'update-notifier';

export function getPackageJson(packageName?: string): Promise<Package> {
  const packageJson = packageName ? `${packageName}/package.json` : '../../package.json';

  return import(packageJson);
}
