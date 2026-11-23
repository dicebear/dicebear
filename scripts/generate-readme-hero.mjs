// Generates apps/docs/pages/public/readme-hero.svg, the avatar grid at the
// top of the repository README (served as https://www.dicebear.com/readme-hero.svg).
// Rerun after visual style updates: `node scripts/generate-readme-hero.mjs`.
//
// The layout follows the stickers of the website: staggered, slightly turned
// white cards with a soft shadow on the beige of the site. A few tiles use
// animated style variants; the animations are plain CSS inside the embedded
// avatars and respect prefers-reduced-motion, so the hero stays still for
// readers who ask for that.

import { readFileSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Avatar, Style } from '@dicebear/core';

const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..');
const stylesDir = join(rootDir, 'node_modules', '@dicebear', 'styles', 'dist');
const outFile = join(
  rootDir,
  'apps',
  'docs',
  'pages',
  'public',
  'readme-hero.svg',
);

// 8 columns x 3 rows, mixing character, minimalist, and animated styles.
// Seeds are plain first names. CC0-licensed styles only: the hero embeds the
// artwork itself, and CC0 keeps the README free of attribution requirements.
// The generator throws on anything else.
//
// The grid is curated, not random:
// - Face-carrying styles pin friendly eyes/mouth variants, so no tile frowns.
// - Styles with a transparent default background get assigned pastels, and
//   the strongly colored styles sit apart from each other, for an even hue
//   spread across the grid.
// - The six animated tiles (`animationVariant`) land on columns 2/6, 4/8,
//   and 1/5, two per row, so motion is spread instead of clustered.
const TILES = [
  [
    { style: 'lorelei', seed: 'Mia', options: { backgroundColor: 'fde68a' } },
    {
      style: 'moods',
      seed: 'Felix',
      options: {
        animationVariant: 'slow',
        eyesVariant: 'happy',
        mouthVariant: 'bigSmile',
      },
    },
    {
      style: 'pixel-art',
      seed: 'Maja',
      options: { backgroundColor: 'bae6fd', mouthVariant: 'happy05' },
    },
    {
      style: 'notionists',
      seed: 'Alice',
      options: { backgroundColor: 'fed7aa', mouthVariant: 'variant05' },
    },
    {
      style: 'voxel-art',
      seed: 'Ben',
      options: { eyesVariant: 'happy', mouthVariant: 'smile' },
    },
    {
      style: 'constellation',
      seed: 'Nora',
      options: { animationVariant: 'medium' },
    },
    {
      style: 'clay',
      seed: 'Aiko',
      options: {
        backgroundColor: 'ddd6fe',
        eyesVariant: 'happy',
        mouthVariant: 'smile',
      },
    },
    { style: 'initial-face', seed: 'Sofia' },
  ],
  [
    { style: 'thumbs', seed: 'Paul' },
    {
      style: 'open-peeps',
      seed: 'Sam',
      options: { backgroundColor: 'bbf7d0', expressionVariant: 'cute' },
    },
    { style: 'rings', seed: 'Tara' },
    { style: 'landscape', seed: 'Lea', options: { animationVariant: 'slow' } },
    { style: 'identicon', seed: 'Zoe' },
    {
      style: 'critters',
      seed: 'Ida',
      options: { eyesVariant: 'happy', mouthVariant: 'smile' },
    },
    { style: 'waves', seed: 'Juno' },
    { style: 'planets', seed: 'Elif', options: { animationVariant: 'slow' } },
  ],
  [
    { style: 'blobs', seed: 'Lina', options: { animationVariant: 'slow' } },
    { style: 'squircles', seed: 'Jonas' },
    { style: 'voxel-bot', seed: 'Rex' },
    { style: 'disco', seed: 'Ivy' },
    {
      style: 'sprouts',
      seed: 'Emma',
      options: {
        animationVariant: 'slow',
        eyesVariant: 'happy',
        mouthVariant: 'smile',
      },
    },
    { style: 'shapes', seed: 'Finn' },
    {
      style: 'pixelbot',
      seed: 'Noah',
      options: { eyesVariant: 'happy', mouthVariant: 'bigSmile' },
    },
    { style: 'loops', seed: 'Omar' },
  ],
];

// Each avatar is a sticker, as on the website: a white card with the avatar
// inset by 6%, turned a little, on the beige of the site.
const STICKER = 116;
const GAP = 22;
const TILE = Math.round(STICKER * 0.88);
const INSET = (STICKER - TILE) / 2;
const STICKER_RADIUS = STICKER * 0.28;
const TILE_RADIUS = TILE * 0.24;
const COLUMNS = 8;
const ROWS = 3;

// Per-column vertical offsets and per-sticker turns, so the grid looks laid
// by hand rather than set.
const OFFSETS = [0, 14, -8, 10, -4, 12, -10, 6];
const TURNS = [-5, 3, -2, 6, -4, 2, -6, 4];

const WIDTH = 1200;
const HEIGHT = 494;
const MARGIN_X = (WIDTH - COLUMNS * STICKER - (COLUMNS - 1) * GAP) / 2;
const MARGIN_Y = (HEIGHT - ROWS * STICKER - (ROWS - 1) * GAP) / 2;

/** The ink and the beige of the site (`--db-c-ink`, `--db-c-soft`). */
const INK = '#15213b';
const BEIGE = '#f7f1e6';

/** The checkerboard behind the avatars (`--db-checker-*`), 16 fields across. */
const CHECKER_LIGHT = '#f9f5ee';
const CHECKER_DARK = '#f1ebe1';
const CHECKER_FIELDS = 16;

function checkerboard(size) {
  const field = +(size / CHECKER_FIELDS).toFixed(3);
  let path = '';

  for (let row = 0; row < CHECKER_FIELDS; row++) {
    for (let column = (row + 1) % 2; column < CHECKER_FIELDS; column += 2) {
      path += `M${+(column * field).toFixed(3)} ${+(row * field).toFixed(3)}h${field}v${field}h-${field}z`;
    }
  }

  return `<g id="db-checker"><rect width="${size}" height="${size}" fill="${CHECKER_LIGHT}"/><path d="${path}" fill="${CHECKER_DARK}"/></g>`;
}

function loadStyle(name) {
  const definition = JSON.parse(
    readFileSync(join(stylesDir, `${name}.min.json`), 'utf8'),
  );

  if (definition.meta?.license?.name !== 'CC0 1.0') {
    throw new Error(
      `Style "${name}" is licensed ${definition.meta?.license?.name}; the hero only embeds CC0 1.0 styles.`,
    );
  }

  return definition;
}

function tileMarkup(tile, x, y, turn) {
  const definition = new Style(loadStyle(tile.style));
  const avatar = new Avatar(definition, {
    seed: tile.seed,
    size: TILE,
    ...tile.options,
  });
  const center = STICKER / 2;

  return `  <g transform="translate(${x + center}, ${y + center}) rotate(${turn}) translate(${-center}, ${-center})">
    <rect width="${STICKER}" height="${STICKER}" rx="${STICKER_RADIUS}" fill="#ffffff" filter="url(#shadow)"/>
    <g transform="translate(${INSET}, ${INSET})" clip-path="url(#tile)"><use href="#db-checker"/>${avatar.toString()}</g>
  </g>`;
}

const tiles = [];

TILES.forEach((row, rowIndex) => {
  row.forEach((tile, colIndex) => {
    const x = MARGIN_X + colIndex * (STICKER + GAP);
    const y = MARGIN_Y + rowIndex * (STICKER + GAP) + OFFSETS[colIndex];
    const turn = TURNS[(colIndex + rowIndex * 3) % TURNS.length];

    tiles.push(tileMarkup(tile, x, y, turn));
  });
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="hero-title">
  <title id="hero-title">A grid of DiceBear avatars in twenty-four different styles</title>
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="8" stdDeviation="7" flood-color="${INK}" flood-opacity="0.26"/>
    </filter>
    <clipPath id="tile"><rect width="${TILE}" height="${TILE}" rx="${TILE_RADIUS}"/></clipPath>
    ${checkerboard(TILE)}
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="48" fill="${BEIGE}"/>
${tiles.join('\n')}
</svg>
`;

writeFileSync(outFile, svg);
console.log(`Wrote ${outFile} (${(svg.length / 1024).toFixed(0)} kB)`);
