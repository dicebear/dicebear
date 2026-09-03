import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style, Avatar } from '../lib/index.js';

const minimalStyleData = {
  canvas: { width: 100, height: 100, elements: [] },
};

const minimalStyle = new Style(minimalStyleData);

describe('Avatar', () => {
  describe('constructor', () => {
    it('should accept Style instance and raw options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(avatar instanceof Avatar);
    });

    it('should reject a raw style definition', () => {
      assert.throws(
        () => new Avatar(minimalStyleData, { seed: 'test' }),
        (error) =>
          error instanceof TypeError &&
          /new Style\(definition\)/.test(error.message),
      );
    });

    it('should accept raw style data and raw options', () => {
      const avatar = new Avatar(new Style(minimalStyleData), { seed: 'test' });

      assert.ok(avatar instanceof Avatar);
    });

    it('should work without options', () => {
      const avatar = new Avatar(minimalStyle);

      assert.ok(avatar instanceof Avatar);
    });
  });

  describe('toString()', () => {
    it('should return a string', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.equal(typeof avatar.toString(), 'string');
    });
  });

  describe('toJSON()', () => {
    it('should return an object with svg and options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });
      const json = avatar.toJSON();

      assert.equal(typeof json.svg, 'string');
      assert.ok(json.options !== null && typeof json.options === 'object');
    });

    it('should have consistent svg with toString()', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.equal(avatar.toJSON().svg, avatar.toString());
    });

    it('should return a deep copy of options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });
      const json1 = avatar.toJSON();
      const json2 = avatar.toJSON();

      json1.options.injected = 'modified';

      assert.equal('injected' in json2.options, false);
    });

    it('should not include the seed in options', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(!('seed' in avatar.toJSON().options));
    });
  });

  describe('toDataUri()', () => {
    it('should return a data URI string', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(
        avatar.toDataUri().startsWith('data:image/svg+xml;charset=utf-8,'),
      );
    });

    it('should contain the encoded SVG', () => {
      const avatar = new Avatar(minimalStyle, { seed: 'test' });

      assert.ok(
        avatar.toDataUri().includes(encodeURIComponent(avatar.toString())),
      );
    });
  });
});
