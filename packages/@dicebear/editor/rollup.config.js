import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
import sveld from 'sveld';
import pkg from './package.json';

const production = !process.env.ROLLUP_WATCH;

export default {
  input: pkg.svelte,
  external: ['@dicebear/avatars'],
  output: {
    sourcemap: !production,
    format: 'umd',
    name: 'DiceBear.Editor',
    file: pkg.main,
    globals: {
      '@dicebear/avatars': 'DiceBear',
    },
  },
  plugins: [
    svelte({
      preprocess: sveltePreprocess({ sourceMap: !production }),
      emitCss: false,
      compilerOptions: {
        dev: !production,
      },
    }),
    resolve({
      browser: true,
      dedupe: ['svelte'],
    }),
    commonjs(),
    typescript({
      sourceMap: !production,
      inlineSources: !production,
    }),
    sveld(),
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
};
