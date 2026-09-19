/**
 * Finds a seed under which a component of a style is actually visible.
 *
 * The option previews render whole avatars, one per variant, and force the
 * component in. Forcing is not enough: Lorelei's earrings sit under most of
 * its hairstyles, so a preview of `earringsVariant` on the wrong seed shows
 * the same face eight times. The search renders the avatar with and without
 * the component, rasterizes both, and takes the first candidate seed where
 * enough pixels differ. The result is cached per style and component.
 *
 * The other optional parts of the style (everything with a probability below
 * 100) stay switched off in these previews, so a flower in the hair does not
 * compete with the earring the tile is about.
 *
 * Browser only: the comparison draws on a canvas. Without one, the first
 * candidate is returned unchecked.
 */
import { Avatar, type Style } from '@dicebear/core';
import { exampleSeeds } from '@theme/config/styleCategories';
import {
  getPreviewRowSeeds,
  getStyleCardSeeds,
} from '@theme/config/previewRowSeeds';
import { loadAvatarStyle } from './style';

const SAMPLE = 64;
/** Fraction of the canvas that has to change for the component to count. */
const MIN_DIFFERENCE = 0.012;

export interface PreviewBase {
  seed: string;
  /** The seed plus the switches that keep the other optional parts away. */
  options: Record<string, unknown>;
}

const cache = new Map<string, Promise<PreviewBase>>();

function candidateSeeds(styleName: string): string[] {
  const seeds: string[] = [];
  for (const source of [getPreviewRowSeeds, getStyleCardSeeds]) {
    try {
      seeds.push(...source(styleName));
    } catch {
      // A style outside the catalog, such as an uploaded one, has no rows.
    }
  }
  seeds.push(...exampleSeeds, 'Sophie', 'Leo', 'Emma', 'Noah', 'Aria', 'Oscar');
  return Array.from(new Set(seeds));
}

function rasterize(dataUri: string): Promise<Uint8ClampedArray | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = SAMPLE;
      canvas.height = SAMPLE;
      const context = canvas.getContext('2d', { willReadFrequently: true });
      if (!context) {
        resolve(null);
        return;
      }
      context.drawImage(image, 0, 0, SAMPLE, SAMPLE);
      resolve(context.getImageData(0, 0, SAMPLE, SAMPLE).data);
    };
    image.onerror = () => resolve(null);
    image.src = dataUri;
  });
}

async function difference(a: string, b: string): Promise<number> {
  const [pa, pb] = await Promise.all([rasterize(a), rasterize(b)]);
  if (!pa || !pb) {
    return 1;
  }
  let changed = 0;
  for (let i = 0; i < pa.length; i += 4) {
    if (
      Math.abs(pa[i] - pb[i]) > 16 ||
      Math.abs(pa[i + 1] - pb[i + 1]) > 16 ||
      Math.abs(pa[i + 2] - pb[i + 2]) > 16 ||
      Math.abs(pa[i + 3] - pb[i + 3]) > 16
    ) {
      changed++;
    }
  }
  return changed / (SAMPLE * SAMPLE);
}

function render(
  style: Style,
  seed: string,
  options: Record<string, unknown>,
): string {
  return new Avatar(style, { seed, ...options }).toDataUri();
}

function quietOptions(
  style: Style,
  component: string,
): Record<string, unknown> {
  const options: Record<string, unknown> = {};
  for (const [name, other] of style.components()) {
    if (name !== component && other.probability() < 100) {
      options[`${name}Probability`] = 0;
    }
  }
  return options;
}

async function search(
  styleName: string,
  component: string,
): Promise<PreviewBase> {
  const seeds = candidateSeeds(styleName);
  const style = await loadAvatarStyle(styleName);
  const quiet = quietOptions(style, component);
  const base = (seed: string): PreviewBase => ({
    seed,
    options: { seed, ...quiet },
  });
  if (typeof document === 'undefined') {
    return base(seeds[0]);
  }
  const variant = style
    .components()
    .get(component)
    ?.variants()
    .keys()
    .next().value;
  if (!variant) {
    return base(seeds[0]);
  }
  let best = { seed: seeds[0], score: -1 };
  for (const seed of seeds) {
    const without = render(style, seed, {
      ...quiet,
      [`${component}Probability`]: 0,
    });
    const withIt = render(style, seed, {
      ...quiet,
      [`${component}Probability`]: 100,
      [`${component}Variant`]: [variant],
    });
    const score = await difference(without, withIt);
    if (score >= MIN_DIFFERENCE) {
      return base(seed);
    }
    if (score > best.score) {
      best = { seed, score };
    }
  }
  return base(best.seed);
}

/**
 * The seed and base options to preview `component` of `styleName` with.
 * Resolves once per pair; every variant preview of that component shares
 * them, so the only thing changing between the tiles is the variant.
 */
export function findPreviewBase(
  styleName: string,
  component: string,
): Promise<PreviewBase> {
  const key = `${styleName}:${component}`;
  let pending = cache.get(key);
  if (!pending) {
    pending = search(styleName, component).catch(() => {
      const seed = candidateSeeds(styleName)[0];
      return { seed, options: { seed } };
    });
    cache.set(key, pending);
  }
  return pending;
}
