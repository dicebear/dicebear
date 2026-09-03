import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Style, Avatar } from '../lib/index.js';
import { Style as LiteStyle, Avatar as LiteAvatar } from '../lib/lite.js';

const definition = {
  canvas: {
    width: 100,
    height: 100,
    elements: [
      {
        type: 'element',
        name: 'rect',
        attributes: { width: '100', height: '100', fill: '#abcdef' },
      },
    ],
  },
};

describe('lite entry', () => {
  it('should render the same SVG as the package root', () => {
    assert.equal(
      new LiteAvatar(new LiteStyle(definition), { seed: 'x' }).toString(),
      new Avatar(new Style(definition), { seed: 'x' }).toString(),
    );
  });

  it('should skip the definition check', () => {
    const extra = { ...definition, unknownKey: true };

    assert.throws(() => new Style(extra));
    assert.ok(new LiteStyle(extra));
  });

  it('should skip the options check', () => {
    const style = new LiteStyle(definition);

    assert.throws(() => new Avatar(style, { scale: 999 }));
    assert.ok(new LiteAvatar(style, { scale: 999 }));
  });

  it('should accept a root style in a lite avatar and the other way round', () => {
    assert.ok(new LiteAvatar(new Style(definition), { seed: 'x' }));
    assert.ok(new Avatar(new LiteStyle(definition), { seed: 'x' }));
  });

  it('should not reach a validator through its imports', () => {
    // Walk the static imports of the lite entry. A validator in the graph
    // would end up in every bundle built from it.
    const lib = resolve(dirname(fileURLToPath(import.meta.url)), '../lib');
    const seen = new Set();
    const queue = [resolve(lib, 'lite.js')];

    while (queue.length > 0) {
      const file = queue.pop();

      if (seen.has(file)) {
        continue;
      }

      seen.add(file);

      for (const match of readFileSync(file, 'utf-8').matchAll(
        /from '(\.[^']+)'/g,
      )) {
        queue.push(resolve(dirname(file), match[1]));
      }
    }

    const validators = [...seen].filter((file) => file.includes('/Validator/'));

    assert.deepEqual(validators, []);
  });
});
