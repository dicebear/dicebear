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

test(`"prepareForResvg" strips a full-canvas clip`, async () => {
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 100"><defs><clipPath id="c"><rect width="100" height="100" rx="0" ry="0"/></clipPath></defs><g clip-path="url(#c)"><rect width="100" height="100"/></g></svg>`,
    100,
  );

  equal(
    result.svg,
    `<svg viewBox="0 0 100 100" width="100" height="100"><defs><clipPath id="c"><rect width="100" height="100" rx="0" ry="0"></rect></clipPath></defs><g><rect width="100" height="100"></rect></g></svg>`,
  );
  equal(result.cornerRadius, undefined);
});

test(`"prepareForResvg" strips a rounded full-canvas clip and returns its radii`, async () => {
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 100"><defs><clipPath id="c"><rect width="100" height="100" rx="20" ry="10"/></clipPath></defs><g clip-path="url(#c)"><rect width="100" height="100"/></g></svg>`,
    100,
  );

  // Radii come back as fractions of the canvas size.
  equal(result.cornerRadius, { rx: 0.2, ry: 0.1 });
  equal(result.svg.includes('clip-path='), false);
});

test(`"prepareForResvg" keeps a clip that covers only part of the canvas`, async () => {
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 100"><defs><clipPath id="c"><rect width="50" height="100"/></clipPath></defs><g clip-path="url(#c)"></g></svg>`,
    100,
  );

  equal(result.svg.includes('clip-path="url(#c)"'), true);
  equal(result.cornerRadius, undefined);
});

test(`"prepareForResvg" keeps a clip whose reference carries a transform`, async () => {
  // A transform re-anchors the clip away from the viewport, so the crop is
  // no longer the one the viewport applies anyway.
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 100"><defs><clipPath id="c"><rect width="100" height="100"/></clipPath></defs><g transform="translate(10)" clip-path="url(#c)"></g></svg>`,
    100,
  );

  equal(result.svg.includes('clip-path="url(#c)"'), true);
});

test(`"prepareForResvg" keeps a clip when the viewBox is not origin-anchored`, async () => {
  const result = prepareForResvg(
    `<svg viewBox="-25 -25 100 100"><defs><clipPath id="c"><rect width="100" height="100"/></clipPath></defs><g clip-path="url(#c)"></g></svg>`,
    100,
  );

  equal(result.svg.includes('clip-path="url(#c)"'), true);
});

test(`"prepareForResvg" keeps a clip with a percentage radius`, async () => {
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 100"><defs><clipPath id="c"><rect width="100" height="100" rx="20%"/></clipPath></defs><g clip-path="url(#c)"></g></svg>`,
    100,
  );

  equal(result.svg.includes('clip-path="url(#c)"'), true);
  equal(result.cornerRadius, undefined);
});

test(`"prepareForResvg" keeps a deeper clip reference`, async () => {
  // Only direct children of the root are provably cropped to the viewport;
  // anything deeper may sit under a transformed ancestor.
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 100"><defs><clipPath id="c"><rect width="100" height="100"/></clipPath></defs><g transform="rotate(45, 50, 50)"><g clip-path="url(#c)"></g></g></svg>`,
    100,
  );

  equal(result.svg.includes('clip-path="url(#c)"'), true);
});

test(`"prepareForResvg" keeps a clip when the viewBox is not square`, async () => {
  // The rebuilt SVG has a square viewport, so a 2:1 viewBox is letterboxed
  // and the viewport reaches past it: the clip crops content the viewport
  // keeps.
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 50"><defs><clipPath id="c"><rect width="100" height="50"/></clipPath></defs><g clip-path="url(#c)"></g></svg>`,
    100,
  );

  equal(result.svg.includes('clip-path="url(#c)"'), true);
  equal(result.cornerRadius, undefined);
});

test(`"prepareForResvg" keeps a clip whose shape carries a style attribute`, async () => {
  // `display:none` in there would empty the clip instead of leaving it
  // full-canvas.
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 100"><defs><clipPath id="c"><rect width="100" height="100" style="display:none"/></clipPath></defs><g clip-path="url(#c)"></g></svg>`,
    100,
  );

  equal(result.svg.includes('clip-path="url(#c)"'), true);
});

test(`"prepareForResvg" keeps two distinct rounded full-canvas clips`, async () => {
  // One returned radius could not represent both crops.
  const result = prepareForResvg(
    `<svg viewBox="0 0 100 100"><defs><clipPath id="a"><rect width="100" height="100" rx="10"/></clipPath><clipPath id="b"><rect width="100" height="100" rx="30"/></clipPath></defs><g clip-path="url(#a)"></g><g clip-path="url(#b)"></g></svg>`,
    100,
  );

  equal(result.svg.includes('clip-path="url(#a)"'), true);
  equal(result.svg.includes('clip-path="url(#b)"'), true);
  equal(result.cornerRadius, undefined);
});
