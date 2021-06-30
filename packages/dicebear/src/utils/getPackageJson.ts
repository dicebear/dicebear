export function getPackageJson() {
  const packageJson = '../../package.json';

  return import(packageJson);
}
