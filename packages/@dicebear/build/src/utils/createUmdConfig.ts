// @ts-ignore
import replace from 'rollup-plugin-re';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import { PackageJson } from 'type-fest';
import type { InputOptions, OutputOptions } from 'rollup';

export function createUmdConfig(name: string, pkg: PackageJson) {
  const input: InputOptions = {
    input: 'src/index.ts',
    external: ['@dicebear/avatars'],
    plugins: [
      replace({
        patterns: [
          {
            test: /^[ ]{2,}/gm,
            replace: '',
          },
        ],
      }),
      resolve(),
      commonjs(),
      typescript({
        tsconfigOverride: {
          compilerOptions: {
            module: 'ESNext',
            target: 'esnext',
          },
        },
      }),
      terser(),
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
