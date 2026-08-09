import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { buildSync } from 'esbuild';

import type { AvatarStyleSizeBundle } from '@theme/types';
import { definitionsDir } from './avatarStyles.ts';

function sizeFor(file: string): { raw: number; gzip: number } {
  const buf = fs.readFileSync(file);
  return { raw: buf.byteLength, gzip: gzipSync(buf).byteLength };
}

/**
 * Measures what a package actually adds to an application bundle: one
 * minified esbuild bundle of the whole package, gzipped as a single stream.
 * Summing the published lib files one by one would overstate core (no
 * minification, one gzip header per file) and understate the converter,
 * whose browser build pulls its XML dependencies into the bundle.
 */
function bundleSize(pkg: string): { raw: number; gzip: number } {
  const result = buildSync({
    stdin: {
      contents: `export * from '${pkg}';`,
      resolveDir: path.dirname(fileURLToPath(import.meta.url)),
    },
    bundle: true,
    minify: true,
    format: 'esm',
    platform: 'browser',
    write: false,
  });

  const out = result.outputFiles[0].contents;

  return { raw: out.byteLength, gzip: gzipSync(Buffer.from(out)).byteLength };
}

const styles: Record<string, { raw: number; gzip: number }> = {};
for (const file of fs.readdirSync(definitionsDir)) {
  if (!file.endsWith('.min.json')) continue;
  const name = file.replace('.min.json', '');
  styles[name] = sizeFor(path.join(definitionsDir, file));
}

const avatarStyleSizes: AvatarStyleSizeBundle = {
  core: bundleSize('@dicebear/core'),
  converter: bundleSize('@dicebear/converter'),
  styles,
};

export default avatarStyleSizes;
