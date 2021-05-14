import typescriptPlugin from 'rollup-plugin-typescript2';

const production = !process.env.ROLLUP_WATCH;

export function typescript() {
  return typescriptPlugin({
    tsconfigOverride: {
      compilerOptions: {
        module: 'ESNext',
        target: 'esnext',
        sourceMap: !production,
        inlineSources: !production,
      },
    },
  });
}
