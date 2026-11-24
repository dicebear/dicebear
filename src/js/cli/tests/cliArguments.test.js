import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { joinNegativeValues } from '../lib/utils/cliArguments.js';

describe('joinNegativeValues', () => {
  it('joins a long flag with a negative range', () => {
    assert.deepEqual(
      joinNegativeValues(['create', 'lorelei', '--rotate', '-10,10']),
      ['create', 'lorelei', '--rotate=-10,10'],
    );
  });

  it('joins negative decimals and plain negative numbers', () => {
    assert.deepEqual(
      joinNegativeValues([
        '--translateX',
        '-.5,-0.25',
        '--animationDelay',
        '-2',
      ]),
      ['--translateX=-.5,-0.25', '--animationDelay=-2'],
    );
  });

  it('leaves flags, short options and positive values alone', () => {
    const args = [
      'create',
      '-o',
      'out.svg',
      '--rotate',
      '10,20',
      '--json',
      'lorelei',
    ];

    assert.deepEqual(joinNegativeValues(args), args);
  });

  it('does not touch a flag that already carries its value', () => {
    assert.deepEqual(joinNegativeValues(['--rotate=-10,10', '-5']), [
      '--rotate=-10,10',
      '-5',
    ]);
  });

  it('does not join a following flag', () => {
    assert.deepEqual(joinNegativeValues(['--animation', '--help']), [
      '--animation',
      '--help',
    ]);
  });
});
