import path from 'path';
import { fileURLToPath } from 'url';
import { test } from 'uvu';
import { match } from 'uvu/assert';
import webpack from 'webpack';
import { dirSync } from 'tmp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test(`Tree shaking with webpack`, async () => {
  const tmpDir = dirSync();

  const modules = await new Promise((resolve, reject) => {
    webpack(
      {
        entry: `${__dirname}/fixtures/tree-shaking/index.js`,
        mode: 'production',
        output: {
          path: tmpDir.name,
        },
      },
      (err, stats) => {
        err
          ? reject(err)
          : resolve(
              stats
                .toJson()
                .modules.filter((v) => v.usedExports)
                .map((v) => v.identifier)
            );
      }
    );
  });

  for (const module of modules) {
    match(module, /@dicebear\/(core|converter|identicon|collection)/);
  }
});

test.run();
