import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import replace from 'rollup-plugin-re';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

export default [
  {
    input: 'src/index.ts',
    output: {
      name: 'DiceBear',
      file: pkg.browser,
      format: 'umd',
      exports: 'named',
      globals: {
        '@dicebear/avatars': 'DiceBear',
      },
    },
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
      typescript(),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      { file: pkg.main, format: 'cjs', exports: 'named' },
      { file: pkg.module, format: 'es', exports: 'named' },
    ],
    external: [/svgson/, /pure-color/],
    plugins: [
      replace({
        patterns: [
          {
            test: /^[ ]{2,}/gm,
            replace: '',
          },
        ],
      }),
      commonjs(),
      typescript(),
    ],
  },
];
