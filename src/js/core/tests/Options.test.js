import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Options } from '../lib/Options.js';
import { OptionsValidator } from '../lib/Validator/OptionsValidator.js';
import { OptionsValidationError } from '../lib/Error/OptionsValidationError.js';
import { ValidationError } from '../lib/Error/ValidationError.js';

// The package root checks the options in `Avatar`, so the reader class itself
// no longer validates. These tests cover both steps together.
function validated(data = {}) {
  OptionsValidator.validate(data);

  return new Options(data);
}

describe('Options', () => {
  describe('constructor', () => {
    it('should accept an empty data object', () => {
      assert.ok(validated({}));
    });

    it('should accept full input data', () => {
      assert.ok(
        validated({
          seed: 'test-seed',
          size: 128,
          flip: 'horizontal',
          scale: 1.2,
        }),
      );
    });

    it('should throw OptionsValidationError for invalid data', () => {
      assert.throws(() => validated({ size: -1 }), OptionsValidationError);
    });

    it('should throw an instance of ValidationError', () => {
      assert.throws(() => validated({ size: -1 }), ValidationError);
    });

    it('should include details on the validation error', () => {
      try {
        validated({ size: -1 });
        assert.fail('Expected error');
      } catch (e) {
        assert.ok(e instanceof OptionsValidationError);
        assert.ok(Array.isArray(e.details));
        assert.ok(e.details.length > 0);
      }
    });

    it('should isolate internal state from caller mutations', () => {
      const input = { seed: 'orig' };
      const options = validated(input);

      input.seed = 'mutated';

      assert.equal(options.seed(), 'orig');
    });
  });

  describe('scalar passthroughs', () => {
    it('should return undefined when not set', () => {
      const options = validated({});

      assert.equal(options.seed(), undefined);
      assert.equal(options.size(), undefined);
      assert.equal(options.idRandomization(), undefined);
      assert.equal(options.title(), undefined);
    });

    it('should return user-set scalar values', () => {
      const options = validated({
        seed: 'abc',
        size: 256,
        idRandomization: true,
        title: 'My Avatar',
      });

      assert.equal(options.seed(), 'abc');
      assert.equal(options.size(), 256);
      assert.equal(options.idRandomization(), true);
      assert.equal(options.title(), 'My Avatar');
    });
  });

  describe('top-level normalization', () => {
    it('should normalize a scalar list option to a one-element array', () => {
      const options = validated({ flip: 'horizontal' });

      assert.deepEqual(options.flip(), ['horizontal']);
    });

    it('should pass a list option array through unchanged', () => {
      const options = validated({ flip: ['horizontal', 'vertical'] });

      assert.deepEqual(options.flip(), ['horizontal', 'vertical']);
    });

    it('should normalize a scalar range option to a fixed-value range', () => {
      const options = validated({ scale: 1.5 });

      assert.deepEqual(options.scale(), { min: 1.5, max: 1.5 });
    });

    it('should normalize a tuple range option to a min/max range', () => {
      const options = validated({ scale: [0.8, 1.2] });

      assert.deepEqual(options.scale(), { min: 0.8, max: 1.2 });
    });

    it('should treat a single-element range array as a fixed value', () => {
      // `[n]` behaves like the scalar `n`; an empty array is unset (default,
      // not a Range with a missing bound that would render as NaN).
      assert.deepEqual(validated({ scale: [2] }).scale(), { min: 2, max: 2 });
      assert.equal(validated({ scale: [] }).scale(), undefined);
    });

    it('should return undefined for unset range options', () => {
      const options = validated({});

      assert.equal(options.scale(), undefined);
      assert.equal(options.borderRadius(), undefined);
      assert.equal(options.rotate(), undefined);
      assert.equal(options.translateX(), undefined);
      assert.equal(options.translateY(), undefined);
    });

    it('should return empty arrays for unset list options', () => {
      const options = validated({});

      assert.deepEqual(options.flip(), []);
      assert.deepEqual(options.fontFamily(), []);
      assert.deepEqual(options.fontWeight(), []);
    });
  });

  describe('componentVariant()', () => {
    it('should return undefined when unset', () => {
      assert.equal(validated({}).componentVariant('eyes'), undefined);
    });

    it('should normalize a string to a single-entry weighted map', () => {
      const options = validated({ eyesVariant: 'open' });

      assert.deepEqual(options.componentVariant('eyes'), { open: 1 });
    });

    it('should normalize a string array to a weighted map (weight 1 each)', () => {
      const options = validated({ eyesVariant: ['open', 'closed'] });

      assert.deepEqual(options.componentVariant('eyes'), {
        open: 1,
        closed: 1,
      });
    });

    it('should pass a weighted record through', () => {
      const options = validated({ eyesVariant: { open: 5, closed: 1 } });

      assert.deepEqual(options.componentVariant('eyes'), {
        open: 5,
        closed: 1,
      });
    });
  });

  describe('componentProbability()', () => {
    it('should return undefined when unset', () => {
      assert.equal(validated({}).componentProbability('eyes'), undefined);
    });

    it('should return the user-set numeric value', () => {
      const options = validated({ eyesProbability: 80 });

      assert.equal(options.componentProbability('eyes'), 80);
    });
  });

  describe('color()', () => {
    it('should return undefined when unset', () => {
      assert.equal(validated({}).color('skin'), undefined);
    });

    it('should normalize a single hex color to a one-element array', () => {
      const options = validated({ skinColor: '#f0c8a0' });

      assert.deepEqual(options.color('skin'), ['#f0c8a0']);
    });

    it('should pass a color array through', () => {
      const options = validated({ skinColor: ['#f0c8a0', '#d4a574'] });

      assert.deepEqual(options.color('skin'), ['#f0c8a0', '#d4a574']);
    });
  });

  describe('colorFill / colorAngle / colorFillStops', () => {
    it('should normalize all three correctly', () => {
      const options = validated({
        skinColorFill: 'linear',
        skinColorAngle: 45,
        skinColorFillStops: [2, 4],
      });

      assert.deepEqual(options.colorFill('skin'), ['linear']);
      assert.deepEqual(options.colorAngle('skin'), { min: 45, max: 45 });
      assert.deepEqual(options.colorFillStops('skin'), { min: 2, max: 4 });
    });

    it('should return defaults when unset', () => {
      const options = validated({});

      assert.deepEqual(options.colorFill('skin'), []);
      assert.equal(options.colorAngle('skin'), undefined);
      assert.equal(options.colorFillStops('skin'), undefined);
    });
  });

  describe('colorOrder()', () => {
    it('should return undefined when unset', () => {
      assert.equal(validated({}).colorOrder('skin'), undefined);
    });

    it('should pass the value through', () => {
      const options = validated({ skinColorOrder: 'fixed' });

      assert.equal(options.colorOrder('skin'), 'fixed');
    });

    it('should reject an unknown value', () => {
      assert.throws(
        () => validated({ skinColorOrder: 'sorted' }),
        OptionsValidationError,
      );
    });

    it('should reject an array value', () => {
      assert.throws(
        () => validated({ skinColorOrder: ['fixed'] }),
        OptionsValidationError,
      );
    });
  });
});
