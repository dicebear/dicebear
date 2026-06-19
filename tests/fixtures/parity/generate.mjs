// Generates the cross-language parity fixtures consumed by every port's test
// suite. Re-run via `npm run fixtures:parity` whenever the JS implementation
// legitimately changes; commit the diff and bring the other ports back in
// sync.
//
// The generator deliberately uses the JS implementation as the reference.
// The other ports are then expected to match these byte-for-byte.

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';

import {
  Avatar,
  Color,
  OptionsDescriptor,
  Style,
} from '../../../src/js/core/lib/index.js';
import { Prng } from '../../../src/js/core/lib/Prng.js';
import { Fnv1a } from '../../../src/js/core/lib/Prng/Fnv1a.js';
import { Mulberry32 } from '../../../src/js/core/lib/Prng/Mulberry32.js';
import { Number } from '../../../src/js/core/lib/Utils/Number.js';
import { Initials } from '../../../src/js/core/lib/Utils/Initials.js';

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

// JSON.stringify leaves U+2028/U+2029 (line/paragraph separators) and BMP
// private-use code points literal; editors flag those as unusual line
// terminators or invisible glyphs. Rewrite them as \uXXXX so the committed
// fixtures hold no such characters. Built from char codes so this source file
// stays clean too.
function escapeInvisible(json) {
  let out = '';
  for (const ch of json) {
    const cp = ch.codePointAt(0);
    if (cp === 0x2028 || cp === 0x2029 || (cp >= 0xe000 && cp <= 0xf8ff)) {
      out += String.fromCharCode(0x5c) + 'u' + cp.toString(16).padStart(4, '0');
    } else {
      out += ch;
    }
  }
  return out;
}

function writeJson(relPath, data) {
  const filePath = join(import.meta.dirname, relPath);
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, escapeInvisible(JSON.stringify(data, null, 2)) + '\n');
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

// A synthetic style with tagged variants. The vendored styles carry no tags
// yet, so this pins the `tags` filter contract for every port: axis-scoped
// includes, excludes, `${name}Variant` precedence, and unknown-tag no-ops. Each
// variant renders a distinct rect, so the filtered pick shows up in both the
// SVG and the resolved options. `hair` is mandatory and tagged on three axes,
// `facialHair` is optional (probability 50), and `nose` carries no tags so the
// filter must leave it whole.
const tagRect = (fill) => ({
  type: 'element',
  name: 'rect',
  attributes: { width: '100', height: '100', fill },
});

styles.tagged = {
  canvas: {
    width: 100,
    height: 100,
    elements: [
      { type: 'component', name: 'hair' },
      { type: 'component', name: 'facialHair' },
      { type: 'component', name: 'nose' },
    ],
  },
  components: {
    hair: {
      width: 100,
      height: 100,
      variants: {
        longStraight: {
          elements: [tagRect('#111111')],
          tags: ['hairLength:long', 'hairTexture:straight', 'gender:female'],
        },
        longCurly: {
          elements: [tagRect('#222222')],
          tags: ['hairLength:long', 'hairTexture:curly', 'gender:female'],
        },
        shortStraight: {
          elements: [tagRect('#333333')],
          tags: ['hairLength:short', 'hairTexture:straight', 'gender:male'],
        },
        shortCurly: {
          elements: [tagRect('#444444')],
          tags: ['hairLength:short', 'hairTexture:curly', 'gender:male'],
        },
      },
    },
    facialHair: {
      width: 100,
      height: 100,
      probability: 50,
      variants: {
        beard: {
          elements: [tagRect('#555555')],
          tags: ['facialHair:beard', 'gender:male'],
        },
        mustache: {
          elements: [tagRect('#666666')],
          tags: ['facialHair:mustache', 'gender:male'],
        },
      },
    },
    nose: {
      width: 100,
      height: 100,
      variants: {
        small: { elements: [tagRect('#777777')] },
        big: { elements: [tagRect('#888888')] },
      },
    },
  },
};
writeJson(join('styles', 'tagged.json'), styles.tagged);

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

// Supplementary-plane test characters, built via code point / code unit so the
// source holds no literal control characters. U+1F600's UTF-16 lead surrogate
// (D83D) sorts BEFORE U+E000 by code unit but AFTER it by code point — so these
// pin that every port sorts by UTF-16 code units, not scalar values.
const EMOJI = String.fromCodePoint(0x1f600);
const PUA = String.fromCharCode(0xe000);

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
  // A two-element astral/BMP pair distinguishes the sort whichever index hits.
  { seed: 'test', key: 'a', items: [EMOJI, PUA] },
  { seed: 'hello', key: 'k', items: ['z', PUA, EMOJI, 'a'] },
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
  // fractional weights in non-sorted insertion order — locks in that every port
  // sums in the same order (sorted), since float addition is non-associative
  { seed: 'test', key: 'k', weights: { c: 0.1, a: 0.2, b: 0.3 } },
  // Astral-plane keys: UTF-16 vs code-point sort order (see EMOJI/PUA above).
  { seed: 'test', key: 'k', weights: { [EMOJI]: 1, [PUA]: 2, a: 3 } },
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
  // Negative value landing exactly on a .5 boundary after *10000
  // (value = -0.40625 → -4062.5). Pins the rounding mode: the reference rounds
  // half toward +Infinity (-0.4062), not away from zero (-0.4063).
  { seed: '549449', key: 'colorAngle', range: { min: -1, max: 1 } },
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
  // Astral-plane items: UTF-16 vs code-point sort order (see EMOJI/PUA above).
  { seed: 'test', key: 'k', items: ['z', PUA, EMOJI, 'a'] },
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
// `dicebear.utils.Number.format`) and must reproduce it byte-for-byte. These pin
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
// Initials fixtures
// ---------------------------------------------------------------------------
//
// `Initials.fromSeed` derives display initials for the `initials` style. The
// `@`-stripping, quote-stripping, and `\p{L}` word matching are easy to get
// subtly wrong per language (e.g. a regex that strips raw bytes instead of code
// points would corrupt multibyte letters like ô/ü). These cases pin the
// contract across ASCII, accented, quote-prefixed, email, CJK, and emoji seeds.

console.log('Generating initials.json…');

const initialsSeeds = [
  'AB CD',
  'café',
  'über',
  'côté',
  'grün rot',
  "l'eau",
  'd´or',
  'ʼtest',
  'user@example.com',
  'a',
  '',
  '日本語',
  '🎲 spiel',
  'Œuvre',
  'rock-paper',
  // The whole @ suffix is stripped, including line terminators (dotall): these
  // seeds verify a CR / U+2028 / U+2029 right after `@` is removed, not kept.
  'a@b' + String.fromCharCode(0x0d) + 'cd',
  'a@b' + String.fromCharCode(0x2028) + 'cd',
  'a@b' + String.fromCharCode(0x2029) + 'cd',
  // Full Unicode case mapping (not simple 1:1): ß→SS, the ﬁ ligature→FI, and
  // Greek iota-subscript forms expand to two letters. Languages whose default
  // uppercasing is simple-mapping only (Go strings.ToUpper, Dart VM
  // toUpperCase) need a full-mapping implementation to pass these.
  'ß test',
  'ﬁsh bar',
  'ᾀeolic text',
];

writeJson(
  'initials.json',
  initialsSeeds.map((seed) => ({ seed, result: Initials.fromSeed(seed) })),
);

// ---------------------------------------------------------------------------
// Color fixtures
// ---------------------------------------------------------------------------
//
// The color helpers feed both the resolver (contrast sorting picks colors, so
// any drift changes rendered avatars) and public API consumers. `luminance`
// involves float math (sRGB linearization with `** 2.4`), where rounding could
// silently diverge between languages; the fixtures pin exact doubles.

console.log('Generating colors.json…');

// Covers 3-, 4-, 6- and 8-digit forms, with/without `#`, and mixed case.
const hexInputs = [
  '000',
  '#000',
  'abc',
  '#AbC',
  'f0f0',
  '#F0f0',
  'ff0000',
  '#FF0000',
  'ff000080',
  '#ff000080',
  '#1a2b3c',
];

const luminanceInputs = [
  '#000000',
  '#ffffff',
  '#ff0000',
  '#00ff00',
  '#0000ff',
  '#808080',
  '#0a5b83',
  '#69d2e7',
  '#f88c49',
  '#abc',
  '#1a2b3c',
  // Around the sRGB linearization threshold (s <= 0.04045 → channel <= ~10.3):
  // 0x0a takes the linear branch, 0x0b the power branch.
  '#0a0a0a',
  '#0b0b0b',
];

const sortByContrastCases = [
  {
    candidates: ['#000000', '#ffffff', '#ff0000', '#0000ff'],
    refColor: '#ffffff',
  },
  {
    candidates: ['#69d2e7', '#0a5b83', '#f88c49', '#e0e4cc'],
    refColor: '#000000',
  },
  // Equal ratios (same color in different notations) must keep input order —
  // pins that every port sorts stably.
  { candidates: ['#ff0000', 'ff0000', '#FF0000', '#f00'], refColor: '#00ff00' },
  { candidates: [], refColor: '#000000' },
  { candidates: ['#123456'], refColor: '#123456' },
];

const filterNotEqualToCases = [
  { candidates: ['#ff0000', '#00ff00', '#0000ff'], excluded: ['ff0000'] },
  // The alpha channel is stripped for comparison.
  { candidates: ['#ff000080', '#00ff00'], excluded: ['#ff0000'] },
  // Short forms normalize before comparison.
  { candidates: ['#abc', '#def'], excluded: ['#aabbcc'] },
  // Filtering would empty the list → falls back to the original candidates.
  { candidates: ['#ff0000', 'ff0000'], excluded: ['#f00'] },
  { candidates: ['#ff0000'], excluded: [] },
];

writeJson('colors.json', {
  toHex: hexInputs.map((input) => ({ input, result: Color.toHex(input) })),
  toRgbHex: hexInputs.map((input) => ({
    input,
    result: Color.toRgbHex(input),
  })),
  parseHex: hexInputs.map((input) => ({ input, result: Color.parseHex(input) })),
  luminance: luminanceInputs.map((input) => ({
    input,
    result: Color.luminance(input),
  })),
  sortByContrast: sortByContrastCases.map((c) => ({
    ...c,
    result: Color.sortByContrast(c.candidates, c.refColor),
  })),
  filterNotEqualTo: filterNotEqualToCases.map((c) => ({
    ...c,
    result: Color.filterNotEqualTo(c.candidates, c.excluded),
  })),
});

// ---------------------------------------------------------------------------
// Validation fixtures
// ---------------------------------------------------------------------------
//
// Pins which inputs every port must accept or reject. Only the accept/reject
// outcome is shared — error messages are language-specific. The circular
// color reference cases additionally pin the reported resolution chain.

console.log('Generating validation.json…');

const minimalStyle = { canvas: { width: 100, height: 100, elements: [] } };

const styleValidationCases = [
  { id: 'minimal', definition: minimalStyle },
  {
    id: 'with-component-and-color',
    definition: {
      canvas: { width: 100, height: 100, elements: [] },
      components: {
        shape: {
          width: 100,
          height: 100,
          variants: { a: { elements: [] }, b: { elements: [] } },
        },
      },
      colors: { fill: { values: ['#000000'] } },
    },
  },
  { id: 'empty', definition: {} },
  { id: 'missing-canvas', definition: { components: {} } },
  { id: 'canvas-not-object', definition: { canvas: 'nope' } },
  { id: 'canvas-missing-size', definition: { canvas: { elements: [] } } },
  {
    id: 'alias-to-unknown-component',
    definition: {
      canvas: { width: 100, height: 100, elements: [] },
      components: { a: { extends: 'missing' } },
    },
  },
  {
    id: 'unknown-root-key',
    definition: { canvas: { width: 100, height: 100, elements: [] }, unexpected: true },
  },
  {
    id: 'tagged-variant',
    definition: {
      canvas: { width: 100, height: 100, elements: [] },
      components: {
        hair: {
          width: 100,
          height: 100,
          variants: {
            long: { elements: [], tags: ['hairLength:long', 'gender:female'] },
          },
        },
      },
    },
  },
  {
    id: 'invalid-tag-uppercase',
    definition: {
      canvas: { width: 100, height: 100, elements: [] },
      components: {
        hair: {
          width: 100,
          height: 100,
          variants: { long: { elements: [], tags: ['HairLength:Long'] } },
        },
      },
    },
  },
];

const optionsValidationCases = [
  { id: 'empty', options: {} },
  { id: 'seed-string', options: { seed: 'x' } },
  { id: 'seed-number', options: { seed: 123 } },
  { id: 'size-min', options: { size: 1 } },
  { id: 'size-zero', options: { size: 0 } },
  { id: 'size-negative', options: { size: -5 } },
  { id: 'size-float', options: { size: 12.5 } },
  { id: 'size-huge', options: { size: 2000000 } },
  { id: 'flip-valid', options: { flip: 'horizontal' } },
  { id: 'flip-invalid', options: { flip: 'diagonal' } },
  { id: 'rotate-in-range', options: { rotate: 360 } },
  { id: 'rotate-out-of-range', options: { rotate: 361 } },
  { id: 'scale-negative', options: { scale: -1 } },
  { id: 'title-number', options: { title: 123 } },
  { id: 'id-randomization-string', options: { idRandomization: 'yes' } },
  { id: 'background-color-string', options: { backgroundColor: 'ff0000' } },
  { id: 'background-color-list', options: { backgroundColor: ['ff0000'] } },
  { id: 'background-color-invalid-hex', options: { backgroundColor: ['zzz'] } },
  { id: 'unknown-option', options: { unknownOption: 1 } },
  { id: 'tags-string', options: { tags: 'gender:male' } },
  { id: 'tags-array', options: { tags: ['hairLength:long', '!facialHair:beard'] } },
  { id: 'tags-bare-exclude', options: { tags: ['!facialHair'] } },
  { id: 'tags-invalid-uppercase', options: { tags: ['Bad:X'] } },
  { id: 'tags-invalid-three-segment', options: { tags: ['a:b:c'] } },
  { id: 'tags-invalid-double-negation', options: { tags: ['!!a'] } },
];

// A style whose canvas uses color `a`, so resolving it walks the (circular)
// `contrastTo` chain.
function circularStyle(colors) {
  return {
    canvas: {
      width: 100,
      height: 100,
      elements: [
        {
          type: 'element',
          name: 'rect',
          attributes: { fill: { type: 'color', name: 'a' } },
        },
      ],
    },
    colors,
  };
}

const circularColorCases = [
  {
    id: 'self-reference',
    style: circularStyle({ a: { values: ['#000000'], contrastTo: 'a' } }),
  },
  {
    id: 'two-color-cycle',
    style: circularStyle({
      a: { values: ['#000000'], contrastTo: 'b' },
      b: { values: ['#ffffff'], contrastTo: 'a' },
    }),
  },
  {
    id: 'three-color-cycle',
    style: circularStyle({
      a: { values: ['#000000'], contrastTo: 'b' },
      b: { values: ['#ffffff'], contrastTo: 'c' },
      c: { values: ['#ff0000'], contrastTo: 'a' },
    }),
  },
];

const validationFixtures = {
  styles: styleValidationCases.map((c) => {
    let valid = true;
    try {
      new Style(c.definition);
    } catch {
      valid = false;
    }

    return { ...c, valid };
  }),
  // Validated against the `minimal` style above.
  options: optionsValidationCases.map((c) => {
    let valid = true;
    try {
      new Avatar(minimalStyle, c.options);
    } catch {
      valid = false;
    }

    return { ...c, valid };
  }),
  circularColors: circularColorCases.map((c) => {
    try {
      new Avatar(c.style, { seed: 'x' });
    } catch (e) {
      if (e.name !== 'CircularColorReferenceError') {
        throw new Error(
          `${c.id}: expected CircularColorReferenceError, got ${e.name}`,
          { cause: e },
        );
      }

      return { ...c, options: { seed: 'x' }, chain: e.chain };
    }

    throw new Error(`${c.id}: expected a circular color reference error`);
  }),
};

writeJson('validation.json', validationFixtures);

// ---------------------------------------------------------------------------
// Avatar fixtures
// ---------------------------------------------------------------------------

console.log('Generating avatar fixtures…');

const DATA_URI_CASE_IDS = new Set(['plain-seed', 'title-escaping']);

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
    // `size` and `title` together pin the resolution order of the resolved
    // options snapshot (size is recorded before title).
    {
      id: 'title-size',
      options: { seed: 'parity-1', size: 128, title: 'Parity Avatar' },
    },
    // XML-escaping of the <title> element: ampersand, angle brackets, both
    // quote styles and a non-BMP code point.
    {
      id: 'title-escaping',
      options: {
        seed: 'parity-2',
        title: 'Tom & Jerry\'s <"Avatar"> ' + EMOJI,
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
  tagged: avatarCases([
    // gender:male keeps the male hair, filters facialHair, leaves nose whole.
    { id: 'tags-include-gender', options: { seed: 'parity-1', tags: 'gender:male' } },
    // hairLength:long touches only hair; facialHair has no hairLength tag.
    { id: 'tags-include-axis', options: { seed: 'parity-1', tags: 'hairLength:long' } },
    // exclude one value, and a bare exclude that empties the optional facialHair.
    { id: 'tags-exclude-value', options: { seed: 'parity-1', tags: '!hairTexture:curly' } },
    { id: 'tags-exclude-bare', options: { seed: 'parity-1', tags: '!facialHair' } },
    // AND across axes, OR within an axis.
    { id: 'tags-and-across-axes', options: { seed: 'parity-1', tags: ['hairLength:long', 'hairTexture:curly'] } },
    { id: 'tags-or-within-axis', options: { seed: 'parity-1', tags: ['hairLength:long', 'hairLength:short'] } },
    // unknown tag is a no-op.
    { id: 'tags-unknown-noop', options: { seed: 'parity-1', tags: 'eyes:big' } },
    // ${name}Variant is more specific: hair ignores the filter, facialHair obeys it.
    { id: 'tags-variant-precedence', options: { seed: 'parity-1', tags: 'gender:male', hairVariant: 'longStraight' } },
    // empty ${name}Variant yields no hair even though the filter would allow some.
    { id: 'tags-empty-variant', options: { seed: 'parity-1', tags: 'gender:female', hairVariant: [] } },
  ]),
};

for (const [styleName, cases] of Object.entries(avatarFixtures)) {
  const styleData = styles[styleName];
  const out = cases.map((c) => {
    const avatar = new Avatar(styleData, c.options);
    const json = avatar.toJSON();
    // JSON-round-trip the resolved options so the fixture matches what
    // any consumer would see after JSON.stringify — this drops undefined
    // values like `size` and `title` when they were not provided.
    const resolvedOptions = JSON.parse(JSON.stringify(json.options));

    const result = { id: c.id, options: c.options, svg: json.svg, resolvedOptions };

    // Pins the percent-encoding contract (JS `encodeURIComponent`: everything
    // except `A-Za-z0-9-_.!~*'()` is escaped). Two cases per style suffice —
    // the encoder is byte-level, so `plain-seed` (typical SVG markup) plus
    // `title-escaping` (escaped XML + multi-byte UTF-8) cover the alphabet
    // without doubling every fixture entry.
    if (DATA_URI_CASE_IDS.has(c.id)) {
      result.dataUri = avatar.toDataUri();
    }

    return result;
  });
  writeJson(join('avatars', `${styleName}.json`), out);
}

// ---------------------------------------------------------------------------
// OptionsDescriptor fixtures
// ---------------------------------------------------------------------------
//
// One descriptor per parity style. Pins the field map (types, ranges, sorted
// variant lists, per-color fields) that tooling builds form controls from.

console.log('Generating descriptor fixtures…');

for (const [styleName, styleData] of Object.entries(styles)) {
  const descriptor = new OptionsDescriptor(new Style(styleData)).toJSON();
  writeJson(join('descriptors', `${styleName}.json`), descriptor);
}

console.log('Done.');
