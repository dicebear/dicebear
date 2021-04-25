import typescriptPlugin from 'rollup-plugin-typescript2';

export function typescript() {
  return typescriptPlugin({
    tsconfigOverride: {
      compilerOptions: {
        module: 'ESNext',
        target: 'esnext',
      },
    },
  });
}
