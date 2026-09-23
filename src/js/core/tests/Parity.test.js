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

import { Avatar, OptionsDescriptor, Style } from '../lib/index.js';
import { Prng } from '../lib/Prng.js';
import { Fnv1a } from '../lib/Prng/Fnv1a.js';
import { Mulberry32 } from '../lib/Prng/Mulberry32.js';
import { Number } from '../lib/Utils/Number.js';
import { Initials } from '../lib/Utils/Initials.js';
import { Color } from '../lib/Utils/Color.js';
import { ValidationError } from '../lib/Error/ValidationError.js';
import { CircularColorReferenceError } from '../lib/Error/CircularColorReferenceError.js';

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

describe('Parity / Initials', () => {
  // Initials.fromSeed must be byte-identical across ports; accented seeds
  // (ô/ü) and quote/@/CJK/emoji cases pin the @-strip, quote-strip, and
  // \p{L} word matching against per-language regex pitfalls.
  for (const entry of loadFixture('initials.json')) {
    it(`derives ${JSON.stringify(entry.seed)} → ${JSON.stringify(entry.result)}`, () => {
      assert.equal(Initials.fromSeed(entry.seed), entry.result);
    });
  }
});

describe('Parity / Color', () => {
  const colors = loadFixture('colors.json');

  for (const entry of colors.toHex) {
    it(`toHex ${entry.input}`, () => {
      assert.equal(Color.toHex(entry.input), entry.result);
    });
  }

  for (const entry of colors.toRgbHex) {
    it(`toRgbHex ${entry.input}`, () => {
      assert.equal(Color.toRgbHex(entry.input), entry.result);
    });
  }

  for (const entry of colors.parseHex) {
    it(`parseHex ${entry.input}`, () => {
      assert.deepEqual(Color.parseHex(entry.input), entry.result);
    });
  }

  for (const entry of colors.luminance) {
    it(`luminance ${entry.input}`, () => {
      assert.equal(Color.luminance(entry.input), entry.result);
    });
  }

  for (const [i, entry] of colors.sortByContrast.entries()) {
    it(`sortByContrast #${i}`, () => {
      assert.deepEqual(
        Color.sortByContrast(entry.candidates, entry.refColor),
        entry.result,
      );
    });
  }

  for (const [i, entry] of colors.filterNotEqualTo.entries()) {
    it(`filterNotEqualTo #${i}`, () => {
      assert.deepEqual(
        Color.filterNotEqualTo(entry.candidates, entry.excluded),
        entry.result,
      );
    });
  }
});

describe('Parity / Validation', () => {
  const validation = loadFixture('validation.json');
  const minimalStyle = new Style(
    validation.styles.find((e) => e.id === 'minimal').definition,
  );

  for (const entry of validation.styles) {
    it(`style ${entry.id}`, () => {
      if (entry.valid) {
        new Style(entry.definition);
      } else {
        assert.throws(() => new Style(entry.definition), ValidationError);
      }
    });
  }

  for (const entry of validation.options) {
    it(`options ${entry.id}`, () => {
      if (entry.valid) {
        new Avatar(minimalStyle, entry.options);
      } else {
        assert.throws(
          () => new Avatar(minimalStyle, entry.options),
          ValidationError,
        );
      }
    });
  }

  for (const entry of validation.circularColors) {
    it(`circular colors ${entry.id}`, () => {
      assert.throws(
        () => new Avatar(new Style(entry.style), entry.options),
        (e) => {
          assert.ok(e instanceof CircularColorReferenceError);
          assert.deepEqual(e.chain, entry.chain);

          return true;
        },
      );
    });
  }
});

describe('Parity / OptionsDescriptor', () => {
  const styleNames = readdirSync(join(fixturesDir, 'descriptors'))
    .filter((f) => f.endsWith('.json'))
    .map((f) => f.replace(/\.json$/, ''));

  for (const styleName of styleNames) {
    it(styleName, () => {
      const styleData = loadFixture(`styles/${styleName}.json`);
      const expected = loadFixture(`descriptors/${styleName}.json`);

      assert.deepEqual(
        new OptionsDescriptor(new Style(styleData)).toJSON(),
        expected,
      );
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
          const avatar = new Avatar(new Style(styleData), entry.options);
          const json = avatar.toJSON();
          assert.equal(json.svg, entry.svg);
          // Round-trip via JSON to drop `undefined` values (size/title),
          // mirroring what real consumers see after JSON.stringify.
          assert.deepEqual(
            JSON.parse(JSON.stringify(json.options)),
            entry.resolvedOptions,
          );

          // Only select cases carry a dataUri — it pins the percent-encoding
          // contract (encodeURIComponent) without bloating every fixture.
          if (entry.dataUri !== undefined) {
            assert.equal(avatar.toDataUri(), entry.dataUri);
          }
        });
      }
    });
  }
});
