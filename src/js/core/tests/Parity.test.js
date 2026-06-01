// Cross-language parity tests. Reads the shared fixtures at
// tests/fixtures/parity/ and asserts that the JS implementation produces
// exactly the values committed there. The PHP test suite at
// src/php/core/tests/ParityTest.php reads the same fixtures and runs the
// equivalent assertions, so any divergence between the two implementations
// will surface as a failure on whichever side drifts.
//
// To regenerate the fixtures: `npm run fixtures:parity` (from repo root).

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

import { Avatar } from '../lib/index.js';
import { Prng } from '../lib/Prng.js';
import { Fnv1a } from '../lib/Prng/Fnv1a.js';
import { Mulberry32 } from '../lib/Prng/Mulberry32.js';
import { Number } from '../lib/Utils/Number.js';

const fixturesDir = join(import.meta.dirname, '..', '..', '..', '..', 'tests', 'fixtures', 'parity');

function loadFixture(relPath) {
  return JSON.parse(readFileSync(join(fixturesDir, relPath), 'utf8'));
}

describe('Parity / Fnv1a', () => {
  for (const entry of loadFixture('fnv1a.json')) {
    it(`hashes ${JSON.stringify(entry.input)}`, () => {
      assert.equal(Fnv1a.hash(entry.input), entry.hash);
      assert.equal(Fnv1a.hex(entry.input), entry.hex);
    });
  }
});

describe('Parity / Mulberry32', () => {
  for (const entry of loadFixture('mulberry32.json')) {
    it(`produces sequence for seed ${entry.seed}`, () => {
      const m = new Mulberry32(entry.seed);
      for (const expected of entry.sequence) {
        const float = m.nextFloat();
        const state = m.state();
        assert.equal(float, expected.float);
        assert.equal(state, expected.state);
      }
    });
  }
});

describe('Parity / Prng', () => {
  const fixture = loadFixture('prng.json');

  describe('getValue', () => {
    for (const c of fixture.getValue) {
      it(`seed=${JSON.stringify(c.seed)} key=${JSON.stringify(c.key)}`, () => {
        assert.equal(new Prng(c.seed).getValue(c.key), c.result);
      });
    }
  });

  describe('pick', () => {
    for (const [i, c] of fixture.pick.entries()) {
      it(`#${i} seed=${JSON.stringify(c.seed)} key=${JSON.stringify(c.key)}`, () => {
        assert.equal(new Prng(c.seed).pick(c.key, c.items), c.result);
      });
    }
  });

  describe('weightedPick', () => {
    for (const [i, c] of fixture.weightedPick.entries()) {
      it(`#${i} seed=${JSON.stringify(c.seed)} key=${JSON.stringify(c.key)}`, () => {
        assert.equal(new Prng(c.seed).weightedPick(c.key, c.weights), c.result);
      });
    }
  });

  describe('bool', () => {
    for (const [i, c] of fixture.bool.entries()) {
      it(`#${i} seed=${JSON.stringify(c.seed)} likelihood=${c.likelihood}`, () => {
        assert.equal(new Prng(c.seed).bool(c.key, c.likelihood), c.result);
      });
    }
  });

  describe('float', () => {
    for (const [i, c] of fixture.float.entries()) {
      it(`#${i} range=${JSON.stringify(c.range)}`, () => {
        assert.equal(new Prng(c.seed).float(c.key, c.range), c.result);
      });
    }
  });

  describe('integer', () => {
    for (const [i, c] of fixture.integer.entries()) {
      it(`#${i} range=${JSON.stringify(c.range)}`, () => {
        assert.equal(new Prng(c.seed).integer(c.key, c.range), c.result);
      });
    }
  });

  describe('shuffle', () => {
    for (const [i, c] of fixture.shuffle.entries()) {
      it(`#${i} length=${c.items.length}`, () => {
        assert.deepEqual(new Prng(c.seed).shuffle(c.key, c.items), c.result);
      });
    }
  });
});

describe('Parity / Numbers', () => {
  // The renderer formats every numeric attribute via Number.format (rounded to
  // 5 decimals); this pins that contract so the PHP/Python ports stay identical.
  for (const entry of loadFixture('numbers.json')) {
    it(`formats ${entry.output}`, () => {
      assert.equal(Number.format(entry.input), entry.output);
    });
  }
});

describe('Parity / Avatar', () => {
  const styleNames = readdirSync(join(fixturesDir, 'avatars'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));

  for (const styleName of styleNames) {
    describe(styleName, () => {
      const styleData = loadFixture(`styles/${styleName}.json`);
      const cases = loadFixture(`avatars/${styleName}.json`);

      for (const entry of cases) {
        it(entry.id, () => {
          const json = new Avatar(styleData, entry.options).toJSON();
          assert.equal(json.svg, entry.svg);
          // Round-trip via JSON to drop `undefined` values (size/title),
          // mirroring what real consumers see after JSON.stringify.
          assert.deepEqual(
            JSON.parse(JSON.stringify(json.options)),
            entry.resolvedOptions,
          );
        });
      }
    });
  }
});
