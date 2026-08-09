import { test } from 'node:test';
import { deepStrictEqual as equal, throws } from 'node:assert/strict';
import { JSDOM } from 'jsdom';

// The browser helpers run on the native DOMParser/XMLSerializer. Node has
// neither, so jsdom provides them as globals for these tests. jsdom parses
// XML with a real XML parser and serializes per the W3C algorithm, which is
// what browsers implement as well; empty elements come back self-closing.
const { DOMParser, XMLSerializer } = new JSDOM().window;
globalThis.DOMParser = DOMParser;
globalThis.XMLSerializer = XMLSerializer;

const { ensureSize, normalizeMaskType } = await import(
  '../../lib/utils/svg-browser.js'
);

test(`"ensureSize" without width and height`, async () => {
  equal(
    ensureSize(`<svg foo="1" bar="2"></svg>`, 100).svg,
    `<svg foo="1" bar="2" width="100" height="100"/>`,
  );
});

test(`"ensureSize" overwrites existing dimensions`, async () => {
  equal(
    ensureSize(`<svg width="20" height="20"></svg>`, 100).svg,
    `<svg width="100" height="100"/>`,
  );
});

test(`"ensureSize" keeps the SVG namespace`, async () => {
  equal(
    ensureSize(`<svg xmlns="http://www.w3.org/2000/svg"><path d="M0 0h10"/></svg>`, 100)
      .svg,
    `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100"><path d="M0 0h10"/></svg>`,
  );
});

test(`"ensureSize" keeps a comment before the root element`, async () => {
  equal(
    ensureSize(`<!--gen--><svg></svg>`, 100).svg,
    `<!--gen--><svg width="100" height="100"/>`,
  );
});

test(`"ensureSize" keeps text content byte-exact`, async () => {
  equal(
    ensureSize(`<svg><text> 0123 </text></svg>`, 100).svg,
    `<svg width="100" height="100"><text> 0123 </text></svg>`,
  );
});

test(`"ensureSize" keeps CDATA sections`, async () => {
  equal(
    ensureSize(`<svg><style><![CDATA[.a>.b{fill:#fff}]]></style></svg>`, 100)
      .svg,
    `<svg width="100" height="100"><style><![CDATA[.a>.b{fill:#fff}]]></style></svg>`,
  );
});

test(`"ensureSize" returns correct size`, async () => {
  equal(ensureSize(`<svg></svg>`, 256).size, 256);
});

test(`"ensureSize" defaults to 512`, async () => {
  const result = ensureSize(`<svg></svg>`);
  equal(result.size, 512);
  equal(result.svg, `<svg width="512" height="512"/>`);
});

test(`"ensureSize" clamps to max 2048`, async () => {
  equal(ensureSize(`<svg></svg>`, 10000).size, 2048);
});

test(`"ensureSize" floors fractional size`, async () => {
  equal(ensureSize(`<svg></svg>`, 99.9).size, 99);
});

test(`"ensureSize" falls back to 512 for NaN, negative, zero, Infinity`, async () => {
  equal(ensureSize(`<svg></svg>`, NaN).size, 512);
  equal(ensureSize(`<svg></svg>`, -100).size, 512);
  equal(ensureSize(`<svg></svg>`, 0).size, 512);
  equal(ensureSize(`<svg></svg>`, Infinity).size, 512);
});

test(`"ensureSize" throws on malformed input`, async () => {
  throws(() => ensureSize(`<svg><no`, 100));
});

test(`"normalizeMaskType" mirrors alpha onto the presentation attribute`, async () => {
  equal(
    normalizeMaskType(`<svg><mask id="a" style="mask-type:alpha"></mask></svg>`),
    `<svg><mask id="a" style="mask-type:alpha" mask-type="alpha"/></svg>`,
  );
});

test(`"normalizeMaskType" leaves luminance alone`, async () => {
  const svg = `<svg><mask id="a" style="mask-type:luminance"></mask></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" lets the declaration override the attribute`, async () => {
  equal(
    normalizeMaskType(
      `<svg><mask id="a" mask-type="luminance" style="mask-type:alpha"></mask></svg>`,
    ),
    `<svg><mask id="a" mask-type="alpha" style="mask-type:alpha"/></svg>`,
  );
});

test(`"normalizeMaskType" leaves an attribute that already agrees`, async () => {
  const svg = `<svg><mask id="a" mask-type="alpha" style="mask-type:alpha"></mask></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" lowercases a CSS keyword`, async () => {
  equal(
    normalizeMaskType(`<svg><mask id="a" style="mask-type:Alpha"></mask></svg>`),
    `<svg><mask id="a" style="mask-type:Alpha" mask-type="alpha"/></svg>`,
  );
});

test(`"normalizeMaskType" handles nested masks`, async () => {
  equal(
    normalizeMaskType(
      `<svg><defs><g><mask id="a" style="mask-type:alpha"><use href="#b"/></mask></g></defs></svg>`,
    ),
    `<svg><defs><g><mask id="a" style="mask-type:alpha" mask-type="alpha"><use href="#b"/></mask></g></defs></svg>`,
  );
});

test(`"normalizeMaskType" lets the last of repeated declarations win`, async () => {
  equal(
    normalizeMaskType(
      `<svg><mask id="a" style="mask-type:luminance;mask-type:alpha"></mask></svg>`,
    ),
    `<svg><mask id="a" style="mask-type:luminance;mask-type:alpha" mask-type="alpha"/></svg>`,
  );
});

test(`"normalizeMaskType" returns untouched input verbatim`, async () => {
  const svg = `<svg><path d="M0 0h10v10z"/></svg>`;

  equal(normalizeMaskType(svg), svg);
});

test(`"normalizeMaskType" returns malformed input verbatim`, async () => {
  const svg = `<svg><mask style="mask-type:alpha`;

  equal(normalizeMaskType(svg), svg);
});
