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

    it('should pass through what nests deeper than MAX_DEPTH levels', () => {
      const nest = (levels, leaf) =>
        Array.from({ length: levels }).reduce((inner) => [inner], leaf);

      // The string sits in the innermost array, one level below the root.
      const reached = { seed: nest(Text.MAX_DEPTH - 1, HIGH) };
      const tooDeep = { seed: nest(Text.MAX_DEPTH, HIGH) };

      assert.equal(
        JSON.stringify(Text.wellFormedDeep(reached)).includes('\\ud83d'),
        false,
      );
      assert.equal(
        JSON.stringify(Text.wellFormedDeep(tooDeep)).includes('\\ud83d'),
        true,
      );
    });

    it('should not overflow the stack on deep nesting', () => {
      const deep = JSON.parse(
        '{"seed":' + '['.repeat(5000) + ']'.repeat(5000) + '}',
      );

      assert.doesNotThrow(() => Text.wellFormedDeep(deep));
    });

    it('should stop at a value that contains itself', () => {
      const input = { seed: HIGH, list: [LOW] };
      input.a = input;
      input.b = input;
      input.list.push(input.list, input.list);

      const result = Text.wellFormedDeep(input);

      assert.equal(result.seed, '\ufffd');
      assert.equal(result.list[0], '\ufffd');
      assert.equal(result.a, input);
      assert.equal(result.list[1], input.list);
    });

    it('should walk a value that appears twice both times', () => {
      const shared = [HIGH];

      assert.deepEqual(Text.wellFormedDeep({ x: shared, y: shared }), {
        x: ['\ufffd'],
        y: ['\ufffd'],
      });
    });
  });

  describe('Options', () => {
    it('should keep a cyclic option the way structuredClone does', () => {
      const input = { seed: 'Jo' + HIGH, extra: {} };
      input.extra.self = input.extra;

      assert.equal(new Options(input).seed(), 'Jo\ufffd');
    });

    it('should read the options with lone surrogates replaced', () => {
      const options = new Options({ seed: 'Jo' + HIGH, title: LOW });

      assert.equal(options.seed(), 'Jo�');
      assert.equal(options.title(), '�');
    });
  });
});
