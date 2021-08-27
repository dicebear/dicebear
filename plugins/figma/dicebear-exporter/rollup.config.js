import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import svg from "rollup-plugin-svg";
import typescript from "rollup-plugin-typescript";
import preprocess from "svelte-preprocess";
import { babel } from "@rollup/plugin-babel";

/* Post CSS */
import postcss from "rollup-plugin-postcss";
import cssnano from "cssnano";

/* Inline to single html */
import htmlBundle from "rollup-plugin-html-bundle";

const production = !process.env.ROLLUP_WATCH;

export default [
  {
    input: "src/ui/index.js",
    output: {
      format: "iife",
      name: "ui",
      file: "src/build/bundle.js",
    },
    plugins: [
      svelte({
        // enable run-time checks when not in production
        dev: !production,
        preprocess: preprocess(),
      }),

      // If you have external dependencies installed from
      // npm, you'll most likely need these plugins. In
      // some cases you'll need additional configuration —
      // consult the documentation for details:¡
      // https://github.com/rollup/plugins/tree/master/packages/commonjs
      resolve({
        browser: true,
        dedupe: (importee) =>
          importee === "svelte" || importee.startsWith("svelte/"),
        extensions: [".svelte", ".mjs", ".js", ".json", ".node"],
      }),
      commonjs(),
      svg(),
      postcss({
        extensions: [".css"],
        plugins: [cssnano()],
      }),
      htmlBundle({
        template: "src/ui/template.html",
        target: "public/index.html",
        inline: true,
      }),

      // If we're building for production (npm run build
      // instead of npm run dev), minify
      production && terser(),
    ],
    watch: {
      clearScreen: false,
    },
  },
  {
    input: "src/code/index.ts",
    output: {
      file: "public/code.js",
      format: "cjs",
      name: "code",
    },
    plugins: [
      typescript(),
      resolve({
        browser: true,
      }),
      commonjs(),
      babel({
        babelHelpers: "bundled",
        compact: false,
        presets: [
          [
            "@babel/preset-env",
            {
              useBuiltIns: "entry",
              corejs: 3,
            },
          ],
        ],
      }),
      production && terser(),
    ],
  },
];
