/**
 * Generates the eight seeds behind every style page's preview row, one row per
 * style, into theme/config/previewRowSeeds.ts.
 *
 * Every row's initials spell DICEBEAR. The `initial-face` style prints that
 * outright, one letter per avatar; everywhere else it stays in the markup.
 *
 * Pinning the first letter of all eight seeds leaves the search far less room
 * than a free choice of names would. One row shared by every style has to spend
 * what room is left on a compromise: it can hand `bottts` eight different robots
 * and still paint four of them the same gold, because moving that hue costs some
 * other style its own spread. Per style the trade disappears, since each search
 * answers to one palette.
 *
 * What a row is scored on, in order of weight:
 *
 *  1. Distinct artwork. Two tiles drawing the same shapes read as a rendering
 *     bug rather than a showcase, so this dominates everything else. Color is
 *     excluded here: `icons` picks the same pictogram for neighboring seeds and
 *     differs only in hue, which looks duplicated whatever the color.
 *  2. Distinct palettes, then spread within each individual option, so a row
 *     does not land on one hue eight times over.
 *  3. A penalty per adjacent pair sharing a color, because a repeat reads worse
 *     side by side than it does across the row.
 *
 * Two constraints are absolute. Every seed must be unique, and no two may share
 * their first two letters: `initials` draws exactly those two letters, and it
 * is the one style whose output the scoring cannot see, because the letters are
 * generated during render rather than resolved into options. Nothing here may
 * appear in `exampleSeeds` or og-images.ts's SEED_POOL either, or a social card
 * and the page it links to would open with the same avatars.
 *
 * The search is a deterministic beam search over fixed pools, so re-running
 * without changing this file or @dicebear/styles reproduces the same table.
 *
 * The output is committed. Re-run after upgrading @dicebear/styles or after
 * adding a style:
 *
 *   node scripts/generate-preview-seeds.mjs
 */
import { Avatar, Style } from '@dicebear/core';
import { createRequire } from 'node:module';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);

/** sRGB hex to CIE Lab, D65, the space CIEDE2000 is defined in. */
function hexToLab(hex) {
  const int = parseInt(hex.replace('#', '').slice(0, 6).padEnd(6, '0'), 16);
  const channels = [(int >> 16) & 255, (int >> 8) & 255, int & 255].map((c) => {
    const v = c / 255;
    return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  const [r, g, b] = channels;
  const xyz = [
    (0.4124564 * r + 0.3575761 * g + 0.1804375 * b) / 0.95047,
    0.2126729 * r + 0.7151522 * g + 0.072175 * b,
    (0.0193339 * r + 0.119192 * g + 0.9503041 * b) / 1.08883,
  ].map((t) => (t > (6 / 29) ** 3 ? Math.cbrt(t) : t / (3 * (6 / 29) ** 2) + 4 / 29));

  return [116 * xyz[1] - 16, 500 * (xyz[0] - xyz[1]), 200 * (xyz[1] - xyz[2])];
}

/**
 * CIEDE2000. Plain Euclidean distance in Lab overstates differences in
 * saturated blues and understates them in near-neutrals, which is exactly the
 * comparison this makes most often: whether two backgrounds a viewer would call
 * "both gray" are actually far enough apart to sit side by side.
 */
function deltaE00([l1, a1, b1], [l2, a2, b2]) {
  const rad = Math.PI / 180;
  const c1 = Math.hypot(a1, b1);
  const c2 = Math.hypot(a2, b2);
  const meanC = (c1 + c2) / 2;
  const g = 0.5 * (1 - Math.sqrt(meanC ** 7 / (meanC ** 7 + 25 ** 7)));
  const ap1 = (1 + g) * a1;
  const ap2 = (1 + g) * a2;
  const cp1 = Math.hypot(ap1, b1);
  const cp2 = Math.hypot(ap2, b2);

  const hp = (b, ap) => {
    if (b === 0 && ap === 0) return 0;
    const angle = Math.atan2(b, ap) / rad;
    return angle >= 0 ? angle : angle + 360;
  };
  const hp1 = hp(b1, ap1);
  const hp2 = hp(b2, ap2);

  const dL = l2 - l1;
  const dC = cp2 - cp1;

  let dh = 0;
  if (cp1 * cp2 !== 0) {
    dh = hp2 - hp1;
    if (dh > 180) dh -= 360;
    else if (dh < -180) dh += 360;
  }
  const dH = 2 * Math.sqrt(cp1 * cp2) * Math.sin((dh / 2) * rad);

  const meanL = (l1 + l2) / 2;
  const meanCp = (cp1 + cp2) / 2;

  let meanH = hp1 + hp2;
  if (cp1 * cp2 !== 0) {
    if (Math.abs(hp1 - hp2) > 180) meanH += hp1 + hp2 < 360 ? 360 : -360;
    meanH /= 2;
  }

  const t =
    1 -
    0.17 * Math.cos((meanH - 30) * rad) +
    0.24 * Math.cos(2 * meanH * rad) +
    0.32 * Math.cos((3 * meanH + 6) * rad) -
    0.2 * Math.cos((4 * meanH - 63) * rad);

  const sL = 1 + (0.015 * (meanL - 50) ** 2) / Math.sqrt(20 + (meanL - 50) ** 2);
  const sC = 1 + 0.045 * meanCp;
  const sH = 1 + 0.015 * meanCp * t;
  const rt =
    -2 *
    Math.sqrt(meanCp ** 7 / (meanCp ** 7 + 25 ** 7)) *
    Math.sin(60 * Math.exp(-(((meanH - 275) / 25) ** 2)) * rad);

  return Math.sqrt(
    (dL / sL) ** 2 +
      (dC / sC) ** 2 +
      (dH / sH) ** 2 +
      rt * (dC / sC) * (dH / sH),
  );
}

/**
 * A color option's value is an array: one entry for a solid fill, two for a
 * gradient. Averaging in Lab gives the impression the tile leaves from across
 * the row, which is the level this compares at.
 */
function meanLab(value) {
  const hexes = (Array.isArray(value) ? value : [value]).filter(
    (v) => typeof v === 'string' && /^#?[0-9a-fA-F]{3,8}$/.test(v),
  );
  if (hexes.length === 0) return null;
  const labs = hexes.map(hexToLab);
  return [0, 1, 2].map(
    (i) => labs.reduce((sum, lab) => sum + lab[i], 0) / labs.length,
  );
}
const definitionsDir = path.dirname(
  require.resolve('@dicebear/styles/initials.json'),
);

const outFile = fileURLToPath(
  new URL('../.vitepress/theme/config/previewRowSeeds.ts', import.meta.url),
);

/**
 * The eight avatars a style page opens with, and the four on its card in the
 * styles index. Reading the index card and then the page it links to spells the
 * name twice, the second time in full.
 */
const ROW_WORD = 'DICEBEAR';
const CARD_WORD = 'DICE';

/**
 * The social card carries five tiles, and no five-letter run of DICEBEAR spells
 * anything, so this row is free of the acrostic and picked purely for spread.
 * It shares no seed with either row above it: the card and the page it links to
 * open one click apart.
 */
const OG_TILES = 5;

/**
 * Held to six characters so playground links stay short and `initials` tiles
 * keep drawing two letters at a readable size.
 */
const MAX_LENGTH = 6;

/**
 * Names spoken for elsewhere, read out of the files that own them rather than
 * copied. A copy would go stale silently, and the symptom would be a social card
 * opening with the same avatars as the page it links to.
 */
async function reservedNames() {
  const sources = {
    'theme/config/styleCategories.ts': ['exampleSeeds'],
  };

  const names = new Set();

  for (const [file, constants] of Object.entries(sources)) {
    const text = await readFile(
      fileURLToPath(new URL(`../.vitepress/${file}`, import.meta.url)),
      'utf8',
    );

    for (const constant of constants) {
      const match = text.match(new RegExp(`${constant}[^[]*\\[([^\\]]*)\\]`));

      if (!match) {
        throw new Error(
          `Could not read ${constant} from ${file}. The seed lists have to stay ` +
            'readable from here, or this script cannot tell which names are taken.',
        );
      }

      for (const quoted of match[1].matchAll(/'([A-Za-z]+)'/g)) {
        names.add(quoted[1]);
      }
    }
  }

  return names;
}

const RESERVED = await reservedNames();

/**
 * Candidates per letter. Wide enough that each style finds a row that suits its
 * palette, and deliberately plain: these are seeds, and a seed that draws
 * attention to itself competes with the avatar it produces. `Dylan` is left out
 * because a style goes by that name.
 */
const POOLS = {
  D: ['Dahlia', 'Dalia', 'Dana', 'Dante', 'Daphne', 'Dara', 'Darius', 'Davi', 'Dax', 'Delia', 'Deniz', 'Denver', 'Devon', 'Diana', 'Dilan', 'Dilara', 'Dima', 'Dina', 'Dion', 'Dita', 'Dora', 'Doria', 'Dorian', 'Dov', 'Drew', 'Dries', 'Duncan'],
  I: ['Ida', 'Idris', 'Iker', 'Ilan', 'Ilaria', 'Ilias', 'Ilona', 'Ilse', 'Ilya', 'Imani', 'Ina', 'Inaya', 'Indira', 'Ines', 'Ingrid', 'Iona', 'Irene', 'Isaac', 'Isabel', 'Isla', 'Ismael', 'Iva', 'Ivan', 'Ivy', 'Izumi'],
  C: ['Cai', 'Caleb', 'Calla', 'Callum', 'Camila', 'Carla', 'Carmen', 'Caspar', 'Casper', 'Cato', 'Cecile', 'Cedric', 'Celia', 'Celine', 'Cesar', 'Chiara', 'Chloe', 'Cian', 'Ciara', 'Ciro', 'Clara', 'Colin', 'Cora', 'Cosima', 'Curtis', 'Cyrus'],
  E: ['Edda', 'Eden', 'Edgar', 'Edith', 'Efe', 'Elba', 'Elena', 'Eli', 'Elias', 'Elif', 'Elin', 'Elio', 'Elise', 'Ella', 'Eloise', 'Elsa', 'Emery', 'Emil', 'Enid', 'Enzo', 'Erik', 'Esme', 'Ethan', 'Eva', 'Evelyn', 'Evren', 'Ewan', 'Ezra'],
  B: ['Baris', 'Basil', 'Baxter', 'Bea', 'Beau', 'Bela', 'Bella', 'Ben', 'Bente', 'Berta', 'Bianca', 'Bilal', 'Blake', 'Bo', 'Bodhi', 'Bodie', 'Bodil', 'Boris', 'Bram', 'Brea', 'Brenda', 'Britt', 'Brody', 'Bruno', 'Byron'],
  A: ['Aden', 'Adele', 'Adil', 'Agnes', 'Aiden', 'Aisha', 'Alba', 'Alec', 'Alia', 'Alma', 'Amara', 'Amina', 'Amir', 'Ana', 'Anders', 'Andre', 'Anika', 'Anja', 'Anouk', 'Anton', 'Arden', 'Ari', 'Aria', 'Arlo', 'Asher', 'Astrid', 'Ava', 'Axel', 'Ayla'],
  R: ['Rafa', 'Rafael', 'Rania', 'Raul', 'Raven', 'Ravi', 'Reese', 'Regina', 'Remy', 'Renzo', 'Reza', 'Rhea', 'Rhys', 'Rida', 'Riley', 'Rina', 'Rio', 'Rita', 'Robin', 'Rocco', 'Roman', 'Ronan', 'Rosa', 'Rosie', 'Roshan', 'Rowan', 'Ruben', 'Ruby', 'Rune', 'Ruth'],
};

const usable = Object.fromEntries(
  Object.entries(POOLS).map(([letter, names]) => [
    letter,
    names.filter((name) => name.length <= MAX_LENGTH && !RESERVED.has(name)),
  ]),
);

const allNames = [...new Set(Object.values(usable).flat())];
const nameIndex = new Map(allNames.map((name, i) => [name, i]));
const prefix = allNames.map((name) => name.slice(0, 2).toUpperCase());
const poolIds = Object.fromEntries(
  Object.entries(usable).map(([letter, names]) => [
    letter,
    names.map((name) => nameIndex.get(name)),
  ]),
);

/**
 * How much a row is worth. Distinct artwork outranks everything else, because
 * repeated artwork is the one failure a viewer reads as a bug rather than as a
 * dull row.
 */
const WEIGHT = {
  shape: 100,
  palette: 40,
  option: 4,
  neighborGap: 0.5,
  neighborTooClose: -40,
  closestPair: 2,
};

/**
 * Color distances in CIEDE2000, where roughly 2.3 is the smallest difference
 * anyone notices. Past the caps a row gains nothing from pushing two colors
 * further apart, so the search spends its remaining freedom elsewhere.
 */
const CAP = { neighborGap: 40, closestPair: 20 };
const THRESHOLD = { sameColor: 10 };

const BEAM = 1200;

const files = (await readdir(definitionsDir))
  .filter((file) => file.endsWith('.min.json'))
  .sort();

const rows = {};
const cards = {};
const ogTiles = {};
const report = [];

for (const file of files) {
  const styleName = file.replace('.min.json', '');
  const style = new Style(
    JSON.parse(await readFile(path.join(definitionsDir, file), 'utf8')),
  );

  // Resolve every candidate once, then work on interned ids. Rendering is the
  // only expensive part of the search; scoring is integer comparisons.
  const resolved = allNames.map(
    (seed) => new Avatar(style, { seed }).toJSON().options,
  );

  // The union, not the first avatar's keys. Components behind a probability
  // (glasses, hair accessories) resolve no options at all on the avatars that
  // do not have them, so sampling one avatar drops those keys for the whole
  // style and the scoring stops seeing the component that distinguishes two
  // otherwise identical faces.
  const optionKeys = [
    ...new Set(resolved.flatMap((options) => Object.keys(options))),
  ].sort();
  const colorKeys = optionKeys.filter((key) => /Color$/.test(key));

  const intern = (values) => {
    const seen = new Map();
    return values.map((value) => {
      const key = JSON.stringify(value);
      if (!seen.has(key)) seen.set(key, seen.size);
      return seen.get(key);
    });
  };

  const shape = intern(
    resolved.map((options) =>
      optionKeys.filter((key) => !/color/i.test(key)).map((key) => options[key]),
    ),
  );
  const palette = intern(
    resolved.map((options) => colorKeys.map((key) => options[key])),
  );
  const perOption = optionKeys.map((key) =>
    intern(resolved.map((options) => options[key])),
  );
  // Only colors the seed actually moves, and only as far apart as they look.
  // Two of `bottts-neutral`'s grays are separate values that read as one color,
  // so distance is measured in CIEDE2000 instead of by comparing hex. A style
  // that paints every avatar's eyes the same color drops out here: that repeats
  // between all neighbors whatever the seeds are, and counting it would drown
  // out the repeats a different row could have avoided.
  //
  // Counted on the colors a style actually draws, ignoring the avatars where the
  // component is absent. `lorelei` draws every pair of glasses black and leaves
  // most faces without any, and treating "no glasses" as a second value would
  // make a constant look variable and then penalize two bare faces for matching.
  const NO_COLOR = -1;

  const perColor = colorKeys
    .map((key) => {
      const values = resolved.map((options) => options[key]);
      const labels = values.map((value) =>
        value === undefined ? undefined : JSON.stringify(value),
      );
      const drawn = [...new Set(labels.filter((label) => label !== undefined))];
      if (drawn.length < 2) return null;

      // One Lab per distinct value, not per candidate: a palette holds a few
      // colors while the pools hold nearly two hundred names.
      const labs = drawn.map((label) => meanLab(JSON.parse(label)));
      const size = drawn.length;
      const index = new Map(drawn.map((label, i) => [label, i]));
      const ids = labels.map((label) =>
        label === undefined ? NO_COLOR : index.get(label),
      );

      const distance = new Float64Array(size * size);
      for (let i = 0; i < size; i++) {
        for (let j = i + 1; j < size; j++) {
          // A value carrying no parseable color (a transparent background) is
          // treated as far from everything, since it does read as different.
          const d = labs[i] && labs[j] ? deltaE00(labs[i], labs[j]) : 100;
          distance[i * size + j] = d;
          distance[j * size + i] = d;
        }
      }

      return { ids, distance, size };
    })
    .filter(Boolean);

  const distinct = (column, ids) => new Set(ids.map((id) => column[id])).size;

  /**
   * How far apart two avatars sit in one color. An avatar that does not draw
   * the component at all cannot repeat it, so those pairs score as far apart
   * rather than as a match.
   */
  function gap(column, a, b) {
    const left = column.ids[a];
    const right = column.ids[b];

    if (left === NO_COLOR || right === NO_COLOR) return 100;

    return column.distance[left * column.size + right];
  }

  /**
   * Drives the beam. Everything here is cheap to recompute as a row grows, so
   * the expensive whole-row measure is left to {@link finalScore}.
   */
  function score(ids) {
    let value =
      WEIGHT.shape * distinct(shape, ids) +
      WEIGHT.palette * distinct(palette, ids);

    for (const column of perOption) {
      value += WEIGHT.option * distinct(column, ids);
    }

    for (const column of perColor) {
      for (let i = 1; i < ids.length; i++) {
        const d = gap(column, ids[i], ids[i - 1]);
        value += WEIGHT.neighborGap * Math.min(d, CAP.neighborGap);
        if (d < THRESHOLD.sameColor) value += WEIGHT.neighborTooClose;
      }
    }

    return value;
  }

  /**
   * Adds what the beam cannot afford: the closest pair anywhere in the row, not
   * just between neighbors. Without it a row can space its neighbors well and
   * still fit four near-identical golds into eight tiles.
   *
   * Only palettes with a color to spare are measured this way. `dylan` offers
   * two skin tones, so two of its eight tiles share one however they are chosen,
   * and scoring that would rank every row identically while hiding the styles
   * where the repeat was avoidable.
   */
  function finalScore(ids) {
    let value = score(ids);

    for (const column of perColor) {
      if (column.size < ids.length) continue;

      let closest = Infinity;
      for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
          closest = Math.min(closest, gap(column, ids[i], ids[j]));
        }
      }
      value += WEIGHT.closestPair * Math.min(closest, CAP.closestPair);
    }

    return value;
  }

  /**
   * Beam search along an acrostic. `taken` holds ids the row may not use, which
   * is how the four card avatars stay off the eight the style page opens with:
   * the two sit one click apart, so a shared avatar reads as the page not having
   * loaded rather than as a second look at the style.
   */
  function searchRow(word, taken = new Set()) {
    let beam = [[]];

    for (const letter of word) {
      const candidates = [];

      for (const partial of beam) {
        for (const id of poolIds[letter]) {
          if (taken.has(id) || partial.includes(id)) continue;
          if (partial.some((other) => prefix[other] === prefix[id])) continue;
          const next = [...partial, id];
          candidates.push({ ids: next, value: score(next) });
        }
      }

      // Ties break on pool order, which is fixed, so the table is reproducible.
      candidates.sort((a, b) => b.value - a.value);
      beam = candidates.slice(0, BEAM).map((candidate) => candidate.ids);
    }

    // Re-rank the finished rows on the whole-row measure the beam skipped.
    return beam
      .map((ids) => ({ ids, value: finalScore(ids) }))
      .sort((a, b) => b.value - a.value)[0].ids;
  }

  /**
   * The free row, where any name may sit in any slot. A beam over the whole pool
   * would cost more than the acrostic rows put together, since nothing prunes
   * the branching, so this greedily takes the best next seed and then swaps each
   * position against every candidate until no swap helps. On rows this short the
   * two together land on the same answer a wider search would.
   */
  function improveRow(size, taken) {
    const pool = allNames.map((_, id) => id).filter((id) => !taken.has(id));
    const ids = [];

    while (ids.length < size) {
      let bestId = null;
      let bestValue = -Infinity;

      for (const id of pool) {
        if (ids.includes(id)) continue;
        if (ids.some((other) => prefix[other] === prefix[id])) continue;
        const value = finalScore([...ids, id]);
        if (value > bestValue) {
          bestValue = value;
          bestId = id;
        }
      }

      ids.push(bestId);
    }

    for (let pass = 0; pass < 4; pass++) {
      let improved = false;

      for (let slot = 0; slot < ids.length; slot++) {
        let bestValue = finalScore(ids);
        let bestId = ids[slot];

        for (const id of pool) {
          if (ids.includes(id)) continue;
          const rest = ids.filter((_, i) => i !== slot);
          if (rest.some((other) => prefix[other] === prefix[id])) continue;

          const candidate = [...ids];
          candidate[slot] = id;
          const value = finalScore(candidate);
          if (value > bestValue) {
            bestValue = value;
            bestId = id;
          }
        }

        if (bestId !== ids[slot]) {
          ids[slot] = bestId;
          improved = true;
        }
      }

      if (!improved) break;
    }

    return ids;
  }

  const best = searchRow(ROW_WORD);
  const card = searchRow(CARD_WORD, new Set(best));
  const og = improveRow(OG_TILES, new Set([...best, ...card]));

  rows[styleName] = best.map((id) => allNames[id]);
  cards[styleName] = card.map((id) => allNames[id]);
  ogTiles[styleName] = og.map((id) => allNames[id]);

  // How close a row comes to putting two same-looking tiles side by side, and
  // how much of each palette it reaches. Measured on the finished rows rather
  // than trusted from the score, since the score trades these off.
  const measure = (ids) => {
    let neighbors = Infinity;
    for (const column of perColor) {
      for (let i = 1; i < ids.length; i++) {
        neighbors = Math.min(neighbors, gap(column, ids[i], ids[i - 1]));
      }
    }

    return {
      shapes: distinct(shape, ids),
      neighbors: perColor.length ? neighbors : null,
      unused: perColor.filter((column) => {
        const drawn = new Set(
          ids.map((id) => column.ids[id]).filter((id) => id !== NO_COLOR),
        ).size;

        return drawn < Math.min(ids.length, column.size);
      }).length,
    };
  };

  report.push({
    styleName,
    row: measure(best),
    card: measure(card),
    og: measure(og),
  });
}

const table = (entries) =>
  Object.entries(entries)
    .map(
      ([styleName, seeds]) =>
        `  ${/^[a-z][a-zA-Z0-9]*$/.test(styleName) ? styleName : `'${styleName}'`}: [${seeds
          .map((seed) => `'${seed}'`)
          .join(', ')}],`,
    )
    .join('\n');

await writeFile(
  outFile,
  `// Generated by scripts/generate-preview-seeds.mjs. Do not edit by hand.
//
// Three rows per avatar style, each searched against that style's own palette so
// no two avatars in a row look alike: the eight a style page opens with, the
// four on its card in the styles index, and the five on its social card. The
// first two spell DICEBEAR and DICE down their initials. No seed appears in more
// than one row, so moving between the three surfaces never shows the same avatar
// twice. Re-run the script after upgrading @dicebear/styles or adding a style.

export const previewRowSeeds: Record<string, string[]> = {
${table(rows)}
};

export const styleCardSeeds: Record<string, string[]> = {
${table(cards)}
};

export const ogTileSeeds: Record<string, string[]> = {
${table(ogTiles)}
};

/**
 * The eight avatars a style page opens with. Throws rather than falling back,
 * matching getStyleCategory: a style missing here means the table was not
 * regenerated after the style shipped, and a silent default would hide that.
 */
export function getPreviewRowSeeds(styleName: string): string[] {
  return lookUp(previewRowSeeds, styleName, 'preview row');
}

/**
 * The four avatars on a style's card in the index. Shares no seed with that
 * style's preview row, so clicking a card does not reopen the same avatars.
 */
export function getStyleCardSeeds(styleName: string): string[] {
  return lookUp(styleCardSeeds, styleName, 'card row');
}

/** The five avatars on a style's Open Graph card. */
export function getOgTileSeeds(styleName: string): string[] {
  return lookUp(ogTileSeeds, styleName, 'social card row');
}

function lookUp(
  table: Record<string, string[]>,
  styleName: string,
  label: string,
): string[] {
  const seeds = table[styleName];

  if (!seeds) {
    throw new Error(
      \`Avatar style "\${styleName}" has no \${label}. Run node scripts/generate-preview-seeds.mjs.\`,
    );
  }

  return seeds;
}
`,
  'utf8',
);

const wrote = report.length;

console.log(
  `✔ wrote ${wrote} preview, card and social rows to ${path.relative(process.cwd(), outFile)}`,
);

for (const [label, size, pick] of [
  ['preview rows', ROW_WORD.length, (entry) => entry.row],
  ['card rows', CARD_WORD.length, (entry) => entry.card],
  ['social card rows', OG_TILES, (entry) => entry.og],
]) {
  const measured = report.map((entry) => ({ ...pick(entry), styleName: entry.styleName }));
  const repeated = measured.filter((entry) => entry.shapes < size);
  // Below this two tiles read as the same color, whatever the hex values say.
  const tooClose = measured.filter(
    (entry) => entry.neighbors !== null && entry.neighbors < THRESHOLD.sameColor,
  );
  const shortOfPalette = measured.filter((entry) => entry.unused > 0);

  console.log(`\n  ${label}`);
  console.log(
    `    ${wrote - repeated.length}/${wrote} styles draw ${size} distinct avatars`,
  );

  for (const entry of repeated) {
    // `initials` always lands here at 1. Its avatars differ only in the letters
    // it draws, and those are produced during render rather than resolved into
    // options, so the metric cannot see them. The unique-prefix constraint is
    // what keeps that row distinct.
    console.log(
      `    ${entry.styleName}: ${entry.shapes} distinct by options` +
        (entry.styleName === 'initials'
          ? ' (expected: its avatars differ only in the letters drawn)'
          : ` - the style may not offer ${size} variants`),
    );
  }

  console.log(
    `    ${wrote - tooClose.length}/${wrote} styles keep neighboring tiles at least` +
      ` ${THRESHOLD.sameColor} CIEDE2000 apart in every color the seed moves`,
  );
  for (const entry of tooClose) {
    console.log(
      `    ${entry.styleName}: neighbors as close as ${entry.neighbors.toFixed(1)}`,
    );
  }

  console.log(
    `    ${wrote - shortOfPalette.length}/${wrote} styles reach every color their palette can show across ${size} tiles`,
  );
}
