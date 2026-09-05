import { Avatar, type Style, type StyleOptions } from '@dicebear/core/lite';
import { toPng } from '@dicebear/converter';
import pixelmatch from 'pixelmatch';
import { PNG } from 'pngjs';
import fs from 'fs-extra';
import * as path from 'node:path';

import type { CompareOptions } from './types.js';

/**
 * Renders one avatar to a decoded PNG through the converter, so the render
 * matches what `create --format png` would write. The system font scan is
 * skipped unless asked for: it runs per render and would dominate a sweep
 * of thousands.
 */
export async function renderPng(
  style: Style,
  options: StyleOptions,
  compare: CompareOptions,
): Promise<PNG> {
  const svg = new Avatar(style, options).toString();
  const buffer = await toPng(svg, {
    size: compare.size,
    fonts: compare.systemFonts ? undefined : [],
  }).toArrayBuffer();

  return PNG.sync.read(Buffer.from(buffer));
}

export interface PixelComparison {
  /** Share of differing pixels in percent. */
  share: number;
  diff: PNG;
}

/**
 * Compares two renders pixel by pixel. Throws when the two have different
 * dimensions, which only happens when the canvas aspect changed.
 */
export function comparePixels(
  before: PNG,
  after: PNG,
  threshold: number,
): PixelComparison {
  if (before.width !== after.width || before.height !== after.height) {
    throw new Error(
      `dimensions differ (${before.width}x${before.height} vs ` +
        `${after.width}x${after.height})`,
    );
  }

  const diff = new PNG({ width: before.width, height: before.height });
  const count = pixelmatch(
    before.data,
    after.data,
    diff.data,
    before.width,
    before.height,
    { threshold, includeAA: false },
  );

  return { share: (count / (before.width * before.height)) * 100, diff };
}

/**
 * Writes the before, after and diff images of one reported difference into
 * `<output>/<style>/`.
 */
export async function writeDifference(
  output: string,
  styleName: string,
  name: string,
  before: PNG,
  after: PNG,
  diff: PNG,
): Promise<void> {
  const dir = path.join(output, styleName);
  const base = name.replace(/[^a-zA-Z0-9_-]+/g, '-');

  await fs.ensureDir(dir);
  await Promise.all([
    fs.writeFile(path.join(dir, `${base}.before.png`), PNG.sync.write(before)),
    fs.writeFile(path.join(dir, `${base}.after.png`), PNG.sync.write(after)),
    fs.writeFile(path.join(dir, `${base}.diff.png`), PNG.sync.write(diff)),
  ]);
}
