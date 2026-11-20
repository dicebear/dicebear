import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Depth } from '../../lib/Utils/Depth.js';
import { Avatar, Style } from '../../lib/index.js';

const nest = (levels, leaf) => {
  let value = leaf;

  for (let i = 0; i < levels; i++) {
    value = [value];
  }

  return value;
};

const minimal = () => ({ canvas: { width: 100, height: 100, elements: [] } });

describe('Depth', () => {
  it('should count the value itself as the first level', () => {
    // The options object is level 1, so 63 arrays reach level 64.
    assert.equal(Depth.exceeds({ seed: nest(Depth.MAX - 1, 'x') }), false);
    assert.equal(Depth.exceeds({ seed: nest(Depth.MAX, 'x') }), true);
  });

  it('should find a value that contains itself', () => {
    const value = { seed: 'x' };
    value.self = value;

    assert.equal(Depth.exceeds(value), true);
  });

  it('should search a part shared many times once', () => {
    let shared = ['x'];

    // 2^50 paths if every reference were searched on its own.
    for (let i = 0; i < 50; i++) {
      shared = [shared, shared];
    }

    assert.equal(Depth.exceeds({ zzz: shared }), false);
  });

  it('should find a shared part that is too deep on one path', () => {
    // Met two levels down it ends on level 63, four levels down on level 65.
    const part = nest(Depth.MAX - 2, 'x');

    assert.equal(Depth.exceeds({ a: part }), false);
    assert.equal(Depth.exceeds({ a: part, b: [[part]] }), true);
    assert.equal(Depth.exceeds({ b: [[part]], a: part }), true);
  });

  it('should turn down deeply nested options as invalid options', () => {
    const style = new Style(minimal());

    for (const key of ['seed', 'backgroundColor', 'zzz']) {
      assert.throws(
        () => new Avatar(style, { [key]: nest(5000, 'x') }),
        (error) =>
          error.name === 'OptionsValidationError' &&
          error.message.includes('nesting'),
        key,
      );
    }
  });

  it('should turn down a deeply nested style definition as invalid', () => {
    const definition = minimal();
    definition.canvas.width = nest(5000, 'x');

    assert.throws(
      () => new Style(definition),
      (error) =>
        error.name === 'StyleValidationError' &&
        error.message.includes('nesting'),
    );
  });
});
