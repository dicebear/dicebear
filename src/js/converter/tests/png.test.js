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

/**
 * The RGBA values at (x, y) of an encoded raster, for pixel-probe
 * assertions. The stride comes from the decoded image, not a hardcoded
 * width.
 */
async function pixel(buffer, x, y) {
  const { data, info } = await sharp(Buffer.from(buffer))
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const offset = (y * info.width + x) * 4;

  return [data[offset], data[offset + 1], data[offset + 2], data[offset + 3]];
}

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

test(`PNG output survives the resvg clip and opacity isolation bug`, async () => {
  // The bundled resvg miscomputes the isolation layer of an opacity group
  // under a full-canvas clip and a large rotation, and drops its content
  // (visible as half-empty waves PNGs). prepareForResvg strips such clips
  // before rendering. Without the strip, the probed pixel is pure blue.
  const clipped = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs><clipPath id="c"><rect width="100" height="100" rx="0" ry="0"/></clipPath></defs>
    <g clip-path="url(#c)">
      <rect width="100" height="100" fill="#0000ff"/>
      <g transform="rotate(-140, 50, 50)">
        <g opacity=".5"><rect x="-150" y="-150" width="400" height="400" fill="#ffffff"/></g>
      </g>
    </g>
  </svg>`;

  const buffer = await toPng(clipped, { size: 100 }).toArrayBuffer();

  assert.deepEqual(
    await pixel(buffer, 50, 50),
    [128, 128, 255, 255],
    'the translucent overlay should reach the whole canvas',
  );
});

test(`PNG output re-applies the rounded corners of a stripped clip`, async () => {
  const rounded = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs><clipPath id="c"><rect width="100" height="100" rx="25" ry="25"/></clipPath></defs>
    <g clip-path="url(#c)"><rect width="100" height="100" fill="#ff0000"/></g>
  </svg>`;

  const buffer = await toPng(rounded, { size: 100 }).toArrayBuffer();

  assert.equal(
    (await pixel(buffer, 1, 1))[3],
    0,
    'the corner should be cropped away',
  );
  assert.deepEqual(
    await pixel(buffer, 50, 50),
    [255, 0, 0, 255],
    'the center should stay untouched',
  );
});

test(`PNG output keeps translucent colors undarkened`, async () => {
  // resvg hands out premultiplied pixels. Fed to sharp as straight alpha,
  // this red would come back as 64,0,0,64 instead of 255,0,0,64.
  const translucent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
    <defs><clipPath id="c"><rect width="100" height="100" rx="25" ry="25"/></clipPath></defs>
    <g clip-path="url(#c)"><rect width="100" height="100" fill="#ff0000" fill-opacity=".25"/></g>
  </svg>`;

  const buffer = await toPng(translucent, { size: 100 }).toArrayBuffer();

  assert.deepEqual(await pixel(buffer, 50, 50), [255, 0, 0, 64]);
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

  assert.deepEqual(
    await pixel(buffer, 50, 50),
    [255, 0, 0, 255],
    'the alpha mask should reveal the red square',
  );
});
