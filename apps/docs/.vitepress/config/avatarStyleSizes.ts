import { createRequire } from 'node:module';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { gzipSync } from 'node:zlib';

import type { AvatarStyleSizeBundle } from '@theme/types';
import { definitionsDir } from './avatarStyles.ts';

const require = createRequire(import.meta.url);

function sizeFor(file: string): { raw: number; gzip: number } {
  const buf = fs.readFileSync(file);
  return { raw: buf.byteLength, gzip: gzipSync(buf).byteLength };
}

function walkJsFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkJsFiles(full));
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      out.push(full);
    }
  }
  return out;
}

const coreLibDir = path.dirname(require.resolve('@dicebear/core'));
// @dicebear/converter `main` points to lib/node/index.js; step up to lib/
const converterLibDir = path.dirname(
  path.dirname(require.resolve('@dicebear/converter')),
);

const styles: Record<string, { raw: number; gzip: number }> = {};
for (const file of fs.readdirSync(definitionsDir)) {
  if (!file.endsWith('.min.json')) continue;
  const name = file.replace('.min.json', '');
  styles[name] = sizeFor(path.join(definitionsDir, file));
}

function bundleSize(
  dir: string,
  exclude: (file: string) => boolean = () => false,
) {
  let raw = 0;
  let gzip = 0;
  for (const file of walkJsFiles(dir)) {
    if (exclude(file)) continue;
    const s = sizeFor(file);
    raw += s.raw;
    gzip += s.gzip;
  }
  return { raw, gzip };
}

const avatarStyleSizes: AvatarStyleSizeBundle = {
  core: bundleSize(coreLibDir),
  converter: bundleSize(converterLibDir, (file) =>
    file.includes(`${path.sep}node${path.sep}`),
  ),
  styles,
};

export default avatarStyleSizes;
