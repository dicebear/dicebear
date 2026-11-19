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

  describe('wellFormedDeep', () => {
    it('should replace in keys, values and array items at any depth', () => {
      const input = { ['k' + HIGH]: ['a' + LOW, { x: HIGH }], n: 1, b: true };

      assert.deepEqual(Text.wellFormedDeep(input), {
        'k�': ['a�', { x: '�' }],
        n: 1,
        b: true,
      });
    });

    it('should not change the input', () => {
      const input = { seed: HIGH, list: [LOW] };

      Text.wellFormedDeep(input);

      assert.deepEqual(input, { seed: HIGH, list: [LOW] });
    });

    it('should keep a "__proto__" key as a plain key', () => {
      const input = JSON.parse('{"__proto__": {"polluted": true}}');
      const result = Text.wellFormedDeep(input);

      assert.equal(Object.getPrototypeOf(result), Object.prototype);
      assert.deepEqual(Object.keys(result), ['__proto__']);
      assert.equal({}.polluted, undefined);
    });
  });

  describe('Options', () => {
    it('should read the options with lone surrogates replaced', () => {
      const options = new Options({ seed: 'Jo' + HIGH, title: LOW });

      assert.equal(options.seed(), 'Jo�');
      assert.equal(options.title(), '�');
    });
  });
});
