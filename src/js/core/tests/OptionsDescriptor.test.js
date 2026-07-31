import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style, OptionsDescriptor } from '../lib/index.js';

const aliasFixture = {
  canvas: {
    width: 100,
    height: 100,
    elements: [
      { type: 'component', name: 'eyes' },
      { type: 'component', name: 'eyesRight' },
    ],
  },
  components: {
    eyes: {
      width: 20,
      height: 20,
      variants: {
        a: { elements: [] },
        b: { elements: [] },
      },
    },
    eyesRight: { extends: 'eyes' },
  },
};

const minimalStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
});

const fullStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  components: {
    eyes: {
      width: 100,
      height: 100,
      variants: {
        open: { elements: [] },
        closed: { elements: [] },
        wink: { elements: [] },
      },
    },
    mouth: {
      width: 100,
      height: 100,
      variants: {
        happy: { elements: [] },
        sad: { elements: [] },
      },
    },
  },
  colors: {
    skin: { values: ['#ff0000', '#00ff00'] },
    hair: { values: ['#000000'] },
    text: { values: ['#ffffff', '#000000'], contrastTo: 'background' },
  },
});

const taggedStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  components: {
    hair: {
      width: 100,
      height: 100,
      variants: {
        long: { elements: [], tags: ['hairLength:long', 'tone:cool'] },
        short: { elements: [], tags: ['hairLength:short', 'tone:warm'] },
      },
    },
    nose: {
      width: 100,
      height: 100,
      variants: {
        small: { elements: [] },
      },
    },
  },
});

describe('OptionsDescriptor', () => {
  describe('base options', () => {
    it('should include all base options', () => {
      const schema = new OptionsDescriptor(minimalStyle).toJSON();

      assert.deepEqual(schema.seed, { type: 'string' });
      assert.deepEqual(schema.size, { type: 'number', min: 1, max: 4096 });
      assert.deepEqual(schema.idRandomization, { type: 'boolean' });
      assert.deepEqual(schema.flip, { type: 'enum', values: ['none', 'horizontal', 'vertical', 'both'], list: true });
      assert.deepEqual(schema.scale, { type: 'range', min: 0, max: 10 });
      assert.deepEqual(schema.borderRadius, { type: 'range', min: 0, max: 50 });
      assert.deepEqual(schema.rotate, { type: 'range', min: -360, max: 360 });
      assert.deepEqual(schema.translateX, { type: 'range', min: -1000, max: 1000 });
      assert.deepEqual(schema.translateY, { type: 'range', min: -1000, max: 1000 });
      assert.deepEqual(schema.fontFamily, { type: 'string', list: true });
      assert.deepEqual(schema.fontWeight, { type: 'number', min: 1, max: 1000, list: true });
    });

    it('should always include background color options', () => {
      const schema = new OptionsDescriptor(minimalStyle).toJSON();

      assert.deepEqual(schema.backgroundColor, { type: 'color', list: true });
      assert.deepEqual(schema.backgroundColorFill, { type: 'enum', values: ['solid', 'linear', 'radial'], list: true });
      assert.deepEqual(schema.backgroundColorFillStops, { type: 'range', min: 2 });
      assert.deepEqual(schema.backgroundColorAngle, { type: 'range', min: -360, max: 360 });
    });
  });

  describe('component options', () => {
    it('should generate options for each component', () => {
      const schema = new OptionsDescriptor(fullStyle).toJSON();

      assert.ok('eyesVariant' in schema);
      assert.ok('eyesProbability' in schema);
      assert.ok(!('eyesRotate' in schema));
      assert.ok(!('eyesTranslateX' in schema));
      assert.ok(!('eyesTranslateY' in schema));
      assert.ok(!('eyesScale' in schema));
      assert.ok('mouthVariant' in schema);
    });

    it('should constrain root scale to 0-10', () => {
      const schema = new OptionsDescriptor(fullStyle).toJSON();

      assert.deepEqual(schema.scale, { type: 'range', min: 0, max: 10 });
    });

    it('should include sorted variant names', () => {
      const schema = new OptionsDescriptor(fullStyle).toJSON();

      assert.deepEqual(schema.eyesVariant, {
        type: 'enum',
        values: ['closed', 'open', 'wink'],
        list: true,
        weighted: true,
      });
    });

    it('should constrain probability to 0-100', () => {
      const schema = new OptionsDescriptor(fullStyle).toJSON();

      assert.deepEqual(schema.eyesProbability, { type: 'number', min: 0, max: 100 });
    });

    it('should not emit any options for alias components', () => {
      const schema = new OptionsDescriptor(new Style(aliasFixture)).toJSON();

      assert.ok(!('eyesRightVariant' in schema));
      assert.ok(!('eyesRightProbability' in schema));
      assert.ok(!('eyesRightRotate' in schema));
    });
  });

  describe('color options', () => {
    it('should generate options for each color', () => {
      const schema = new OptionsDescriptor(fullStyle).toJSON();

      assert.deepEqual(schema.skinColor, { type: 'color', list: true });
      assert.deepEqual(schema.hairColor, { type: 'color', list: true });
      assert.deepEqual(schema.skinColorFill, { type: 'enum', values: ['solid', 'linear', 'radial'], list: true });
    });

    it('should expose contrastTo on color fields when set', () => {
      const schema = new OptionsDescriptor(fullStyle).toJSON();

      assert.deepEqual(schema.textColor, {
        type: 'color',
        list: true,
        contrastTo: 'background',
      });
      assert.ok(!('contrastTo' in schema.skinColor));
    });
  });

  describe('tags', () => {
    it('should expose the sorted union of variant tags', () => {
      const schema = new OptionsDescriptor(taggedStyle).toJSON();

      assert.deepEqual(schema.tags, {
        type: 'enum',
        values: ['hairLength:long', 'hairLength:short', 'tone:cool', 'tone:warm'],
        list: true,
        open: true,
      });
    });

    it('should omit tags when no variant carries one', () => {
      assert.ok(!('tags' in new OptionsDescriptor(fullStyle).toJSON()));
      assert.ok(!('tags' in new OptionsDescriptor(minimalStyle).toJSON()));
    });
  });

  describe('caching', () => {
    it('should return structurally equal results on repeated calls', () => {
      const optionsSchema = new OptionsDescriptor(fullStyle);

      assert.deepEqual(optionsSchema.toJSON(), optionsSchema.toJSON());
    });

    it('should return independent copies', () => {
      const optionsSchema = new OptionsDescriptor(fullStyle);
      const a = optionsSchema.toJSON();
      const b = optionsSchema.toJSON();

      a.seed = { type: 'mutated' };

      assert.notDeepEqual(a.seed, b.seed);
    });
  });
});
