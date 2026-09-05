import type { Style, StyleOptions } from '@dicebear/core/lite';
import PQueue from 'p-queue';
import os from 'node:os';

import { comparePixels, renderPng, writeDifference } from './renderPng.js';
import type { CompareOptions, PixelDifference, SweepResult } from './types.js';

/** One render to run on both sides and compare. */
export interface SweepCase {
  name: string;
  before: Style;
  after: Style;
  options: StyleOptions;
}

/**
 * Renders every case on both sides in parallel, compares the pixels, and
 * collects the cases whose difference exceeds the tolerance. With an output
 * directory the images of those cases are written next to each other.
 */
export async function sweep(
  styleName: string,
  cases: SweepCase[],
  compare: CompareOptions,
): Promise<SweepResult> {
  const queue = new PQueue({ concurrency: os.cpus().length || 1 });
  const different: PixelDifference[] = [];
  let failure: Error | undefined;

  for (const item of cases) {
    queue.add(async () => {
      if (failure) {
        return;
      }

      try {
        const [before, after] = await Promise.all([
          renderPng(item.before, item.options, compare),
          renderPng(item.after, item.options, compare),
        ]);
        const { share, diff } = comparePixels(before, after, compare.threshold);

        if (share > compare.tolerance) {
          different.push({ name: item.name, share });

          if (compare.output) {
            await writeDifference(
              compare.output,
              styleName,
              item.name,
              before,
              after,
              diff,
            );
          }
        }
      } catch (error) {
        failure ??= error instanceof Error ? error : new Error(String(error));
      }
    });
  }

  await queue.onIdle();

  if (failure) {
    throw failure;
  }

  different.sort((a, b) => a.name.localeCompare(b.name));

  return { total: cases.length, different };
}
