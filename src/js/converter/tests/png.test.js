import { toPng } from '../lib/node/index.js';
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

test(`Convert to png buffer`, async () => {
  assert.doesNotThrow(() => toPng(avatar).toArrayBuffer());
});

test(`Convert to png data uri`, async () => {
  assert.doesNotThrow(() => toPng(avatar).toDataUri());
});

test(`PNG output respects size option`, async () => {
  const buffer = await toPng(avatar, { size: 128 }).toArrayBuffer();
  const metadata = await sharp(Buffer.from(buffer)).metadata();
  assert.equal(metadata.width, 128);
  assert.equal(metadata.height, 128);
});

test(`PNG output defaults to 512`, async () => {
  const buffer = await toPng(avatar).toArrayBuffer();
  const metadata = await sharp(Buffer.from(buffer)).metadata();
  assert.equal(metadata.width, 512);
  assert.equal(metadata.height, 512);
});

test(`PNG output clamps oversized value to 2048`, async () => {
  const buffer = await toPng(avatar, { size: 99999 }).toArrayBuffer();
  const metadata = await sharp(Buffer.from(buffer)).metadata();
  assert.equal(metadata.width, 2048);
  assert.equal(metadata.height, 2048);
});

test(`PNG output honors mask-type:alpha from a style declaration`, async () => {
  // resvg reads `mask-type` only as a presentation attribute, and `toBuffer`
  // bridges that via prepareForResvg. The mask shape is black, so under the
  // `luminance` default it would hide the red square entirely. This asserts
  // the wiring, not the rewrite: dropping the normalization from the node
  // path leaves the unit tests green but turns this pixel transparent.
  const masked = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs>
      <mask id="m" style="mask-type:alpha">
        <rect x="10" y="10" width="80" height="80" fill="#000000"/>
      </mask>
    </defs>
    <g mask="url(#m)"><rect width="100" height="100" fill="#ff0000"/></g>
  </svg>`;

  const buffer = await toPng(masked, { size: 100 }).toArrayBuffer();
  const { data } = await sharp(Buffer.from(buffer))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const center = (50 * 100 + 50) * 4;

  assert.deepEqual(
    [data[center], data[center + 1], data[center + 2], data[center + 3]],
    [255, 0, 0, 255],
    'the alpha mask should reveal the red square',
  );
});
