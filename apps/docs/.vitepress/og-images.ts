/**
 * Generates the Open Graph cards that social platforms show when a page is
 * shared: one per avatar style plus a site-wide default, written into the
 * build output as `og/<name>.png`. `transformHead` in config.ts resolves a
 * page to its card through {@link ogImagePathFor}, so the page-to-card
 * mapping lives here instead of being spelled out on both sides.
 *
 * Generation runs from the `buildEnd` hook, so `vitepress dev` renders no
 * cards. It still pays for the native modules this file imports, about 27ms
 * for resvg and sharp together. The cards themselves are only observable
 * through a crawler hitting the deployed site.
 *
 * Two constraints shape the implementation:
 *
 *  1. @dicebear/converter cannot be reused here. Its `ensureSize()` writes
 *     `width` and `height` to the same value because avatars are square; an
 *     OG card is 1200x630. We therefore drive @resvg/resvg-js directly.
 *
 *  2. resvg ignores woff2 *silently*. Passing one as a `fontFiles` entry
 *     renders text as nothing at all instead of raising. Since the theme
 *     only ships woff2, the static Inter cuts are decompressed to TTF (woff2
 *     is a compressed sfnt) into the VitePress cache directory on first run.
 *     The variable cut is unusable here: fontdb loads it at its default
 *     instance, so every weight would render identically.
 */
import { Avatar, Style } from '@dicebear/core';
import {
  renderAsync,
  Resvg,
  type RenderedImage,
  type ResvgRenderOptions,
} from '@resvg/resvg-js';
import { capitalCase } from 'change-case';
import sharp from 'sharp';
import { createRequire } from 'node:module';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import avatarStyles, { definitionsDir } from './config/avatarStyles.ts';
import { previewSeeds } from './theme/config/styleCategories.ts';
import { escapeHtml } from './theme/utils/escape.ts';
import { formatLicenseName } from './theme/utils/format.ts';
import { attributionKind, isPublicDomain } from './theme/utils/license.ts';

const require = createRequire(import.meta.url);

const WIDTH = 1200;
const HEIGHT = 630;
const MARGIN = 64;

/** Right edge of the content column, mirroring MARGIN on the left. */
const CONTENT_RIGHT = WIDTH - MARGIN;

/**
 * Exported so config.ts can state og:image:width/height without repeating the
 * numbers. Social platforms reserve the box from those tags before the file
 * loads, so a card resized here and not there letterboxes or crops with no
 * local symptom.
 */
export const OG_IMAGE_SIZE = { width: WIDTH, height: HEIGHT };

const TILE_SIZE = 192;
const TILE_TOP = 72;
const TILE_RADIUS = 28;
const TILE_COUNT = 5;

/**
 * The row spans margin to margin, the same edges as the footer rule, so the
 * gap follows from the tile size and count instead of being tuned by hand:
 * 1200 - 2*64 - 5*192 = 112, over four gaps.
 */
const TILE_GAP =
  (WIDTH - 2 * MARGIN - TILE_COUNT * TILE_SIZE) / (TILE_COUNT - 1);

// Derived from the tile row and the margin so the text block follows when the
// geometry above it changes. Nothing renders a card twice to compare, so a
// baseline left behind by a layout tweak would only surface as a broken card
// already cached by a social platform.
const TITLE_BASELINE = TILE_TOP + TILE_SIZE + 104;
const SUBTITLE_BASELINE = TITLE_BASELINE + 50;
const SOURCE_BASELINE = HEIGHT - MARGIN;
const CREDIT_BASELINE = SOURCE_BASELINE - 30;
const RULE_Y = CREDIT_BASELINE - 40;

/**
 * Candidate seeds, walked in order. Fixed and ordered so a card only changes
 * when the style definition does. Opens with `previewSeeds`, which the styles
 * index grid uses. The style *detail* page a card links to has its own set in
 * StylePreview.vue, so the two do not show the same avatars.
 */
const SEED_POOL = [
  ...previewSeeds,
  'Sage',
  'Jasper',
  'Nova',
  'Kai',
  'Iris',
  'Odin',
  'Wren',
  'Juno',
  'Maya',
  'Otis',
  'Cleo',
  'Rex',
  'Vera',
  'Pixel',
];

/**
 * What shows through a transparent avatar. No avatar is ever given a
 * `backgroundColor`: 20 of the 37 styles declare their own `colors.background`
 * palette (every `-neutral` variant, plus glass, disco, icons, initials and the
 * geometric ones), and overriding it would replace a color the artist chose. The other 17 render transparent and sit on this.
 *
 * sky-100 rather than white, because white artwork disappears against a white
 * tile: `lorelei` loses its face and shows only hair and outlines, and
 * `identicon` loses its negative space. A tint turns those back into shapes
 * while staying light enough that the avatar, not the tile, carries the card.
 */
const TILE_BASE = '#e0f2fe';

/**
 * The white lockup, sitting bottom-right beside the credit block.
 * `logo-dark.svg` is the variant *for* dark backgrounds; it is pure paths
 * with no ids and no text, so it nests into the card without colliding with
 * the avatars or needing a font.
 *
 * The credit runs along the same row, so the mark's width is what the credit
 * has to wrap against, and not something tuned by eye: at this scale 3 of
 * the 37 credits take a second line. The longest source URL measures 539px
 * and fits on one line at any scale worth using.
 */
const LOGO_FILE = 'logo-dark.svg';
const LOGO_WIDTH = 183;
const LOGO_HEIGHT = 32;
const LOGO_SCALE = 1.5;

/** Clear space between the footer text and the mark. */
const LOGO_GAP = 40;

/** Bottom-aligned with the last footer line, so wrapping never moves it. */
const LOGO_TOP = SOURCE_BASELINE - LOGO_HEIGHT * LOGO_SCALE;

/** How wide a footer line may run before it has to wrap. */
const FOOTER_TEXT_MAX =
  CONTENT_RIGHT - LOGO_WIDTH * LOGO_SCALE - LOGO_GAP - MARGIN;

const CREDIT_SIZE = 22;
const SOURCE_SIZE = 18;
const CREDIT_LINE_HEIGHT = 28;

/** Cards rasterized at once. Each holds a 3 MB frame until sharp is done. */
const RASTER_CONCURRENCY = 8;

const OG_DIR = 'og';
const DEFAULT_CARD = 'default';

/**
 * The default card mixes styles, so a single credit line cannot name every
 * artist behind it, so it carries none. That only holds while every style on
 * it waives attribution. Restricted to CC0 and asserted
 * at build time in {@link generateOgImages}. Picked for contrast: line art,
 * character, pixel, geometric, people.
 */
const DEFAULT_TILES = [
  { styleName: 'lorelei', seed: 'Felix' },
  { styleName: 'thumbs', seed: 'Aneka' },
  { styleName: 'pixel-art', seed: 'Milo' },
  { styleName: 'shapes', seed: 'Luna' },
  { styleName: 'open-peeps', seed: 'Sage' },
];

/**
 * Brand blue (theme/styles/vars.scss `--vp-c-indigo-2`) descending into
 * sky-800, tilted slightly off vertical.
 *
 * Contrast is measured by projecting a text position onto the gradient
 * vector and taking the worst case for light text: the left edge of the run,
 * which sits at the lowest gradient parameter and therefore on the lightest
 * background the line touches, at the top of its glyph box. Each ratio is
 * recorded on the constant that paints it, below.
 *
 * sky-800 is as light as the end color can go. The next step up the ramp,
 * sky-700 (#0369a1), drops the 18px source line to 3.97:1, below the 4.5:1
 * that text under 24px needs. Going lighter means enlarging that line.
 */
const GRADIENT_FROM = '#0284c7';
const GRADIENT_TO = '#075985';

/** Title, at 5.32:1 on the gradient. */
const COLOR_TITLE = '#ffffff';

/** sky-100. Subtitle 4.98:1, credit line 5.60:1. */
const COLOR_BODY = '#e0f2fe';

/**
 * sky-200 for the source URL, one step back from the credit above it, at
 * 4.98:1. The step is a brightness change rather than a wash: at 18px
 * anything softer falls under AA, with sky-300 landing at 3.97:1.
 */
const COLOR_MUTED = '#bae6fd';

/** Tile rings and the footer rule, both drawn at low opacity. */
const COLOR_LINE = '#ffffff';

async function loadStyle(styleName: string): Promise<Style> {
  return new Style(
    JSON.parse(
      await fs.readFile(
        path.join(definitionsDir, `${styleName}.min.json`),
        'utf-8',
      ),
    ),
  );
}

/**
 * Every card name handed to a page, so generateOgImages can report cards it
 * wrote that no page ever asked for. `transformHead` runs for every page
 * during the build and `buildEnd` runs after, so the record is complete by
 * the time it is read.
 */
const requestedCards = new Set<string>();

/**
 * Site-root-relative path of a page's card, e.g. `/og/lorelei.png`. Style
 * pages get their own card; everything else falls back to the generic one.
 */
export function ogImagePathFor(relativePath: string): string {
  const match = relativePath.match(/^styles\/([^/]+)\/index\.md$/);
  const name = match && match[1] in avatarStyles ? match[1] : DEFAULT_CARD;

  requestedCards.add(name);

  return `/${OG_DIR}/${name}.png`;
}

/**
 * Builds the credit line for a style. Shown on every style card, including
 * the CC0 ones: CC0 requires no attribution, but naming the artist anyway
 * credits their work and keeps the layout uniform.
 *
 * The remix/port/own-work distinction comes from the shared
 * {@link attributionKind} and is not decided here. "Remix of" is not
 * decoration: CC BY 4.0 §3(a)(1)(B) requires indicating that the material was
 * modified. Note that UiLicenseText.vue, StyleDescription.vue and
 * AppSeedDemo.vue still decide it inline on the raw license name, so a card
 * and its style page can drift apart until those adopt the helper too.
 *
 * `meta.title` is the *source work's* name, not the style's: `big-ears`
 * credits "Face Generator", which is the name CC BY asks us to carry.
 *
 * The card pairs this with `meta.source` on its own line, covering
 * §3(a)(1)(A)(v), a URI to the licensed material. Between the two lines a
 * card carries creator, source, modification notice and license without
 * relying on the page it was shared from.
 */
function creditFor(styleName: string): string | undefined {
  const { meta } = avatarStyles[styleName];
  const license = formatLicenseName(meta.license?.name);

  if (!license) {
    return undefined;
  }

  const sourceName = meta.title ?? capitalCase(styleName);
  const creator = meta.creator;

  if (!creator) {
    return `${sourceName} · ${license}`;
  }

  const kind = attributionKind(meta);

  if (kind === 'own-work') {
    return `${sourceName} by ${creator} · ${license}`;
  }

  const prefix = kind === 'port' ? 'Based on' : 'Remix of';

  return `${prefix} ${sourceName} by ${creator} · ${license}`;
}

/**
 * Renders one tile's avatar at the tile's own pixel size. IDs inside a
 * DiceBear SVG are suffixed with a per-avatar hash, so five of them coexist
 * in one document without their masks and clip paths colliding.
 */
async function renderTile(styleName: string, seed: string): Promise<string> {
  const style = await loadStyle(styleName);

  return new Avatar(style, { seed, size: TILE_SIZE }).toString();
}

/**
 * Reduces an avatar to what a viewer actually distinguishes on a card:
 * component variants, geometry and text, but not color.
 *
 * Color has to go, or `icons` slips through: two seeds there can select the
 * same pictogram and differ only in hue, which looks like the same tile
 * printed twice. Text has to stay, or `initials` collapses, because every
 * seed picks the same `letters-double` variant and differs only in the
 * letters drawn.
 */
function fingerprint(svg: string): string {
  return svg
    .replace(/-[0-9a-f]{8}\b/g, '') // per-avatar id hash
    .replace(/(?:fill|stroke)="[^"]*"/g, '')
    .replace(/#[0-9a-fA-F]{3,8}\b/g, '');
}

/**
 * Renders a style's tiles, keeping only visibly distinct artwork. A style
 * with few variants (`icons` is the clearest case) otherwise maps neighboring
 * seeds onto the same drawing, and two identical tiles side by
 * side read as a rendering bug, not a showcase.
 */
async function pickTiles(styleName: string): Promise<string[]> {
  const style = await loadStyle(styleName);
  const distinct = new Map<string, string>();

  for (const seed of SEED_POOL) {
    if (distinct.size === TILE_COUNT) {
      break;
    }

    const svg = new Avatar(style, { seed, size: TILE_SIZE }).toString();
    const key = fingerprint(svg);

    if (!distinct.has(key)) {
      distinct.set(key, svg);
    }
  }

  const tiles = [...distinct.values()];

  // A style offering fewer distinct avatars than there are tiles has nothing
  // further to show, so cycle what it has instead of leaving a gap. No style
  // in the current catalog reaches this.
  while (tiles.length < TILE_COUNT) {
    tiles.push(tiles[tiles.length % distinct.size]);
  }

  return tiles;
}

/**
 * Measures a text run the way resvg will lay it out, via `getBBox()` rather
 * than by rasterizing. It lands under a pixel off a pixel-scan of the same
 * string, at about 0.75ms a call, nearly all of it spent re-parsing the two
 * Inter cuts rather than measuring. Counting characters would be guesswork: Inter is
 * proportional, and the credits mix names, punctuation and license labels.
 */
function createTextMeasurer(font: ResvgRenderOptions['font']) {
  // Hits on the `-neutral` twins: `meta.title` names the source work, so a
  // style and its neutral variant credit the same one, word for word.
  const cache = new Map<string, number>();

  return (text: string, size: number): number => {
    const key = `${size}:${text}`;
    const cached = cache.get(key);

    if (cached !== undefined) {
      return cached;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 200"><text x="0" y="100" font-family="Inter" font-size="${size}" fill="#000">${escapeHtml(
      text,
    )}</text></svg>`;
    // `undefined` means resvg produced nothing renderable: an unusable font,
    // or glyphs it cannot lay out. Coalescing that to 0 would silently disable
    // wrapping and ship cards with missing or overlapping text, so fail the
    // build instead.
    const box = new Resvg(svg, { font }).getBBox();

    if (!box) {
      throw new Error(
        `[og-images] resvg could not lay out ${JSON.stringify(text)} at ${size}px. ` +
          `The cached Inter cuts in .vitepress/cache/og-fonts are the usual cause; ` +
          `delete that directory and rebuild.`,
      );
    }

    const width = box.width;

    cache.set(key, width);

    return width;
  };
}

type TextMeasurer = ReturnType<typeof createTextMeasurer>;

/** Greedy word wrap. Never breaks inside a word, so URLs stay intact. */
function wrapText(
  text: string,
  size: number,
  maxWidth: number,
  measure: TextMeasurer,
): string[] {
  if (measure(text, size) <= maxWidth) {
    return [text];
  }

  const lines: string[] = [];
  let current = '';

  for (const word of text.split(' ')) {
    const candidate = current ? `${current} ${word}` : word;

    if (current && measure(candidate, size) > maxWidth) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }

  if (current) {
    lines.push(current);
  }

  return lines;
}

function textLine(
  y: number,
  size: number,
  weight: 400 | 700,
  fill: string,
  value: string,
): string {
  return `<text x="${MARGIN}" y="${y}" font-family="Inter" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeHtml(
    value,
  )}</text>`;
}

function buildCard({
  tiles,
  logo,
  title,
  subtitle,
  credit,
  sourceUrl,
  measure,
  normalizeMaskType,
}: {
  tiles: string[];
  logo: string;
  title: string;
  subtitle: string;
  credit?: string;
  sourceUrl?: string;
  measure: TextMeasurer;
  normalizeMaskType: (svg: string) => string;
}): string {
  // One clip path at the origin, reused under each tile's translate: a
  // clip-path resolves in the referencing element's post-transform user
  // space. (Against per-tile absolute clip paths this shifts 2 subpixels of
  // edge antialiasing out of 3,024,000, by at most 4/255.)
  const tileMarkup = tiles
    .map((rawSvg, index) => {
      const x = MARGIN + index * (TILE_SIZE + TILE_GAP);

      // Applied here, not where the avatars are rendered, because both
      // pickTiles() and renderTile() feed this. `toPng` would do it for us,
      // but the cards drive resvg directly. Without it, styles whose masks rely
      // on `mask-type:alpha` lose detail: a bearded Lorelei renders with no
      // mouth at all.
      const svg = normalizeMaskType(rawSvg);

      // The white base shows through for the transparent styles; the ones
      // carrying their own background paint straight over it. The ring goes
      // last, over the avatar: several styles pick blues close to the card
      // gradient (thumbs and shapes most clearly), and without it those tiles
      // lose their edge against the background.
      return `<g transform="translate(${x}, ${TILE_TOP})">
      <g clip-path="url(#tile)"><rect width="${TILE_SIZE}" height="${TILE_SIZE}" fill="${TILE_BASE}"/>${svg}</g>
      <rect width="${TILE_SIZE}" height="${TILE_SIZE}" rx="${TILE_RADIUS}" fill="none" stroke="${COLOR_LINE}" stroke-opacity="0.22" stroke-width="2"/>
    </g>`;
    })
    .join('');

  // The credit block is bottom-aligned: the source URL keeps the last line
  // and any wrapped credit lines stack upward, so the rule rises instead of
  // the text creeping toward the subtitle.
  const creditLines = credit
    ? wrapText(credit, CREDIT_SIZE, FOOTER_TEXT_MAX, measure)
    : [];
  const ruleY = RULE_Y - (creditLines.length - 1) * CREDIT_LINE_HEIGHT;

  const rule = `<line x1="${MARGIN}" y1="${ruleY}" x2="${CONTENT_RIGHT}" y2="${ruleY}" stroke="${COLOR_LINE}" stroke-opacity="0.25" stroke-width="2"/>`;
  const creditMarkup = creditLines
    .map((line, index) =>
      textLine(
        CREDIT_BASELINE - (creditLines.length - 1 - index) * CREDIT_LINE_HEIGHT,
        CREDIT_SIZE,
        400,
        COLOR_BODY,
        line,
      ),
    )
    .join('\n    ');

  // A URL cannot be broken across lines without becoming unusable, so it is
  // checked rather than wrapped: past this width it would run under the logo
  // sharing the row, and a shared card would show the attribution URI
  // overprinted. Every catalog URL fits today, the longest by some margin.
  if (sourceUrl && measure(sourceUrl, SOURCE_SIZE) > FOOTER_TEXT_MAX) {
    console.warn(
      `[og-images] source URL is too wide for the footer and will run under ` +
        `the logo: ${sourceUrl}`,
    );
  }

  const sourceLine = sourceUrl
    ? textLine(SOURCE_BASELINE, SOURCE_SIZE, 400, COLOR_MUTED, sourceUrl)
    : '';

  // Either line alone still earns the rule. Gating the whole block on the
  // credit would drop a style's source URI along with its missing license,
  // leaving the card with no attribution row at all.
  const footer =
    credit || sourceUrl
      ? `${rule}
    ${creditMarkup}
    ${sourceLine}`
      : '';

  // Right-aligned to the content column, on the credit block's row.
  const logoMarkup = `<g transform="translate(${
    CONTENT_RIGHT - LOGO_WIDTH * LOGO_SCALE
  }, ${LOGO_TOP}) scale(${LOGO_SCALE})">${logo}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${GRADIENT_FROM}"/>
      <stop offset="1" stop-color="${GRADIENT_TO}"/>
    </linearGradient>
    <clipPath id="tile"><rect width="${TILE_SIZE}" height="${TILE_SIZE}" rx="${TILE_RADIUS}"/></clipPath>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  ${tileMarkup}
  ${logoMarkup}
  ${textLine(TITLE_BASELINE, 68, 700, COLOR_TITLE, title)}
  ${textLine(SUBTITLE_BASELINE, 28, 400, COLOR_BODY, subtitle)}
  ${footer}
</svg>`;
}

/**
 * woff2 is a compressed sfnt container. Decompressing the two static Inter
 * cuts the theme already depends on gives resvg something it can actually
 * read, without checking binary font files into the repository.
 *
 * The package version is part of the filename: the cache is keyed by
 * existence alone, so without it a @fontsource/inter bump would keep serving
 * the previous outlines on every machine that had already built once.
 */
async function ensureFonts(cacheDir: string): Promise<string[]> {
  const { decompress } = require('wawoff2') as {
    decompress: (input: Buffer) => Promise<Uint8Array>;
  };
  const { version } = require('@fontsource/inter/package.json') as {
    version: string;
  };

  await fs.mkdir(cacheDir, { recursive: true });

  return Promise.all(
    [400, 700].map(async (weight) => {
      const target = path.join(cacheDir, `inter-${weight}-${version}.ttf`);

      try {
        await fs.access(target);
      } catch {
        const source = require.resolve(
          `@fontsource/inter/files/inter-latin-${weight}-normal.woff2`,
        );
        const ttf = Buffer.from(await decompress(await fs.readFile(source)));

        // Written aside and renamed, because the cache is keyed on existence
        // alone: a build interrupted mid-write would otherwise leave a
        // truncated font that every later build trusts, and resvg drops an
        // unusable font silently, so all 38 cards would ship without text.
        // Rename is atomic within the directory, so the name never names a
        // partial file.
        const pending = `${target}.${process.pid}.tmp`;

        await fs.writeFile(pending, ttf);
        await fs.rename(pending, target);
      }

      return target;
    }),
  );
}

/**
 * Quantizes the card to a palette, which is what a service like TinyPNG does
 * and what these cards respond to: flat fills, a small palette, one smooth
 * gradient. Measured over all 38 cards, 4.39 MB becomes 1.40 MB (-68%).
 *
 * `quality: 100` with dithering off is deliberate, and the knobs below it do
 * not behave the way the names suggest. Quality 90 is smaller still at
 * 1.27 MB, but it bands the gradient: peak deviation 108/255 against 52 here,
 * and twenty times as many subpixels off by more than 8. Quality 80 manages
 * to be both worse and bigger, at 1.82 MB. Dithering only adds noise to a
 * gradient a palette already covers well.
 */
function optimizePng(image: RenderedImage): Promise<Buffer> {
  // Handed the raw RGBA buffer instead of resvg's PNG: sharp would only
  // decode that again to re-encode it with a palette. Verified pixel-identical.
  return sharp(image.pixels, {
    raw: { width: image.width, height: image.height, channels: 4 },
  })
    .png({ palette: true, quality: 100, dither: 0 })
    .toBuffer();
}

/**
 * The white lockup, inlined so it nests straight into the card SVG.
 * `pages/public/` and not an import: it is a served asset, and the card
 * needs the markup at build time, not a URL.
 */
async function loadLogo(srcDir: string): Promise<string> {
  const file = path.join(srcDir, 'public', LOGO_FILE);

  return (await fs.readFile(file, 'utf-8'))
    .replace(/<\?xml[^>]*\?>/, '')
    .trim();
}

export async function generateOgImages(
  outDir: string,
  cacheDir: string,
  srcDir: string,
): Promise<void> {
  // The default card carries no credit line, which only holds while every
  // style on it waives attribution. @dicebear/styles is versioned separately,
  // so verify rather than trust the comment on DEFAULT_TILES.
  const notPublicDomain = DEFAULT_TILES.map((tile) => tile.styleName).filter(
    (styleName) => !isPublicDomain(avatarStyles[styleName]?.meta),
  );

  if (notPublicDomain.length > 0) {
    throw new Error(
      `[og-images] the default card shows no credit line, so DEFAULT_TILES must ` +
        `be CC0 1.0, but ${notPublicDomain.join(', ')} ${
          notPublicDomain.length === 1 ? 'is' : 'are'
        } not. Swap the style, or give the card a credit naming the artists.`,
    );
  }

  // Imported here, not at module scope: config.ts loads this file on
  // every config evaluation, and @dicebear/converter's node entry pulls in
  // sharp, exiftool-vendored and tmp-promise. Deferring it keeps that cost
  // inside buildEnd, where the docblock above says it belongs.
  const [fontFiles, logo, { normalizeMaskType }] = await Promise.all([
    ensureFonts(path.join(cacheDir, 'og-fonts')),
    loadLogo(srcDir),
    import('@dicebear/converter'),
  ]);
  const targetDir = path.join(outDir, OG_DIR);

  await fs.mkdir(targetDir, { recursive: true });

  // One object for measuring and for rendering: a measured width only
  // predicts the rendered one while both use the same fonts.
  const font: ResvgRenderOptions['font'] = {
    loadSystemFonts: false,
    fontFiles,
    defaultFontFamily: 'Inter',
  };
  const measure = createTextMeasurer(font);
  const styleNames = Object.keys(avatarStyles);
  const roundedStyleCount = Math.floor(styleNames.length / 5) * 5;

  const cards = [
    {
      name: DEFAULT_CARD,
      svg: buildCard({
        tiles: await Promise.all(
          DEFAULT_TILES.map((tile) => renderTile(tile.styleName, tile.seed)),
        ),
        logo,
        normalizeMaskType,
        measure,
        title: 'DiceBear',
        subtitle: `The open source avatar library · ${roundedStyleCount}+ styles`,
      }),
    },
  ];

  for (const styleName of styleNames) {
    cards.push({
      name: styleName,
      svg: buildCard({
        tiles: await pickTiles(styleName),
        logo,
        normalizeMaskType,
        measure,
        title: capitalCase(styleName),
        subtitle: 'Avatar style · free and open source',
        credit: creditFor(styleName),
        sourceUrl: avatarStyles[styleName].meta.source,
      }),
    });
  }

  // resvg's synchronous render blocks the event loop; renderAsync hands the
  // work to the libuv threadpool, so the 38 cards rasterize concurrently
  // instead of in a chain.
  //
  // The same two font paths go to all 38 calls deliberately. resvg does not
  // re-pay for them per call (measured: 236ms with fontFiles against 238ms
  // with no fonts at all), whereas the fontBuffers form costs 2800ms. Do not
  // "optimize" this into passing buffers.
  // Bounded rather than all 38 at once: a rendered card holds a raw RGBA
  // frame (1200 x 630 x 4 = 3.02 MB) alive until its sharp encode finishes,
  // so the unbounded form peaks around 115 MB of pixels and can exhaust a
  // memory-capped build container. That happens in buildEnd, after the whole
  // site has already been written, where the failure looks unrelated.
  const queue = cards.slice();

  await Promise.all(
    Array.from({ length: RASTER_CONCURRENCY }, async () => {
      for (let card = queue.shift(); card; card = queue.shift()) {
        const png = await renderAsync(card.svg, {
          fitTo: { mode: 'width', value: WIDTH },
          font,
        });

        await fs.writeFile(
          path.join(targetDir, `${card.name}.png`),
          await optimizePng(png),
        );
      }
    }),
  );

  // Only the Latin Inter cuts are loaded and system fonts are off, so anything
  // outside that subset renders as .notdef boxes, and silently, because the
  // boxes still measure. The credit is a CC BY attribution, so a warning
  // beats letting one ship unreadable.
  for (const styleName of styleNames) {
    const meta = avatarStyles[styleName].meta;
    const text = `${creditFor(styleName) ?? ''} ${meta.source ?? ''}`;
    const outside = text.match(
      /[^\p{Script=Latin}\p{Script=Common}\p{Script=Inherited}]/gu,
    );

    if (outside) {
      console.warn(
        `[og-images] ${styleName}'s credit contains characters the Latin Inter ` +
          `subset cannot render (${[...new Set(outside)].join('')}); the card ` +
          `will show blank boxes there.`,
      );
    }
  }

  const orphaned = cards
    .map((card) => card.name)
    .filter((name) => !requestedCards.has(name));

  if (orphaned.length > 0) {
    // The page-to-card regex above hardcodes the style page layout. If those
    // pages ever move, every style page silently falls back to the generic
    // card while the specific ones are still written and never referenced.
    // A warning rather than a throw: worse previews are not worth failing a
    // release over.
    console.warn(
      `[og-images] ${orphaned.length} card(s) written but never requested by a page: ` +
        `${orphaned.join(', ')}. Has the style page layout changed?`,
    );
  }

  console.log(`[og-images] wrote ${cards.length} cards to ${targetDir}`);
}
