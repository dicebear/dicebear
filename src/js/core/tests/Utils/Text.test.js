import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Text } from '../../lib/Utils/Text.js';
import { Options } from '../../lib/Options.js';

const HIGH = String.fromCharCode(0xd83d);
const LOW = String.fromCharCode(0xde00);
const EMOJI = HIGH + LOW;

describe('Text', () => {
  describe('wellFormed', () => {
    it('should leave well-formed text as it is', () => {
      for (const value of ['', 'abc', 'Zoë', EMOJI, 'a' + EMOJI + 'b']) {
        assert.equal(Text.wellFormed(value), value);
      }
    });

    it('should replace a lone high or low surrogate', () => {
      assert.equal(Text.wellFormed(HIGH), '�');
      assert.equal(Text.wellFormed(LOW), '�');
      assert.equal(Text.wellFormed('Jo' + HIGH), 'Jo�');
      assert.equal(Text.wellFormed(LOW + 'Ann'), '�Ann');
    });

    it('should replace both halves of a reversed pair', () => {
      assert.equal(Text.wellFormed(LOW + HIGH), '��');
    });

    it('should keep a valid pair next to a lone surrogate', () => {
      assert.equal(Text.wellFormed(HIGH + EMOJI), '�' + EMOJI);
      assert.equal(Text.wellFormed(EMOJI + LOW), EMOJI + '�');
    });

    it('should match String.prototype.toWellFormed', () => {
      const units = [0x61, 0xd800, 0xdbff, 0xdc00, 0xdfff, 0xd83d, 0xde00];

      for (const a of units) {
        for (const b of units) {
          for (const c of units) {
            const value = String.fromCharCode(a, b, c);
            assert.equal(Text.wellFormed(value), value.toWellFormed());
          }
        }
      }
    });
  });

  describe('Options', () => {
    it('should read the seed and the title with lone surrogates replaced', () => {
      const options = new Options({ seed: 'Jo' + HIGH, title: LOW });

      assert.equal(options.seed(), 'Jo\ufffd');
      assert.equal(options.title(), '\ufffd');
    });

    it('should leave a well-formed seed and title as they are', () => {
      const options = new Options({ seed: 'Jo' + EMOJI, title: 'Zoë' });

      assert.equal(options.seed(), 'Jo' + EMOJI);
      assert.equal(options.title(), 'Zoë');
    });

    it('should read an absent seed and title as absent', () => {
      const options = new Options({});

      assert.equal(options.seed(), undefined);
      assert.equal(options.title(), undefined);
    });

    it('should not change the options it was given', () => {
      const input = { seed: HIGH };

      new Options(input).seed();

      assert.equal(input.seed, HIGH);
    });
  });
});
