// Generates apps/docs/pages/public/readme-hero.svg, the avatar grid at the
// top of the repository README (served as https://www.dicebear.com/readme-hero.svg).
// Rerun after visual style updates: `node scripts/generate-readme-hero.mjs`.
//
// The layout follows the release-notes graphic: staggered 116px tiles with
// rounded corners, a soft shadow, and a translucent white border on a blue
// gradient with a dot pattern. A few tiles use animated style variants; the
// animations are plain CSS inside the embedded avatars and respect
// prefers-reduced-motion, so the hero stays still for readers who ask for
// that.

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

const TILE = 116;
const GAP = 18;
const RADIUS = 30;
const MARGIN_X = 73;
const MARGIN_Y = 40;
// Per-column vertical offsets, mirroring the staggered look of the reference.
const STAGGER = [0, 16, 6, 30, 12, 26, 2, 20];

const WIDTH = 1200;
const HEIGHT = MARGIN_Y * 2 + 3 * TILE + 2 * GAP + Math.max(...STAGGER);

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

function tileMarkup(tile, x, y) {
  const definition = new Style(loadStyle(tile.style));
  const avatar = new Avatar(definition, {
    seed: tile.seed,
    size: TILE,
    ...tile.options,
  });

  return `  <g transform="translate(${x}, ${y})" filter="url(#shadow)">
    <g clip-path="url(#tile)"><rect width="${TILE}" height="${TILE}" fill="#e0f2fe"/>${avatar.toString()}</g>
    <rect x="0.5" y="0.5" width="${TILE - 1}" height="${TILE - 1}" rx="${RADIUS}" fill="none" stroke="#ffffff" stroke-opacity="0.5" stroke-width="1.5"/>
  </g>`;
}

const tiles = [];

TILES.forEach((row, rowIndex) => {
  row.forEach((tile, colIndex) => {
    const x = MARGIN_X + colIndex * (TILE + GAP);
    const y = MARGIN_Y + rowIndex * (TILE + GAP) + STAGGER[colIndex];

    tiles.push(tileMarkup(tile, x, y));
  });
});

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-labelledby="hero-title">
  <title id="hero-title">A grid of DiceBear avatars in twenty-four different styles</title>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#0284c7"/>
      <stop offset="1" stop-color="#075985"/>
    </linearGradient>
    <pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse">
      <circle cx="16" cy="16" r="1.6" fill="#ffffff" fill-opacity="0.07"/>
    </pattern>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="#082f49" flood-opacity="0.25"/>
    </filter>
    <clipPath id="tile"><rect width="${TILE}" height="${TILE}" rx="${RADIUS}"/></clipPath>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="24" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" rx="24" fill="url(#dots)"/>
${tiles.join('\n')}
</svg>
`;

writeFileSync(outFile, svg);
console.log(`Wrote ${outFile} (${(svg.length / 1024).toFixed(0)} kB)`);
