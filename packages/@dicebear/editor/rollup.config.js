import { createCjsAndEsConfig } from 'dicebear/lib/utils/build/createCjsAndEsConfig';
import { createUmdConfig } from 'dicebear/lib/utils/build/createUmdConfig';

import sveltePlugin from 'rollup-plugin-svelte';
import sveltePreprocess from 'svelte-preprocess';
import * as path from 'path';

const production = !process.env.ROLLUP_WATCH;

export default async () => {
  const pkg = await import(path.resolve(__dirname, 'package.json'));

  const cjsAndEsConfig = createCjsAndEsConfig(pkg);
  const umdConfig = createUmdConfig('DiceBear.Editor', pkg);

  const svelte = sveltePlugin({
    preprocess: sveltePreprocess({ sourceMap: !production }),
    emitCss: false,
    compilerOptions: {
      dev: !production,
    },
  });

  return [
    {
      ...cjsAndEsConfig.input,
      plugins: [svelte, ...cjsAndEsConfig.input.plugins],
      output: cjsAndEsConfig.output,
    },
    {
      ...umdConfig.input,
      plugins: [svelte, ...umdConfig.input.plugins],
      output: umdConfig.output,
    },
  ];
};
