import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style } from '@dicebear/core';
import { getStyleCommandOptions } from '../lib/utils/getStyleCommandOptions.js';

const taggedStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  components: {
    hair: {
      width: 100,
      height: 100,
      variants: {
        long: { elements: [], tags: ['gender:female', 'hairLength:long'] },
        short: { elements: [], tags: ['gender:male', 'hairLength:short'] },
      },
    },
  },
});

describe('getStyleCommandOptions', () => {
  it('locks choices for a closed enum like flip', () => {
    const options = getStyleCommandOptions(taggedStyle);

    assert.deepEqual(options.flip.choices, [
      'none',
      'horizontal',
      'vertical',
      'both',
    ]);
  });

  it('does not lock choices for the open tags enum', () => {
    // tags is an open enum: its values are suggestions, and excludes (`!`) and
    // unknown tokens are valid input, so yargs must not reject them.
    const options = getStyleCommandOptions(taggedStyle);

    assert.ok(options.tags, 'tags option should be present for a tagged style');
    assert.equal(options.tags.type, 'string');
    assert.equal(options.tags.array, true);
    assert.equal(options.tags.choices, undefined);
  });
});
