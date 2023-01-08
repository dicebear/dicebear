import { ensureSize } from '../../lib/utils/svg.js';
import * as fs from 'fs';
import * as path from 'path';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

test(`"ensureSize" without width and height`, async () => {
  equal(
    ensureSize(`<svg foo bar></svg>`, 100).svg,
    `<svg foo bar width="100" height="100"></svg>`
  );
});

test(`"ensureSize" with width and height`, async () => {
  equal(
    ensureSize(`<svg foo width="20" bar height="20"></svg>`, 100).svg,
    `<svg foo width="20" bar height="20"></svg>`
  );
});

test(`"ensureSize" with width only`, async () => {
  equal(
    ensureSize(`<svg foo width="20" bar></svg>`, 100).svg,
    `<svg foo width="20" bar height="20"></svg>`
  );
});

test(`"ensureSize" with height only`, async () => {
  equal(
    ensureSize(`<svg foo bar height="20"></svg>`, 100).svg,
    `<svg foo bar height="100" width="100"></svg>`
  );
});

test.run();
