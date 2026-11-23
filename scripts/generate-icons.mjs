// Generates the app icon in every file the site serves: favicon.svg,
// logo-readme.svg, the PNG icons and favicon.ico in apps/docs/pages/public.
// Rerun after a change to the mark or its colors:
// `node scripts/generate-icons.mjs`.
//
// The mark is the bear of the logo, drawn as negative space: the tile is the
// bear's color, the shape around it and the eye are the ground. A beige bear
// on the charcoal of the dark theme reads at 16px in light and dark tab bars
// alike, and sits as well in the dark playground as in the light one.
//
// Icons a browser shows as they are (favicons, the README icon) get rounded
// corners like the stickers on the site. Icons a system masks itself (the
// Apple touch icon, the maskable web app icons) stay square and full-bleed,
// so the mask never cuts into a transparent corner.

import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Resvg } from '@resvg/resvg-js';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(rootDir, 'apps', 'docs', 'pages', 'public');

// The charcoal of the dark theme (`--db-c-paper` in dark) and the beige of
// the avatar tiles (`--db-tile`).
const INK = '#1c1b19';
const BEIGE = '#f5eee2';

/** Corner radius of the rounded icons, as a share of the side. */
const ROUNDED = 0.22;

const BEAR =
  'M32 0C14.3269 0 0 14.3269 0 32V480C0 497.673 14.3269 512 32 512H305.911C322.044 512 332.33 494.783 324.497 480.678C303.442 442.762 283.328 409.294 270.667 394.824C234.592 353.595 65.3014 392.046 59.9493 257.537C59.5978 248.704 65.5377 240.978 73.9237 238.183L156.513 210.654C161.344 209.043 165.431 205.761 168.186 201.478C175.987 189.349 193.403 163.767 209.333 150.824C224.404 138.579 248.793 123.006 293.31 115.859C302.215 114.43 309.286 107.794 313.623 99.8875C324.038 80.9022 344.69 69.3794 366.454 72.5117C394.88 76.6029 414.438 104.145 410.137 134.028C409.82 136.226 410.555 138.462 412.21 139.941C431.16 156.884 451.193 180.347 471.019 206.846C483.737 223.845 512 215.241 512 194.011V32C512 14.3269 497.673 0 480 0H32Z';

/** The eye, at the same spot as in logo.svg (16.17, 12.83 on 32px). */
const EYE = '<circle cx="258.667" cy="205.333" r="26.667" fill="' + INK + '"/>';

function mark(radius) {
  const rx = Math.round(512 * radius);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512" fill="none"><clipPath id="tile"><rect width="512" height="512" rx="${rx}"/></clipPath><g clip-path="url(#tile)"><rect width="512" height="512" fill="${BEIGE}"/><path d="${BEAR}" fill="${INK}"/>${EYE}</g></svg>\n`;
}

function png(svg, size) {
  return new Resvg(svg, { fitTo: { mode: 'width', value: size } })
    .render()
    .asPng();
}

/** An ICO file whose entries are PNGs, which every current browser reads. */
function ico(images) {
  const header = Buffer.alloc(6 + 16 * images.length);
  let offset = header.length;

  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  images.forEach(({ size, data }, index) => {
    const entry = 6 + 16 * index;

    header.writeUInt8(size >= 256 ? 0 : size, entry);
    header.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    header.writeUInt8(0, entry + 2);
    header.writeUInt8(0, entry + 3);
    header.writeUInt16LE(1, entry + 4);
    header.writeUInt16LE(32, entry + 6);
    header.writeUInt32LE(data.length, entry + 8);
    header.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, ...images.map((image) => image.data)]);
}

const rounded = mark(ROUNDED);
const square = mark(0);

writeFileSync(join(publicDir, 'favicon.svg'), rounded);
writeFileSync(join(publicDir, 'logo-readme.svg'), rounded);
writeFileSync(join(publicDir, 'favicon-96x96.png'), png(rounded, 96));
writeFileSync(join(publicDir, 'apple-touch-icon.png'), png(square, 180));
writeFileSync(
  join(publicDir, 'web-app-manifest-192x192.png'),
  png(square, 192),
);
writeFileSync(
  join(publicDir, 'web-app-manifest-512x512.png'),
  png(square, 512),
);
writeFileSync(
  join(publicDir, 'favicon.ico'),
  ico([48, 32, 16].map((size) => ({ size, data: png(rounded, size) }))),
);

console.log('Wrote the icons to', publicDir);
