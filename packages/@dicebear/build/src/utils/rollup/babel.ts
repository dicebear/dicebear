import { DEFAULT_EXTENSIONS } from '@babel/core';
import { babel as babelPlugin } from '@rollup/plugin-babel';

export function babel() {
  return babelPlugin({
    babelHelpers: 'bundled',
    extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx'],
    presets: [
      [
        '@babel/preset-env',
        {
          targets: {
            browsers: '>.25%, not IE > 0, not dead',
            node: 12,
          },
        },
      ],
    ],
  });
}
