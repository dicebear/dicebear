import { create as createPrng } from '../../lib/utils/prng.js';
import { test } from 'uvu';
import { equal } from 'uvu/assert';

test('Balanced PRNG', () => {
  const prng = createPrng();

  const results = {
    0: 0,
    1: 0,
    2: 0,
    3: 0,
    4: 0,
  };

  for (let i = 0; i < 10000; i++) {
    results[prng.integer(0, 4)]++;
  }

  equal(results[0], 1947);
  equal(results[1], 1992);
  equal(results[2], 1974);
  equal(results[3], 2012);
  equal(results[4], 2075);
});

test('Predictable empty PRNG', () => {
  const prng = createPrng();

  equal(prng.bool(50), false);
  equal(prng.bool(50), false);
  equal(prng.bool(50), false);
  equal(prng.bool(50), true);
});

test('Predictable PRNG integers', () => {
  const prng = createPrng('test-seed-1');

  equal(prng.integer(0, 10), 2);
  equal(prng.integer(0, 10), 7);
  equal(prng.integer(0, 10), 2);

  equal(prng.integer(10, 20), 19);
  equal(prng.integer(10, 20), 14);
  equal(prng.integer(10, 20), 11);

  equal(prng.integer(-1, 0), -1);
  equal(prng.integer(0, 0), 0);
  equal(prng.integer(1, 1), 1);
});

test('Predictable PRNG array values', () => {
  const prng = createPrng('test-seed-2');
  const arr = ['A', 'B', 'C', 'D', 'E', 'F'];

  equal(prng.pick(arr), 'A');
  equal(prng.pick(arr), 'A');
  equal(prng.pick(arr), 'E');
  equal(prng.pick(arr), 'D');
  equal(prng.pick(arr), 'F');
  equal(prng.pick(arr), 'A');

  equal(prng.pick(['A']), 'A');
  equal(prng.pick([]), undefined);
});

test('Predictable PRNG booleans', () => {
  const prng = createPrng('test-seed-3');

  equal(prng.bool(100), true);
  equal(prng.bool(100), true);
  equal(prng.bool(100), true);

  equal(prng.bool(75), true);
  equal(prng.bool(75), true);
  equal(prng.bool(75), false);

  equal(prng.bool(50), true);
  equal(prng.bool(50), true);
  equal(prng.bool(50), false);

  equal(prng.bool(25), true);
  equal(prng.bool(25), true);
  equal(prng.bool(25), false);

  equal(prng.bool(0), false);
  equal(prng.bool(0), false);
  equal(prng.bool(0), false);
});

test.run();
