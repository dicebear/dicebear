import { createAvatar } from '@dicebear/core';
import * as style from '../lib/index.js';
import { test } from 'node:test';
import { ok } from 'node:assert/strict';

// `fontSize` and `fontWeight` are typed as numbers, but they still end up
// inside SVG attributes, so escape them like the other option values.

const PAYLOAD = '50" x="0" onload="alert(1)" data-x="';

test('fontSize value must be XML-escaped', () => {
  const svg = createAvatar(style, { seed: 'AB', fontSize: PAYLOAD }).toString();

  ok(!svg.includes(PAYLOAD), `unescaped value found: ${svg}`);
});

test('fontWeight value must be XML-escaped', () => {
  const svg = createAvatar(style, {
    seed: 'AB',
    fontWeight: PAYLOAD,
  }).toString();

  ok(!svg.includes(PAYLOAD), `unescaped value found: ${svg}`);
});

test('Valid fontSize is preserved', () => {
  const svg = createAvatar(style, { seed: 'AB', fontSize: 42 }).toString();

  ok(svg.includes('font-size="42"'), `expected font-size="42", got: ${svg}`);
});
