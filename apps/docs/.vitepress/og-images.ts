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
import { getOgTileSeeds } from './theme/config/previewRowSeeds.ts';
import { escapeHtml } from './theme/utils/escape.ts';
import { formatLicenseName } from './theme/utils/format.ts';
import {
  attributionKind,
  attributionPrefix,
  isPublicDomain,
} from './theme/utils/license.ts';

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

/**
 * The avatars stand as stickers, the way they do on the site: a white card
 * with an avatar tile inset by 6%, turned a little, with a soft shadow.
 */
const STICKER_SIZE = 188;
const STICKER_TOP = 52;
const STICKER_RADIUS = STICKER_SIZE * 0.28;
const TILE_SIZE = Math.round(STICKER_SIZE * 0.88);
const TILE_INSET = (STICKER_SIZE - TILE_SIZE) / 2;
const TILE_RADIUS = TILE_SIZE * 0.24;
const TILE_COUNT = 5;

/** Turn and vertical offset per sticker, so the row looks laid by hand. */
const STICKER_TURNS = [-6, 4, -3, 5, -5];
const STICKER_OFFSETS = [14, -6, 10, -8, 8];

/**
 * The row spans margin to margin, the same edges as the footer rule, so the
 * gap follows from the sticker size and count instead of being tuned by hand:
 * 1200 - 2*64 - 5*188 = 132, over four gaps.
 */
const STICKER_GAP =
  (WIDTH - 2 * MARGIN - TILE_COUNT * STICKER_SIZE) / (TILE_COUNT - 1);

/** The title in the display face of the site, shrunk to fit long names. */
const TITLE_SIZE = 112;
const TITLE_FONT = 'Gabarito';
const TITLE_MAX = WIDTH - 2 * MARGIN;

// Fixed below the sticker row, whose lowest corner reaches about 270. Nothing
// renders a card twice to compare, so a baseline left behind by a layout
// tweak would only surface as a broken card already cached by a social
// platform.
const TITLE_BASELINE = 388;
const SUBTITLE_BASELINE = TITLE_BASELINE + 54;
const SOURCE_BASELINE = HEIGHT - MARGIN;
const CREDIT_BASELINE = SOURCE_BASELINE - 30;
const RULE_Y = CREDIT_BASELINE - 40;

/**
 * What shows through a transparent avatar. No avatar is ever given a
 * `backgroundColor`: 42 of the 63 styles declare their own `colors.background`
 * palette (every `-neutral` variant, every v10 addition except glyphs, cameo
 * and gaze, and a handful of older ones), and overriding it would replace a
 * color the artist chose. Cats and dogs declare none but paint the whole tile
 * with a scene. The other 19 render transparent and sit on this.
 *
 * The checkerboard of the site (`--db-checker-*`), sixteen fields across, so
 * a transparent background does not read as part of the picture. Not white,
 * because white artwork disappears against it: `lorelei` loses its face and
 * shows only hair and outlines, and `identicon` loses its negative space.
 */
const CHECKER_LIGHT = '#f9f5ee';
const CHECKER_DARK = '#f1ebe1';
const CHECKER_FIELDS = 16;

/** One checkerboard for all tiles. The fields only touch at their corners. */
function checkerboard(size: number): string {
  const field = +(size / CHECKER_FIELDS).toFixed(3);
  let path = '';

  for (let row = 0; row < CHECKER_FIELDS; row++) {
    for (let column = (row + 1) % 2; column < CHECKER_FIELDS; column += 2) {
      path += `M${+(column * field).toFixed(3)} ${+(row * field).toFixed(3)}h${field}v${field}h-${field}z`;
    }
  }

  return `<g id="db-checker"><rect width="${size}" height="${size}" fill="${CHECKER_LIGHT}"/><path d="${path}" fill="${CHECKER_DARK}"/></g>`;
}

/**
 * The lockup in ink, sitting bottom-right beside the credit block.
 * `logo.svg` is the variant for light grounds; it is pure paths and a circle
 * with no ids and no text, so it nests into the card without colliding with
 * the avatars or needing a font.
 *
 * The credit runs along the same row, so the mark's width is what the credit
 * has to wrap against, and not something tuned by eye.
 */
const LOGO_FILE = 'logo.svg';
const LOGO_WIDTH = 183;
const LOGO_HEIGHT = 32;
const LOGO_SCALE = 1.375;

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
 * monster, clay figure, pixel grid, scene. Everything but lorelei shipped
 * with v10, so the card also shows what is new. The seeds are hand-picked for
 * this row and set the tile order, warm and cool tiles alternating along
 * the row.
 */
const DEFAULT_TILES = [
  { styleName: 'lorelei', seed: 'Felix' },
  { styleName: 'critters', seed: 'Pia' },
  { styleName: 'clay', seed: 'Ilan' },
  { styleName: 'pixelbot', seed: 'Iker' },
  { styleName: 'planets', seed: 'Ruby' },
];

/**
 * The card stands on the beige of the site, with text in its ink. Every text
 * color passes AA on the ground by a wide margin, the muted source line
 * included (about 8:1).
 */
const BACKGROUND = '#f7f1e6';

/** Title and credit line. */
const COLOR_TITLE = '#15213b';

/** Subtitle, the second text color of the site. */
const COLOR_BODY = '#2c3857';

/** The source URL, one step back from the credit above it. */
const COLOR_MUTED = '#3b4662';

/** The footer rule, drawn at low opacity. */
const COLOR_LINE = '#15213b';

/** The sticker edge. */
const STICKER_EDGE = '#ffffff';

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

  return `${attributionPrefix(kind)} ${sourceName} by ${creator} · ${license}`;
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
 * Renders the five tiles a style's card carries.
 *
 * Which seeds those are is decided ahead of time by
 * scripts/generate-preview-seeds.ts, which searches each style's palette for a
 * row whose tiles stay distinct in both artwork and color. Picking here instead
 * meant filtering candidates on a fingerprint with color stripped, which let
 * five differently drawn robots through in five shades of the same gold.
 */
async function renderTiles(styleName: string): Promise<string[]> {
  const seeds = getOgTileSeeds(styleName);

  if (seeds.length !== TILE_COUNT) {
    throw new Error(
      `Style "${styleName}" has ${seeds.length} social card seeds, expected ${TILE_COUNT}. ` +
        'OG_TILES in scripts/generate-preview-seeds.ts and TILE_COUNT here have to agree.',
    );
  }

  return Promise.all(seeds.map((seed) => renderTile(styleName, seed)));
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

  return (
    text: string,
    size: number,
    family = 'Inter',
    weight: 400 | 700 | 800 = 400,
  ): number => {
    const key = `${family}:${weight}:${size}:${text}`;
    const cached = cache.get(key);

    if (cached !== undefined) {
      return cached;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4000 200"><text x="0" y="100" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="#000">${escapeHtml(
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
          `The cached font cuts in .vitepress/cache/og-fonts are the usual cause; ` +
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
  weight: 400 | 700 | 800,
  fill: string,
  value: string,
  family = 'Inter',
): string {
  return `<text x="${MARGIN}" y="${y}" font-family="${family}" font-size="${size}" font-weight="${weight}" fill="${fill}">${escapeHtml(
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
  // One clip path at the origin, reused under each tile's transform: a
  // clip-path resolves in the referencing element's post-transform user
  // space.
  const tileMarkup = tiles
    .map((rawSvg, index) => {
      const center = STICKER_SIZE / 2;
      const x = MARGIN + index * (STICKER_SIZE + STICKER_GAP) + center;
      const y = STICKER_TOP + STICKER_OFFSETS[index] + center;

      // Applied here, not where the avatars are rendered, because both the
      // per-style rows and the default card feed this. `toPng` would do it for us,
      // but the cards drive resvg directly. Without it, styles whose masks rely
      // on `mask-type:alpha` lose detail: a bearded Lorelei renders with no
      // mouth at all.
      const svg = normalizeMaskType(rawSvg);

      // The checkerboard shows through for the transparent styles; the ones
      // carrying their own background paint straight over it. The white edge
      // keeps every tile apart from the beige ground, whatever its color.
      return `<g transform="translate(${x}, ${y}) rotate(${STICKER_TURNS[index]}) translate(${-center}, ${-center})">
      <rect width="${STICKER_SIZE}" height="${STICKER_SIZE}" rx="${STICKER_RADIUS}" fill="${STICKER_EDGE}" filter="url(#shadow)"/>
      <g transform="translate(${TILE_INSET}, ${TILE_INSET})" clip-path="url(#tile)"><use href="#db-checker"/>${svg}</g>
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

  const rule = `<line x1="${MARGIN}" y1="${ruleY}" x2="${CONTENT_RIGHT}" y2="${ruleY}" stroke="${COLOR_LINE}" stroke-opacity="0.22" stroke-width="2"/>`;
  const creditMarkup = creditLines
    .map((line, index) =>
      textLine(
        CREDIT_BASELINE - (creditLines.length - 1 - index) * CREDIT_LINE_HEIGHT,
        CREDIT_SIZE,
        400,
        COLOR_TITLE,
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

  // Long names such as "Notionists Neutral" shrink until they fit the row.
  const titleSize = Math.min(
    TITLE_SIZE,
    Math.floor(
      (TITLE_SIZE * TITLE_MAX) / measure(title, TITLE_SIZE, TITLE_FONT, 800),
    ),
  );

  // Right-aligned to the content column, on the credit block's row.
  const logoMarkup = `<g transform="translate(${
    CONTENT_RIGHT - LOGO_WIDTH * LOGO_SCALE
  }, ${LOGO_TOP}) scale(${LOGO_SCALE})">${logo}</g>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="12" stdDeviation="10" flood-color="${COLOR_TITLE}" flood-opacity="0.28"/>
    </filter>
    <clipPath id="tile"><rect width="${TILE_SIZE}" height="${TILE_SIZE}" rx="${TILE_RADIUS}"/></clipPath>
    ${checkerboard(TILE_SIZE)}
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${BACKGROUND}"/>
  ${tileMarkup}
  ${logoMarkup}
  ${textLine(TITLE_BASELINE, titleSize, 800, COLOR_TITLE, title, TITLE_FONT)}
  ${textLine(SUBTITLE_BASELINE, 30, 400, COLOR_BODY, subtitle)}
  ${footer}
</svg>`;
}

/**
 * woff2 is a compressed sfnt container. Decompressing the static Inter and
 * Gabarito cuts gives resvg something it can actually read, without checking
 * binary font files into the repository.
 *
 * The package version is part of the filename: the cache is keyed by
 * existence alone, so without it a @fontsource bump would keep serving
 * the previous outlines on every machine that had already built once.
 */
async function ensureFonts(cacheDir: string): Promise<string[]> {
  const { decompress } = require('wawoff2') as {
    decompress: (input: Buffer) => Promise<Uint8Array>;
  };

  // The body cuts of Inter and the heavy cut of Gabarito for the title.
  const cuts = [
    { pkg: 'inter', weight: 400 },
    { pkg: 'inter', weight: 700 },
    { pkg: 'gabarito', weight: 800 },
  ];

  await fs.mkdir(cacheDir, { recursive: true });

  return Promise.all(
    cuts.map(async ({ pkg, weight }) => {
      const { version } = require(`@fontsource/${pkg}/package.json`) as {
        version: string;
      };
      const target = path.join(cacheDir, `${pkg}-${weight}-${version}.ttf`);

      try {
        await fs.access(target);
      } catch {
        const source = require.resolve(
          `@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`,
        );
        const ttf = Buffer.from(await decompress(await fs.readFile(source)));

        // Written aside and renamed, because the cache is keyed on existence
        // alone: a build interrupted mid-write would otherwise leave a
        // truncated font that every later build trusts, and resvg drops an
        // unusable font silently, so all cards would ship without text.
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
 * The ink lockup, inlined so it nests straight into the card SVG.
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
        tiles: await renderTiles(styleName),
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
