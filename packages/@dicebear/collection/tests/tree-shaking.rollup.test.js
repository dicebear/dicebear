import { fileURLToPath } from 'url';
import { test } from 'uvu';
import { equal, match } from 'uvu/assert';
import { rollup } from 'rollup';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

test(`Tree shaking with rollup`, async () => {
  const bundle = await rollup({
    input: `${__dirname}/fixtures/tree-shaking/index.js`,
    plugins: [nodeResolve(), commonjs()],
  });

  const { output } = await bundle.generate({
    format: 'esm',
  });

  equal(output.length, 1);

  for (const module in output[0].modules) {
    match(module, /@dicebear\/(core|converter|identicon|collection)/);
  }
});

test.run();
