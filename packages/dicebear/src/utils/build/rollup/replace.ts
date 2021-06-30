// @ts-ignore
import replacePlugin from 'rollup-plugin-re';

export function replace() {
  return replacePlugin({
    patterns: [
      {
        test: /^[ ]{2,}/gm,
        replace: '',
      },
    ],
  });
}
