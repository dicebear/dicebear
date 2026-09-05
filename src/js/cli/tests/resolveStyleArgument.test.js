import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveStyleArgument } from '../lib/utils/resolveStyleArgument.js';

describe('resolveStyleArgument', () => {
  it('returns the style right after the command word', () => {
    assert.equal(resolveStyleArgument(['create', 'lorelei']), 'lorelei');
    assert.equal(
      resolveStyleArgument(['create', 'my-style.json', '--count', '2']),
      'my-style.json',
    );
  });

  it('ignores flags and their values that precede the style', () => {
    assert.equal(
      resolveStyleArgument(['create', '--count', '2', '--seed', 'abc', 'lorelei']),
      'lorelei',
    );
    assert.notEqual(resolveStyleArgument(['create', '--count', '2', 'x.json']), '2');
  });

  it('ignores a boolean flag that precedes the style', () => {
    assert.equal(resolveStyleArgument(['create', '--json', 'lorelei']), 'lorelei');
    assert.equal(resolveStyleArgument(['create', '--exif', 'lorelei']), 'lorelei');
  });

  it('does not read the style as the value of --output', () => {
    assert.equal(
      resolveStyleArgument(['create', '-o', 'out.svg', 'lorelei']),
      'lorelei',
    );
    assert.equal(
      resolveStyleArgument(['create', '--output', 'out', 'lorelei']),
      'lorelei',
    );
  });

  it('returns undefined without a style', () => {
    assert.equal(resolveStyleArgument(['create']), undefined);
    assert.equal(resolveStyleArgument(['create', '--help']), undefined);
    assert.equal(resolveStyleArgument(['--version']), undefined);
    assert.equal(resolveStyleArgument([]), undefined);
  });

  it('returns undefined for the other commands', () => {
    assert.equal(
      resolveStyleArgument(['optimize', 'my-style.json']),
      undefined,
    );
    assert.equal(resolveStyleArgument(['compare', 'a.json', 'b.json']), undefined);
  });

  it('always returns a string for a numeric-looking argument', () => {
    assert.equal(resolveStyleArgument(['create', '42']), '42');
  });
});
