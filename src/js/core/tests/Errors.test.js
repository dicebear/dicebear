import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import * as root from '../lib/index.js';
import * as lite from '../lib/lite.js';

const definition = {
  canvas: { width: 100, height: 100, elements: [] },
};

describe('error classes', () => {
  it('should be exported from the package root', () => {
    for (const name of [
      'ValidationError',
      'StyleValidationError',
      'OptionsValidationError',
      'CircularColorReferenceError',
    ]) {
      assert.equal(typeof root[name], 'function', name);
    }
  });

  it('should be the same classes in the lite entry', () => {
    assert.equal(lite.ValidationError, root.ValidationError);
    assert.equal(lite.StyleValidationError, root.StyleValidationError);
    assert.equal(lite.OptionsValidationError, root.OptionsValidationError);
    assert.equal(
      lite.CircularColorReferenceError,
      root.CircularColorReferenceError,
    );
  });

  it('should let callers tell invalid options from an invalid definition', () => {
    assert.throws(
      () => new root.Style({ ...definition, unknownKey: true }),
      (error) =>
        error instanceof root.StyleValidationError &&
        error instanceof root.ValidationError &&
        error.details.length > 0,
    );

    assert.throws(
      () => new root.Avatar(new root.Style(definition), { scale: 999 }),
      (error) =>
        error instanceof root.OptionsValidationError &&
        error instanceof root.ValidationError &&
        error.details.some((detail) => detail.instancePath === '/scale'),
    );
  });

  it('should throw CircularColorReferenceError for a self-referencing color', () => {
    const fixtures = JSON.parse(
      readFileSync(
        join(
          import.meta.dirname,
          '../../../../tests/fixtures/parity/validation.json',
        ),
        'utf8',
      ),
    );
    const [entry] = fixtures.circularColors;

    assert.throws(
      () => new lite.Avatar(new lite.Style(entry.style), entry.options),
      (error) => error instanceof root.CircularColorReferenceError,
    );
  });
});

describe('options the other ports turn down or accept', () => {
  const style = new root.Style({
    canvas: {
      width: 10,
      height: 10,
      elements: [{ type: 'component', name: 'eyes' }],
    },
    components: {
      eyes: {
        width: 10,
        height: 10,
        variants: { a: { elements: [] }, b: { elements: [] } },
      },
    },
  });

  it('should reject a weight of Infinity, which JSON cannot carry', () => {
    assert.throws(
      () => new root.Avatar(style, { eyesVariant: { a: Infinity } }),
      (error) =>
        error instanceof root.OptionsValidationError &&
        error.details[0].instancePath === '/eyesVariant/a',
    );
  });

  it('should render the default avatar for null options', () => {
    assert.equal(
      new root.Avatar(style, null).toString(),
      new root.Avatar(style).toString(),
    );
  });
});
