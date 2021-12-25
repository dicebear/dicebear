import { create as createPrng } from '../../lib/utils/prng.js';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

test('Predictable PNGR integers', () => {
  const pngr = createPrng('test-seed-1');

  equal(pngr.integer(0, 10), 2);
  equal(pngr.integer(0, 10), 7);
  equal(pngr.integer(0, 10), 2);

  equal(pngr.integer(10, 20), 19);
  equal(pngr.integer(10, 20), 14);
  equal(pngr.integer(10, 20), 11);

  equal(pngr.integer(-1, 0), -1);
  equal(pngr.integer(0, 0), 0);
  equal(pngr.integer(1, 1), 1);
});

test('Predictable PNGR array values', () => {
  const pngr = createPrng('test-seed-2');
  const arr = ['A', 'B', 'C', 'D', 'E', 'F'];

  equal(pngr.pick(arr), 'A');
  equal(pngr.pick(arr), 'A');
  equal(pngr.pick(arr), 'E');
  equal(pngr.pick(arr), 'D');
  equal(pngr.pick(arr), 'F');
  equal(pngr.pick(arr), 'A');

  equal(pngr.pick(['A']), 'A');
  equal(pngr.pick([]), undefined);
});

test('Predictable PNGR booleans', () => {
  const pngr = createPrng('test-seed-3');

  equal(pngr.bool(100), true);
  equal(pngr.bool(100), true);
  equal(pngr.bool(100), true);

  equal(pngr.bool(75), true);
  equal(pngr.bool(75), true);
  equal(pngr.bool(75), false);

  equal(pngr.bool(50), true);
  equal(pngr.bool(50), true);
  equal(pngr.bool(50), false);

  equal(pngr.bool(25), true);
  equal(pngr.bool(25), true);
  equal(pngr.bool(25), false);

  equal(pngr.bool(0), false);
  equal(pngr.bool(0), false);
  equal(pngr.bool(0), false);
});

test.run();
