import { promises as fs } from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';
import { deepStrictEqual as equal } from 'node:assert/strict';
import {
  ensureSize,
  getMetadata,
  normalizeMaskType,
  prepareForResvg,
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
  const avatar = await fs.readFile(
    path.resolve(__dirname, '../fixtures/avatar.svg'),
    {
      encoding: 'utf8',
    },
  );

  equal(getMetadata(avatar), {
    title: 'Title',
    source: 'https://www.dicebear.com',
    creator: 'Creator',
    license: 'https://www.dicebear.com/licenses',
    copyright: 'Remix of „Title” (https://www.dicebear.com) by „DiceBear”',
  });
});

test(`"normalizeMaskType" mirrors alpha onto the presentation attribute`, async () => {
  equal(
    normalizeMaskType(
      `<svg><mask id="a" style="mask-type:alpha"></mask></svg>`,
    ),
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
    normalizeMaskType(
      `<svg><mask id="a" style="mask-type:Alpha"></mask></svg>`,
    ),
    `<svg><mask id="a" style="mask-type:Alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" ignores an attribute merely ending in "style"`, async () => {
  const svg = `<svg><mask id="a" data-style="mask-type:alpha"></mask></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" returns untouched input verbatim`, async () => {
  const svg = `<svg><path d="M0 0h10v10z"/></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" handles nested masks`, async () => {
  // The XML round trip expands the self-closing <use/>, which is equivalent.
  equal(
    normalizeMaskType(
      `<svg><defs><g><mask id="a" style="mask-type:alpha"><use href="#b"/></mask></g></defs></svg>`,
    ),
    `<svg><defs><g><mask id="a" style="mask-type:alpha" mask-type="alpha"><use href="#b"></use></mask></g></defs></svg>`,
  );
});

test(`"normalizeMaskType" survives ">" inside an attribute value`, async () => {
  equal(
    normalizeMaskType(
      `<svg><mask id="a>b" style="mask-type:alpha"></mask></svg>`,
    ),
    `<svg><mask id="a>b" style="mask-type:alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" handles a self-closing mask`, async () => {
  // The XML round trip expands the self-closing tag, which is equivalent.
  equal(
    normalizeMaskType(`<svg><mask id="a" style="mask-type:alpha"/></svg>`),
    `<svg><mask id="a" style="mask-type:alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" reads single-quoted styles`, async () => {
  // The XML round trip normalizes quotes, which is equivalent.
  equal(
    normalizeMaskType(
      `<svg><mask id='a' style='mask-type:alpha'></mask></svg>`,
    ),
    `<svg><mask id="a" style="mask-type:alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" lets the last of repeated declarations win`, async () => {
  equal(
    normalizeMaskType(
      `<svg><mask id="a" style="mask-type:luminance;mask-type:alpha"></mask></svg>`,
    ),
    `<svg><mask id="a" style="mask-type:luminance;mask-type:alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"prepareForResvg" sizes and normalizes masks in one pass`, async () => {
  const result = prepareForResvg(
    `<svg><mask id="a" style="mask-type:alpha"></mask></svg>`,
    100,
  );

  equal(result.size, 100);
  equal(
    result.svg,
    `<svg width="100" height="100"><mask id="a" style="mask-type:alpha" mask-type="alpha"></mask></svg>`,
  );
});

test(`"prepareForResvg" applies the same size sanitizing as "ensureSize"`, async () => {
  equal(prepareForResvg(`<svg></svg>`).size, 512);
  equal(prepareForResvg(`<svg></svg>`, 10000).size, 2048);
  equal(prepareForResvg(`<svg></svg>`, NaN).size, 512);
});

test(`"normalizeMaskType" returns input verbatim when the declaration is only text`, async () => {
  // The substring guard false-positives here. The tree walk then changes
  // nothing, so the original string has to come back byte-identical.
  const svg = `<svg><desc>set mask-type:alpha in CSS</desc><use href='#a'/></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" returns malformed input unchanged`, async () => {
  // resvg would reject this anyway, so handing it back beats throwing.
  const svg = `<mask style="mask-type:alpha"` + '<mask a '.repeat(5);

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" strips !important from the declaration`, async () => {
  equal(
    normalizeMaskType(
      `<svg><mask id="a" style="mask-type:alpha !important"></mask></svg>`,
    ),
    `<svg><mask id="a" style="mask-type:alpha !important" mask-type="alpha"></mask></svg>`,
  );
});

test(`"normalizeMaskType" drops an invalid declaration value`, async () => {
  // A browser ignores `mask-type: alpha extra` too, and copied verbatim it
  // would make resvg fall back to the luminance default.
  const svg = `<svg><mask id="a" style="mask-type:alpha extra"></mask></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" preserves CDATA sections`, async () => {
  equal(
    normalizeMaskType(
      `<svg><mask id="a" style="mask-type:alpha"></mask><style><![CDATA[a<b && c>d]]></style></svg>`,
    ),
    `<svg><mask id="a" style="mask-type:alpha" mask-type="alpha"></mask><style><![CDATA[a<b && c>d]]></style></svg>`,
  );
});

test(`"ensureSize" preserves text nodes byte-exact`, async () => {
  // Parser defaults would trim the whitespace and coerce "0123" to 123.
  equal(
    ensureSize(`<svg><text> 0123 </text><text>1e3</text></svg>`, 100).svg,
    `<svg width="100" height="100"><text> 0123 </text><text>1e3</text></svg>`,
  );
});

test(`"normalizeMaskType" fixes a mask nested deeper than 100 elements`, async () => {
  // The parser's default nesting cap of 100 rejects documents that resvg
  // renders fine. The mask fix has to reach them.
  const deep = (inner) =>
    `<svg>${'<g>'.repeat(200)}${inner}${'</g>'.repeat(200)}</svg>`;

  equal(
    normalizeMaskType(deep(`<mask id="a" style="mask-type:alpha"></mask>`)),
    deep(`<mask id="a" style="mask-type:alpha" mask-type="alpha"></mask>`),
  );
});

test(`"normalizeMaskType" returns input beyond the nesting cap unchanged`, async () => {
  // This documents the bound: past 1024 levels the parser refuses and the
  // input passes through untouched instead of throwing.
  const svg = `<svg>${'<g>'.repeat(1100)}<mask style="mask-type:alpha"/>${'</g>'.repeat(1100)}</svg>`;

  equal(normalizeMaskType(svg), svg);
});
