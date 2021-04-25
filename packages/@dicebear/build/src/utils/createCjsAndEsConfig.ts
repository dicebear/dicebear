import commonjs from '@rollup/plugin-commonjs';
import { PackageJson } from 'type-fest';
import type { InputOptions, OutputOptions } from 'rollup';

import { babel } from '../utils/rollup/babel';
import { replace } from '../utils/rollup/replace';
import { typescript } from '../utils/rollup/typescript';

export function createCjsAndEsConfig(pkg: PackageJson) {
  let external: RegExp[] = [];

  Object.keys(pkg.dependencies ?? {}).forEach((name) => {
    external.push(new RegExp(`^${name.replace('/', '\\/')}`));
  });

  Object.keys(pkg.peerDependencies ?? {}).forEach((name) => {
    external.push(new RegExp(`^${name.replace('/', '\\/')}`));
  });

  const input: InputOptions = {
    input: 'src/index.ts',
    external,
    plugins: [replace(), commonjs(), typescript(), babel()],
  };

  const output: OutputOptions[] = [
    { file: pkg.main, format: 'cjs', exports: 'named' },
    { file: pkg.module, format: 'es', exports: 'named' },
  ];

  return { input, output };
}
