/**
 * Renders a contact sheet of a style's presets: one labelled row per preset,
 * the same seeds across all of them, so a set can be judged side by side
 * instead of one avatar at a time.
 *
 * Presets are picked by eye, and the failure modes are visual ones a validator
 * cannot see: a dark preset that swallows the linework, two colors that clash,
 * a crop that cuts an ear. This is the tool for looking.
 *
 * Usage: node scripts/render-presets.ts <style> [out.png] [--seeds=6]
 */
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as path from 'node:path';
import { Avatar, Style } from '@dicebear/core';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';
import { getPreviewRowSeeds } from '../.vitepress/theme/config/previewRowSeeds.ts';

// Flags are split off before the positional arguments, so `--seeds=` can sit
// anywhere. Read positionally it would be taken for the output path whenever
// that path is left out, and the sheet would land in a file called `--seeds=8`.
const args = process.argv.slice(2);
const flags = args.filter((arg) => arg.startsWith('--'));
const [styleName, outArg] = args.filter((arg) => !arg.startsWith('--'));

if (!styleName) {
  console.error(
    'Usage: node scripts/render-presets.ts <style> [out.png] [--seeds=6]',
  );
  process.exit(1);
}

const seedCount = Number(
  flags.find((a) => a.startsWith('--seeds='))?.slice('--seeds='.length) ?? 6,
);

if (!Number.isInteger(seedCount) || seedCount < 1) {
  console.error(`--seeds must be a positive integer, got "${seedCount}"`);
  process.exit(1);
}

const out = outArg ?? `/tmp/presets-${styleName}.png`;

const presetsFile = fileURLToPath(
  new URL(`../.vitepress/theme/presets/${styleName}.json`, import.meta.url),
);

if (!existsSync(presetsFile)) {
  console.error(`No presets for "${styleName}" at ${presetsFile}`);
  process.exit(1);
}

const { presets } = JSON.parse(readFileSync(presetsFile, 'utf8'));
const definition = JSON.parse(
  readFileSync(
    fileURLToPath(import.meta.resolve(`@dicebear/styles/${styleName}.json`)),
    'utf8',
  ),
);

const style = new Style(definition);
const seeds = getPreviewRowSeeds(styleName).slice(0, seedCount);

const CELL = 150;
const LABEL = 30;
const WIDTH = CELL * seeds.length;

function cell(options: Record<string, unknown>) {
  const svg = new Avatar(style, { size: CELL, ...options }).toString();

  return new Resvg(svg, { fitTo: { mode: 'width', value: CELL } })
    .render()
    .asPng();
}

function label(text: string) {
  // Escaped because preset names are free text and a stray & or < would make
  // the label SVG unparseable.
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
  };
  const safe = text.replace(/[&<>]/g, (c) => entities[c]);

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${LABEL}">
       <rect width="100%" height="100%" fill="#ffffff"/>
       <text x="8" y="20" font-family="Helvetica" font-size="15" fill="#111">${safe}</text>
     </svg>`,
  );
}

const rows = [];

for (const [index, preset] of presets.entries()) {
  const cells = seeds.map((seed) => cell({ seed, ...preset.options }));

  rows.push(
    await sharp({
      create: {
        width: WIDTH,
        height: CELL + LABEL,
        channels: 3,
        background: '#ffffff',
      },
    })
      .composite([
        {
          input: label(`${index + 1}. ${preset.name} — ${preset.id}`),
          top: 0,
          left: 0,
        },
        ...cells.map((input, i) => ({ input, top: LABEL, left: i * CELL })),
      ])
      .png()
      .toBuffer(),
  );
}

await sharp({
  create: {
    width: WIDTH,
    height: rows.length * (CELL + LABEL),
    channels: 3,
    background: '#ffffff',
  },
})
  .composite(
    rows.map((input, i) => ({ input, top: i * (CELL + LABEL), left: 0 })),
  )
  .png()
  .toFile(path.resolve(out));

console.log(
  `${styleName}: ${presets.length} presets × ${seeds.length} seeds → ${out}`,
);
