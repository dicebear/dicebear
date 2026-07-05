import { createAvatar } from '../lib/index.js';
import { test } from 'node:test';
import { ok } from 'node:assert/strict';

// `rotate` is typed as a number, but it still ends up inside an SVG attribute,
// so escape it like the other option values.

const style = {
  meta: {},
  schema: {},
  create: () => ({
    attributes: {
      viewBox: '-25 -25 100 100',
      version: '1.1',
    },
    body: `<rect width="25" height="25" fill="#00FFFF"/>`,
  }),
};

const PAYLOAD =
  '0)"/><image href="y" onerror="alert(document.domain)"/><g transform="rotate(0';

test('rotate value must be XML-escaped', () => {
  const svg = createAvatar(style, { seed: 'AB', rotate: PAYLOAD }).toString();

  ok(!svg.includes(PAYLOAD), `unescaped value found: ${svg}`);
  ok(!svg.includes('<image'), `unescaped element found: ${svg}`);
});

test('Valid rotate value is unchanged', () => {
  const svg = createAvatar(style, { seed: 'AB', rotate: 90 }).toString();

  ok(svg.includes('rotate(90,'), `expected rotate(90,...), got: ${svg}`);
});
