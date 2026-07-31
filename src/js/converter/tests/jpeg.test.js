import { toJpeg } from '../lib/node/index.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { test } from 'node:test';
import assert from 'node:assert/strict';
import sharp from 'sharp';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const avatar = fs.readFileSync(path.resolve(__dirname, 'fixtures/avatar.svg'), {
  encoding: 'utf8',
});

test(`Convert to jpeg buffer`, async () => {
  assert.doesNotThrow(() => toJpeg(avatar).toArrayBuffer());
});

test(`Convert to jpeg data uri`, async () => {
  assert.doesNotThrow(() => toJpeg(avatar).toDataUri());
});

test(`JPEG output flattens the corners of a stripped rounded clip to white`, async () => {
  // The corner crop must land before the jpeg flatten: sharp runs flatten
  // before composite within one pipeline, so toBuffer hands the composited
  // raster into a second pipeline for jpeg. Without that, the corners come
  // out black instead of white.
  const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs><clipPath id="c"><rect width="100" height="100" rx="25" ry="25"/></clipPath></defs>
    <g clip-path="url(#c)"><rect width="100" height="100" fill="#ff0000"/></g>
  </svg>`;

  const buffer = await toJpeg(rounded, { size: 100 }).toArrayBuffer();
  const { data, info } = await sharp(Buffer.from(buffer))
    .raw()
    .toBuffer({ resolveWithObject: true });

  const corner = (1 * info.width + 1) * info.channels;
  const center = (50 * info.width + 50) * info.channels;

  // JPEG is lossy, so the probes allow a small tolerance.
  assert.ok(
    data[corner] > 240 && data[corner + 1] > 240 && data[corner + 2] > 240,
    `the corner should be white, got ${data[corner]},${data[corner + 1]},${data[corner + 2]}`,
  );
  assert.ok(
    data[center] > 240 && data[center + 1] < 40 && data[center + 2] < 40,
    `the center should be red, got ${data[center]},${data[center + 1]},${data[center + 2]}`,
  );
});
