import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import { PackageJson } from 'type-fest';
import type { InputOptions, OutputOptions } from 'rollup';

import { babel } from '../utils/rollup/babel';
import { replace } from '../utils/rollup/replace';
import { typescript } from '../utils/rollup/typescript';

export function createUmdConfig(name: string, pkg: PackageJson) {
  const input: InputOptions = {
    input: 'src/index.ts',
    external: ['@dicebear/avatars'],
    plugins: [
      replace(),
      resolve(),
      commonjs(),
      typescript(),
      babel(),
      terser({
        format: {
          comments: /(^!|Copyright|License|@preserve)/i,
        },
      }),
    ],
  };

  const output: OutputOptions[] = [
    {
      name: name,
      file: pkg.browser as string,
      format: 'umd',
      exports: 'named',
      globals: {
        '@dicebear/avatars': 'DiceBear',
      },
    },
  ];

  return { input, output };
}
