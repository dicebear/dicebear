import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { deepStrictEqual as equal, ok } from 'node:assert/strict';
import {
  ensureSize,
  getMetadata,
  normalizeMaskType,
} from '../../lib/utils/svg.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

test(`"ensureSize" without width and height`, async () => {
  equal(
    ensureSize(`<svg foo bar></svg>`, 100).svg,
    `<svg foo bar width="100" height="100"></svg>`,
  );
});

test(`"ensureSize" with width and height`, async () => {
  equal(
    ensureSize(`<svg foo width="20" bar height="20"></svg>`, 100).svg,
    `<svg foo width="100" bar height="100"></svg>`,
  );
});

test(`"ensureSize" with width only`, async () => {
  equal(
    ensureSize(`<svg foo width="20" bar></svg>`, 100).svg,
    `<svg foo width="100" bar height="100"></svg>`,
  );
});

test(`"ensureSize" with height only`, async () => {
  equal(
    ensureSize(`<svg foo bar height="20"></svg>`, 100).svg,
    `<svg foo bar height="100" width="100"></svg>`,
  );
});

test(`"ensureSize" returns correct size`, async () => {
  equal(ensureSize(`<svg></svg>`, 256).size, 256);
});

test(`"ensureSize" defaults to 512`, async () => {
  const result = ensureSize(`<svg></svg>`);
  equal(result.size, 512);
  equal(result.svg, `<svg width="512" height="512"></svg>`);
});

test(`"ensureSize" overwrites huge SVG dimensions`, async () => {
  equal(
    ensureSize(`<svg width="999999999" height="999999999"></svg>`, 128).svg,
    `<svg width="128" height="128"></svg>`,
  );
});

test(`"ensureSize" overwrites non-numeric SVG dimensions`, async () => {
  equal(
    ensureSize(`<svg width="100%" height="auto"></svg>`, 64).svg,
    `<svg width="64" height="64"></svg>`,
  );
});

test(`"ensureSize" clamps to max 2048`, async () => {
  const result = ensureSize(`<svg></svg>`, 10000);
  equal(result.size, 2048);
  equal(result.svg, `<svg width="2048" height="2048"></svg>`);
});

test(`"ensureSize" floors fractional size`, async () => {
  const result = ensureSize(`<svg></svg>`, 99.9);
  equal(result.size, 99);
  equal(result.svg, `<svg width="99" height="99"></svg>`);
});

test(`"ensureSize" falls back to 512 for NaN`, async () => {
  equal(ensureSize(`<svg></svg>`, NaN).size, 512);
});

test(`"ensureSize" falls back to 512 for negative`, async () => {
  equal(ensureSize(`<svg></svg>`, -100).size, 512);
});

test(`"ensureSize" falls back to 512 for zero`, async () => {
  equal(ensureSize(`<svg></svg>`, 0).size, 512);
});

test(`"ensureSize" falls back to 512 for Infinity`, async () => {
  equal(ensureSize(`<svg></svg>`, Infinity).size, 512);
});

test(`Metadata parsing`, async () => {
  const avatar = await fs.readFile(path.resolve(__dirname, '../fixtures/avatar.svg'), {
    encoding: 'utf8',
  });

  equal(
    getMetadata(avatar),
    {
      title: 'Title',
      source: 'https://www.dicebear.com',
      creator: 'Creator',
      license: 'https://www.dicebear.com/licenses',
      copyright: 'Remix of „Title” (https://www.dicebear.com) by „DiceBear”',
    }
  )
});

test(`"normalizeMaskType" mirrors alpha onto the presentation attribute`, async () => {
  equal(
    normalizeMaskType(`<svg><mask id="a" style="mask-type:alpha"></mask></svg>`),
    `<svg><mask id="a" style="mask-type:alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" leaves luminance alone`, async () => {
  const svg = `<svg><mask id="a" style="mask-type:luminance"></mask></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" lets the declaration override the attribute`, async () => {
  // A presentation attribute is an author rule of specificity 0, so `style`
  // wins in a browser; resvg has to be told the same thing.
  equal(
    normalizeMaskType(
      `<svg><mask id="a" mask-type="luminance" style="mask-type:alpha"></mask></svg>`,
    ),
    `<svg><mask id="a" mask-type="alpha" style="mask-type:alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" leaves an attribute that already agrees`, async () => {
  const svg = `<svg><mask id="a" mask-type="alpha" style="mask-type:alpha"></mask></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" lowercases a CSS keyword`, async () => {
  // CSS values are case-insensitive, SVG attribute values are not.
  equal(
    normalizeMaskType(`<svg><mask id="a" style="mask-type:Alpha"></mask></svg>`),
    `<svg><mask id="a" style="mask-type:Alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" ignores an attribute merely ending in "style"`, async () => {
  const svg = `<svg><mask id="a" data-style="mask-type:alpha"></mask></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" stays linear on unterminated mask tokens`, async () => {
  // Each unterminated `<mask` used to cost a scan of the rest of the string.
  const svg = `<mask style="mask-type:alpha"` + '<mask a '.repeat(20000);
  const started = process.hrtime.bigint();

  normalizeMaskType(svg);

  const ms = Number(process.hrtime.bigint() - started) / 1e6;

  ok(ms < 250, `took ${ms.toFixed(0)}ms`);
});

test(`"normalizeMaskType" returns untouched input verbatim`, async () => {
  const svg = `<svg><path d="M0 0h10v10z"/></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" handles nested masks and leaves the rest verbatim`, async () => {
  equal(
    normalizeMaskType(
      `<svg><defs><g><mask id="a" style="mask-type:alpha"><use href="#b"/></mask></g></defs></svg>`,
    ),
    `<svg><defs><g><mask id="a" style="mask-type:alpha" mask-type="alpha"><use href="#b"/></mask></g></defs></svg>`,
  );
});

test(`"normalizeMaskType" survives ">" inside an attribute value`, async () => {
  equal(
    normalizeMaskType(`<svg><mask id="a>b" style="mask-type:alpha"></mask></svg>`),
    `<svg><mask id="a>b" style="mask-type:alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" handles a self-closing mask`, async () => {
  equal(
    normalizeMaskType(`<svg><mask id="a" style="mask-type:alpha"/></svg>`),
    `<svg><mask id="a" style="mask-type:alpha" mask-type="alpha"/></svg>`,
  );
});

test(`"normalizeMaskType" reads single-quoted styles`, async () => {
  equal(
    normalizeMaskType(`<svg><mask id='a' style='mask-type:alpha'></mask></svg>`),
    `<svg><mask id='a' style='mask-type:alpha' mask-type="alpha"></mask></svg>`,
  );
});
