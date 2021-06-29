import typescriptPlugin from 'rollup-plugin-typescript2';

const production = !process.env.ROLLUP_WATCH;

export function typescript() {
  return typescriptPlugin({
    objectHashIgnoreUnknownHack: true,
    tsconfigOverride: {
      rootDir: './src',
      compilerOptions: {
        module: 'ESNext',
        target: 'esnext',
        sourceMap: !production,
        inlineSources: !production,
      },
    },
  });
}
