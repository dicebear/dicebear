// Generates the cross-language parity fixtures consumed by both the JS and
// PHP test suites. Re-run via `npm run fixtures:parity` whenever the JS
// implementation legitimately changes; commit the diff and bring the PHP
// side back in sync.
//
// The generator deliberately uses the JS implementation as the reference.
// PHP is then expected to match these byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import { Avatar } from '../../../src/js/core/lib/index.js';
import { Prng } from '../../../src/js/core/lib/Prng.js';
import { Fnv1a } from '../../../src/js/core/lib/Prng/Fnv1a.js';
import { Mulberry32 } from '../../../src/js/core/lib/Prng/Mulberry32.js';
import { Number } from '../../../src/js/core/lib/Utils/Number.js';

const definitionsDir = join(
  import.meta.dirname,
  '..',
  '..',
  '..',
  '..',
  'styles',
  'dist',
);

const STYLE_NAMES = ['initials', 'thumbs', 'glass', 'notionists', 'shape-grid'];

function writeJson(relPath, data) {
  const filePath = join(import.meta.dirname, relPath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
  console.log('  wrote', relPath);
}

// ---------------------------------------------------------------------------
// Vendor style definitions
// ---------------------------------------------------------------------------

console.log('Copying style definitions…');
const styles = {};
for (const name of STYLE_NAMES) {
  const raw = JSON.parse(
    readFileSync(join(definitionsDir, `${name}.min.json`), 'utf8'),
  );
  styles[name] = raw;
  writeJson(join('styles', `${name}.json`), raw);
}

// ---------------------------------------------------------------------------
// Fnv1a fixtures
// ---------------------------------------------------------------------------

console.log('Generating fnv1a.json…');
const fnv1aInputs = [
  '',
  'a',
  'b',
  'c',
  'hello',
  'test',
  'foobar',
  '123',
  'dicebear',
  'test:flip',
  'test:scale',
  'some-long-seed:optionName',
  'é',
  '日本語',
  '🎲',
  'a'.repeat(256),
];

writeJson(
  'fnv1a.json',
  fnv1aInputs.map((input) => ({
    input,
    hash: Fnv1a.hash(input),
    hex: Fnv1a.hex(input),
  })),
);

// ---------------------------------------------------------------------------
// Mulberry32 fixtures
// ---------------------------------------------------------------------------

console.log('Generating mulberry32.json…');
const mulberrySeeds = [0, 1, 2, 42, 100, 0x811c9dc5, 0xffffffff];

writeJson(
  'mulberry32.json',
  mulberrySeeds.map((seed) => {
    const m = new Mulberry32(seed);
    const sequence = [];
    for (let i = 0; i < 5; i++) {
      const float = m.nextFloat();
      sequence.push({ float, state: m.state() });
    }

    return { seed, sequence };
  }),
);

// ---------------------------------------------------------------------------
// Prng fixtures (key-based methods)
// ---------------------------------------------------------------------------

console.log('Generating prng.json…');

const prngFixtures = {
  getValue: [],
  pick: [],
  weightedPick: [],
  bool: [],
  float: [],
  integer: [],
  shuffle: [],
};

const getValueCases = [
  { seed: 'test', key: 'flip' },
  { seed: 'test', key: 'scale' },
  { seed: 'test', key: 'rotate' },
  { seed: 'test', key: 'borderRadius' },
  { seed: 'test', key: 'fontWeight' },
  { seed: 'hello', key: 'flip' },
  { seed: 'hello', key: 'eyesVariant' },
  { seed: 'dicebear', key: 'colorFill' },
  { seed: '日本語', key: 'unicode-key' },
  { seed: '', key: 'empty-seed' },
];
for (const c of getValueCases) {
  prngFixtures.getValue.push({
    ...c,
    result: new Prng(c.seed).getValue(c.key),
  });
}

const pickCases = [
  { seed: 'test', key: 'a', items: ['a', 'b', 'c', 'd', 'e'] },
  { seed: 'test', key: 'b', items: ['a', 'b', 'c', 'd', 'e'] },
  { seed: 'test', key: 'c', items: ['a', 'b', 'c', 'd', 'e'] },
  { seed: 'hello', key: 'eyes', items: ['blue', 'green', 'brown', 'hazel'] },
  { seed: 'dicebear', key: 'variant', items: ['variant1', 'variant2', 'variant3'] },
  { seed: 'test', key: 'single', items: ['only'] },
  // pre-shuffled order to verify that sorting normalizes input
  { seed: 'test', key: 'a', items: ['e', 'd', 'c', 'b', 'a'] },
  // duplicates must be collapsed — same result as the unique set
  { seed: 'test', key: 'a', items: ['a', 'a', 'b', 'b', 'c', 'c', 'd', 'd', 'e', 'e'] },
  { seed: 'test', key: 'single', items: ['only', 'only', 'only'] },
];
for (const c of pickCases) {
  prngFixtures.pick.push({
    ...c,
    result: new Prng(c.seed).pick(c.key, c.items),
  });
}

const weightedPickCases = [
  { seed: 'test', key: 'k', weights: { a: 1, b: 4, c: 2 } },
  { seed: 'test', key: 'l', weights: { a: 1, b: 4, c: 2 } },
  { seed: 'hello', key: 'k', weights: { a: 1, b: 4, c: 2 } },
  { seed: 'test', key: 'k', weights: { heavy: 100, light: 1 } },
  { seed: 'test', key: 'k', weights: { rare: 0, common: 1 } },
  // insertion-order independence: same expected result as the first entry above
  { seed: 'test', key: 'k', weights: { c: 2, a: 1, b: 4 } },
  { seed: 'test', key: 'k', weights: { only: 1 } },
  // fractional weights in non-sorted insertion order — locks in that JS and
  // PHP sum in the same order (sorted), since float addition is non-associative
  { seed: 'test', key: 'k', weights: { c: 0.1, a: 0.2, b: 0.3 } },
];
for (const c of weightedPickCases) {
  prngFixtures.weightedPick.push({
    ...c,
    result: new Prng(c.seed).weightedPick(c.key, c.weights),
  });
}

const boolCases = [
  { seed: 'test', key: 'k', likelihood: 0 },
  { seed: 'test', key: 'k', likelihood: 25 },
  { seed: 'test', key: 'k', likelihood: 50 },
  { seed: 'test', key: 'k', likelihood: 75 },
  { seed: 'test', key: 'k', likelihood: 100 },
  { seed: 'hello', key: 'flip', likelihood: 50 },
  { seed: 'dicebear', key: 'flip', likelihood: 50 },
];
for (const c of boolCases) {
  prngFixtures.bool.push({
    ...c,
    result: new Prng(c.seed).bool(c.key, c.likelihood),
  });
}

const floatCases = [
  { seed: 'test', key: 'k', range: { min: 0, max: 1 } },
  { seed: 'test', key: 'k', range: { min: -10, max: 10 } },
  { seed: 'test', key: 'k', range: { min: 10, max: 20 } },
  { seed: 'test', key: 'k', range: { min: 20, max: 10 } }, // reversed
  { seed: 'test', key: 'k', range: { min: 0, max: 100, step: 5 } }, // stepped
  { seed: 'test', key: 'k', range: { min: 3, max: 23, step: 5 } }, // stepped, min not on step grid
  { seed: 'parity-step', key: 'k', range: { min: -10, max: 10, step: 2.5 } }, // stepped, float step
  { seed: 'test', key: 'k', range: { min: 10, max: 20, step: 0 } }, // step 0 → continuous
  { seed: 'hello', key: 'scale', range: { min: 0.5, max: 1.5 } },
  { seed: 'test', key: 'k', range: { min: 42, max: 42 } }, // fixed
];
for (const c of floatCases) {
  prngFixtures.float.push({
    ...c,
    result: new Prng(c.seed).float(c.key, c.range),
  });
}

const integerCases = [
  { seed: 'test', key: 'k', range: { min: 1, max: 6 } },
  { seed: 'test', key: 'k', range: { min: 0, max: 100 } },
  { seed: 'test', key: 'k', range: { min: -50, max: 50 } },
  { seed: 'test', key: 'k', range: { min: 10, max: 1 } }, // reversed
  { seed: 'test', key: 'k', range: { min: 3, max: 10, step: 7 } }, // step ignored
  { seed: 'test', key: 'k', range: { min: 5, max: 5 } }, // min == max
  { seed: 'hello', key: 'fontWeight', range: { min: 100, max: 900 } },
];
for (const c of integerCases) {
  prngFixtures.integer.push({
    ...c,
    result: new Prng(c.seed).integer(c.key, c.range),
  });
}

const shuffleCases = [
  { seed: 'test', key: 'k', items: [] },
  { seed: 'test', key: 'k', items: ['only'] },
  { seed: 'test', key: 'k', items: ['a', 'b', 'c'] },
  { seed: 'test', key: 'k', items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] },
  { seed: 'hello', key: 'k', items: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] },
  // pre-shuffled order to verify that sorting normalizes input
  { seed: 'test', key: 'k', items: ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'] },
  // duplicates collapse — output length matches unique-set length
  { seed: 'test', key: 'k', items: ['a', 'a', 'b', 'b', 'c', 'c'] },
];
for (const c of shuffleCases) {
  prngFixtures.shuffle.push({
    ...c,
    result: new Prng(c.seed).shuffle(c.key, c.items),
  });
}

writeJson('prng.json', prngFixtures);

// ---------------------------------------------------------------------------
// Number formatting fixtures
// ---------------------------------------------------------------------------
//
// The renderer stringifies every numeric SVG attribute via `Number.format`,
// which rounds to at most 5 decimal places. PHP's native float cast and
// Python's `repr` would diverge from JS for small/large magnitudes, so each
// port reimplements it (`DiceBear\Utils\Number::format`,
// `dicebear._numbers.num`) and must reproduce it byte-for-byte. These cases pin
// that contract — covering integers, plain decimals, values that round at the
// 5th decimal, and tiny values that round down to 0.

console.log('Generating numbers.json…');

const numberInputs = [
  0, 1, -1, 100, -50, 4096, 1000000,
  0.5, 1.5, -1.5, 2.5, 0.1, 0.3, 12.34, 123.456, -148.722, 9999.9999,
  0.00001, 0.00005, 0.0001, 0.000005, 0.0000005, 0.0000123456,
  4.567872, 0.123456, 1.999995, 1.999994, 0.123455, 0.123445,
  5e-7, 1e-7, 1.5e-6, 0.0009999999999999998, 4.9999999999999996e-6,
  -4.567872, -0.000005, -0.0001,
];

writeJson(
  'numbers.json',
  numberInputs.map((input) => ({ input, output: Number.format(input) })),
);

// ---------------------------------------------------------------------------
// Avatar fixtures
// ---------------------------------------------------------------------------

console.log('Generating avatar fixtures…');

function avatarCases(extra) {
  return [
    {
      id: 'plain-seed',
      options: { seed: 'parity-1' },
    },
    {
      id: 'different-seed',
      options: { seed: 'parity-2' },
    },
    {
      id: 'size-scale-rotate',
      options: { seed: 'parity-1', size: 256, scale: 2, rotate: 45 },
    },
    {
      id: 'translate-border-flip',
      options: {
        seed: 'parity-1',
        translateX: 10,
        translateY: -5,
        borderRadius: 50,
        flip: 'horizontal',
      },
    },
    {
      id: 'background-solid',
      options: {
        seed: 'parity-1',
        backgroundColor: ['ff0000'],
        backgroundColorFill: ['solid'],
      },
    },
    {
      id: 'background-linear',
      options: {
        seed: 'parity-1',
        backgroundColor: ['ff0000', '00ff00'],
        backgroundColorFill: ['linear'],
        backgroundColorAngle: [45, 45],
      },
    },
    {
      id: 'background-radial',
      options: {
        seed: 'parity-1',
        backgroundColor: ['ff0000', '00ff00'],
        backgroundColorFill: ['radial'],
      },
    },
    ...extra,
  ];
}

const avatarFixtures = {
  initials: avatarCases([
    {
      id: 'font-family-weight',
      options: {
        seed: 'Florian Körner',
        fontFamily: ['Helvetica', 'Arial'],
        fontWeight: 700,
      },
    },
    {
      id: 'variant-double',
      options: { seed: 'AB CD', initialsVariant: ['double'] },
    },
    {
      id: 'variant-single',
      options: { seed: 'AB CD', initialsVariant: ['single'] },
    },
  ]),
  thumbs: avatarCases([
    {
      id: 'eyes-mouth-variant',
      options: {
        seed: 'parity-1',
        eyesVariant: ['variant1W10'],
        mouthVariant: ['variant1'],
      },
    },
    {
      id: 'shape-color-override',
      options: {
        seed: 'parity-1',
        shapeColor: ['ffaa00'],
        eyesColor: ['000000'],
        mouthColor: ['ff0000'],
      },
    },
  ]),
  glass: avatarCases([
    {
      id: 'shape-variants',
      options: {
        seed: 'parity-1',
        shape1Variant: ['a'],
        shape2Variant: ['g'],
      },
    },
    {
      id: 'shape1-probability-zero',
      options: { seed: 'parity-1', shape1Probability: 0 },
    },
  ]),
  notionists: avatarCases([
    {
      id: 'hair-eyes-variant',
      options: {
        seed: 'parity-1',
        hairVariant: ['variant01'],
        eyesVariant: ['variant01'],
      },
    },
    {
      id: 'gesture-variant',
      options: {
        seed: 'parity-1',
        gestureVariant: ['waveLongArms'],
      },
    },
  ]),
  'shape-grid': avatarCases([
    {
      id: 'rows-variant-pinned',
      options: { seed: 'parity-1', rowsVariant: ['rows04'] },
    },
    {
      id: 'shape-variant-pinned',
      options: { seed: 'parity-1', shapeVariant: ['square'] },
    },
    {
      id: 'shape-probability-zero',
      options: { seed: 'parity-1', shapeProbability: 0 },
    },
  ]),
};

for (const [styleName, cases] of Object.entries(avatarFixtures)) {
  const styleData = styles[styleName];
  const out = cases.map((c) => {
    const json = new Avatar(styleData, c.options).toJSON();
    // JSON-round-trip the resolved options so the fixture matches what
    // any consumer would see after JSON.stringify — this drops undefined
    // values like `size` and `title` when they were not provided.
    const resolvedOptions = JSON.parse(JSON.stringify(json.options));

    return { id: c.id, options: c.options, svg: json.svg, resolvedOptions };
  });
  writeJson(join('avatars', `${styleName}.json`), out);
}

console.log('Done.');
