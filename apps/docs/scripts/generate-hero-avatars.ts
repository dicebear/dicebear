/**
 * Generates the homepage hero-swarm avatars as static SVG files in
 * pages/public/avatars/hero/ so they are served same-origin instead of
 * being fetched from api.dicebear.com at runtime (the hero is the LCP
 * area — an external origin adds DNS/TLS round trips on mobile).
 *
 * The output is committed. Re-run after upgrading @dicebear/styles or
 * when changing the tiles in AppHeroSwarm.vue:
 *
 *   node scripts/generate-hero-avatars.ts
 */
import { Avatar, Style } from '@dicebear/core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

// Keep in sync with the tiles in theme/components/app/AppHeroSwarm.vue.
const tiles = [
  { styleName: 'lorelei', seed: 'Felix', background: 'ffe4e6', size: 256 },
  { styleName: 'stack', seed: 'Aneka', background: 'fef3c7', size: 160 },
  { styleName: 'slice', seed: 'Nova', background: 'cffafe', size: 128 },
  { styleName: 'open-peeps', seed: 'Aneka', background: 'dcfce7', size: 128 },
  { styleName: 'pixel-art', seed: 'Juno', background: 'dbeafe', size: 160 },
  { styleName: 'waves', seed: 'Mika', background: 'c2410c', size: 128 },
];

const outDir = fileURLToPath(
  new URL('../pages/public/avatars/hero/', import.meta.url),
);

await mkdir(outDir, { recursive: true });

for (const tile of tiles) {
  const definition = JSON.parse(
    await readFile(
      new URL(import.meta.resolve(`@dicebear/styles/${tile.styleName}.json`)),
      'utf8',
    ),
  );

  const avatar = new Avatar(new Style(definition), {
    seed: tile.seed,
    size: tile.size,
    backgroundColor: [tile.background],
  });

  const fileName = `${tile.styleName}-${tile.seed.toLowerCase()}.svg`;

  await writeFile(path.join(outDir, fileName), avatar.toString());
  console.log(`✔ ${fileName}`);
}
