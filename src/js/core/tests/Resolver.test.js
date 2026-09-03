import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style } from '../lib/index.js';
import { Options } from '../lib/Options.js';
import { Resolver } from '../lib/Resolver.js';
import { CircularColorReferenceError } from '../lib/Error/CircularColorReferenceError.js';

const makeResolver = (style, data = {}) => new Resolver(style, new Options(data));

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
        c: { elements: [] },
        d: { elements: [] },
        e: { elements: [] },
      },
    },
    eyesRight: { extends: 'eyes' },
  },
};

const minimalStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
});

const styleWithComponents = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  components: {
    eyes: {
      width: 50,
      height: 50,
      variants: {
        open: { elements: [] },
        closed: { elements: [] },
        wink: { elements: [] },
      },
    },
  },
});

const styleWithColors = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  colors: {
    skin: {
      values: ['#f0c8a0', '#d4a574', '#8d5524'],
    },
    hair: {
      values: ['#2c1b18', '#b55239', '#d6b370'],
      notEqualTo: ['skin'],
    },
    background: {
      values: ['#ffffff', '#000000', '#cccccc'],
      contrastTo: 'skin',
    },
  },
});

const styleWithWeights = new Style({
  canvas: { width: 100, height: 100, elements: [] },
  components: {
    eyes: {
      width: 50,
      height: 50,
      variants: {
        common: { elements: [], weight: 10 },
        rare: { elements: [], weight: 1 },
        hidden: { elements: [], weight: 0 },
      },
    },
  },
});

const minimal = {};

const full = {
  seed: 'test-seed',
  size: 128,
  idRandomization: true,
  flip: ['horizontal', 'vertical'],
  fontFamily: ['Arial', 'Helvetica'],
  fontWeight: [400, 700],
  scale: [0.8, 1.2],
  borderRadius: [0, 50],
  eyesProbability: 80,
  eyesVariant: ['open', 'closed', 'wink'],
  skinColor: ['#f0c8a0', '#d4a574'],
  rotate: [-15, 15],
  translateX: [-5, 5],
  translateY: [-2, 2],
};

describe('Resolver', () => {
  describe('constructor', () => {
    it('should accept minimal options', () => {
      const resolver = makeResolver(minimalStyle, minimal);

      assert.ok(resolver);
    });

    it('should accept full options', () => {
      const resolver = makeResolver(minimalStyle, full);

      assert.ok(resolver);
    });
  });

  describe('defaults', () => {
    it('should return defaults for unset properties', () => {
      const resolver = makeResolver(minimalStyle, minimal);

      assert.equal(resolver.seed(), '');
      assert.equal(resolver.size(), undefined);
      assert.equal(resolver.idRandomization(), false);
      assert.equal(resolver.flip(), 'none');
      assert.equal(resolver.fontFamily(), 'system-ui');
      assert.equal(resolver.fontWeight(), 400);
      assert.equal(resolver.scale(), 1);
      assert.equal(resolver.borderRadius(), 0);
    });

    it('should return defaults for pattern properties', () => {
      const resolver = makeResolver(minimalStyle, minimal);

      assert.equal(resolver.variant('eyes'), undefined);
      assert.deepEqual(resolver.color('skin'), []);
      assert.equal(resolver.colorFill('skin'), 'solid');
      assert.equal(resolver.rotate(), 0);
      assert.equal(resolver.translateX(), 0);
      assert.equal(resolver.translateY(), 0);
    });
  });

  describe('single values', () => {
    it('should return single values as-is', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'my-seed',
        size: 256,
        idRandomization: true,
        flip: 'horizontal',
        fontFamily: 'Arial',
        fontWeight: 700,
        scale: 1.5,
        borderRadius: 25,
      });

      assert.equal(resolver.seed(), 'my-seed');
      assert.equal(resolver.size(), 256);
      assert.equal(resolver.idRandomization(), true);
      assert.equal(resolver.flip(), 'horizontal');
      assert.equal(resolver.fontFamily(), 'Arial');
      assert.equal(resolver.fontWeight(), 700);
      assert.equal(resolver.scale(), 1.5);
      assert.equal(resolver.borderRadius(), 25);
    });

    it('should return single pattern property values as-is', () => {
      const resolver = makeResolver(minimalStyle, {
        eyesProbability: 80,
        eyesVariant: 'open',
        skinColor: '#f0c8a0',
        rotate: 45,
        translateX: 5,
        translateY: -3,
      });

      assert.equal(resolver.variant('eyes'), undefined);
      assert.deepEqual(resolver.color('skin'), ['#f0c8a0']);
      assert.equal(resolver.rotate(), 45);
      assert.equal(resolver.translateX(), 5);
      assert.equal(resolver.translateY(), -3);
    });
  });

  describe('PRNG resolution', () => {
    it('should be deterministic for the same seed', () => {
      const a = makeResolver(minimalStyle, full);
      const b = makeResolver(minimalStyle, full);

      assert.equal(a.flip(), b.flip());
      assert.equal(a.fontFamily(), b.fontFamily());
      assert.equal(a.fontWeight(), b.fontWeight());
      assert.equal(a.scale(), b.scale());
      assert.equal(a.borderRadius(), b.borderRadius());
      assert.equal(a.variant('eyes'), b.variant('eyes'));
      assert.deepEqual(a.color('skin'), b.color('skin'));
      assert.equal(a.rotate(), b.rotate());
      assert.equal(a.translateX(), b.translateX());
    });

    it('should produce different results for different seeds', () => {
      const a = makeResolver(minimalStyle, { ...full, seed: 'seed-a' });
      const b = makeResolver(minimalStyle, { ...full, seed: 'seed-b' });

      const results = [
        a.flip() !== b.flip(),
        a.fontFamily() !== b.fontFamily(),
        a.scale() !== b.scale(),
        a.rotate() !== b.rotate(),
        a.variant('eyes') !== b.variant('eyes'),
      ];

      assert.ok(results.some(Boolean));
    });

    it('should pick from arrays', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'pick-test',
        flip: ['horizontal', 'vertical'],
        eyesVariant: ['open', 'closed', 'wink'],
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
      });

      assert.ok(['horizontal', 'vertical'].includes(resolver.flip()));
      assert.equal(resolver.variant('eyes'), undefined);
      assert.equal(resolver.color('skin').length, 1);
      assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(resolver.color('skin')[0]));
    });

    it('should pick colorFill from arrays', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'fill-test',
        skinColorFill: ['solid', 'linear', 'radial'],
      });

      assert.ok(['solid', 'linear', 'radial'].includes(resolver.colorFill('skin')));
    });

    it('should return colorFillStops colors for gradient fills', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'gradient-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'linear',
        skinColorFillStops: 2,
      });

      const colors = resolver.color('skin');

      assert.equal(colors.length, 2);

      for (const c of colors) {
        assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(c));
      }
    });

    it('should default to 2 stops for gradient fills', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'gradient-default-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'radial',
      });

      assert.equal(resolver.color('skin').length, 2);
    });

    it('should return single color for solid fill', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'solid-test',
        skinColor: ['#f0c8a0', '#d4a574', '#8d5524'],
        skinColorFill: 'solid',
      });

      const colors = resolver.color('skin');

      assert.equal(colors.length, 1);
      assert.ok(['#f0c8a0', '#d4a574', '#8d5524'].includes(colors[0]));
    });

    it('should interpolate ranges', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'range-test',
        scale: [0.8, 1.2],
        borderRadius: [0, 50],
        rotate: [-15, 15],
        translateX: [-5, 5],
      });

      assert.ok(resolver.scale() >= 0.8 && resolver.scale() <= 1.2);
      assert.ok(resolver.borderRadius() >= 0 && resolver.borderRadius() <= 50);
      assert.ok(resolver.rotate() >= -15 && resolver.rotate() <= 15);
      assert.ok(resolver.translateX() >= -5 && resolver.translateX() <= 5);
    });

    it('should pick from fontWeight array (not interpolate)', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'fw-test',
        fontWeight: [400, 700],
      });

      assert.ok([400, 700].includes(resolver.fontWeight()));
    });
  });

  describe('probability / visibility', () => {
    it('should return variant when probability is 100', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'visible-test',
        eyesProbability: 100,
      });

      assert.ok(resolver.variant('eyes'));
    });

    it('should return undefined variant when probability is 0', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'hidden-test',
        eyesProbability: 0,
      });

      assert.equal(resolver.variant('eyes'), undefined);
    });

    it('should return variant when probability is not set', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'default-visible-test',
      });

      assert.ok(resolver.variant('eyes'));
    });
  });

  describe('colorFillStops via color()', () => {
    it('should respect custom stops count', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'stops-test',
        skinColor: ['#ff0000', '#00ff00', '#0000ff', '#ffffff'],
        skinColorFill: 'linear',
        skinColorFillStops: 3,
      });

      assert.equal(resolver.color('skin').length, 3);
    });

    it('should pick integer stops from range', () => {
      for (let i = 0; i < 20; i++) {
        const resolver = makeResolver(minimalStyle, {
          seed: `stops-${i}`,
          skinColor: ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'],
          skinColorFill: 'radial',
          skinColorFillStops: [2, 4],
        });

        const count = resolver.color('skin').length;

        assert.ok(count >= 2 && count <= 4);
      }
    });
  });

  describe('colorOrder', () => {
    it('should default to random', () => {
      const resolver = makeResolver(minimalStyle, { seed: 'order-default' });

      assert.equal(resolver.colorOrder('skin'), 'random');
    });

    it('should keep the given order for gradient fills when fixed', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'order-fixed',
        skinColor: ['#0055a4', '#ffffff', '#ef4135'],
        skinColorFill: 'linear',
        skinColorOrder: 'fixed',
      });

      assert.deepEqual(resolver.color('skin'), [
        '#0055a4',
        '#ffffff',
        '#ef4135',
      ]);
    });

    it('should keep the order for every seed', () => {
      for (let i = 0; i < 20; i++) {
        const resolver = makeResolver(minimalStyle, {
          seed: `order-fixed-${i}`,
          skinColor: ['#0055a4', '#ffffff', '#ef4135'],
          skinColorFill: 'linear',
          skinColorOrder: 'fixed',
        });

        assert.deepEqual(resolver.color('skin'), [
          '#0055a4',
          '#ffffff',
          '#ef4135',
        ]);
      }
    });

    it('should default the stop count to the number of colors when fixed', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'order-stops',
        skinColor: ['#ff0000', '#00ff00', '#0000ff', '#ffffff'],
        skinColorFill: 'linear',
        skinColorOrder: 'fixed',
      });

      assert.equal(resolver.color('skin').length, 4);
    });

    it('should respect an explicit stop count when fixed', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'order-explicit-stops',
        skinColor: ['#0055a4', '#ffffff', '#ef4135'],
        skinColorFill: 'linear',
        skinColorFillStops: 2,
        skinColorOrder: 'fixed',
      });

      assert.deepEqual(resolver.color('skin'), ['#0055a4', '#ffffff']);
    });

    it('should always use the first color for solid fills when fixed', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'order-solid',
        skinColor: ['#ef4135', '#0055a4'],
        skinColorOrder: 'fixed',
      });

      assert.deepEqual(resolver.color('skin'), ['#ef4135']);
    });

    it('should skip contrast sorting when fixed', () => {
      // background.contrastTo = skin: by default the strongest-contrast
      // candidate comes first, with a fixed order the user's first color wins.
      const options = {
        seed: 'order-contrast',
        skinColor: '#000000',
        backgroundColor: ['#111111', '#ffffff'],
      };

      const control = makeResolver(styleWithColors, options);
      const fixed = makeResolver(styleWithColors, {
        ...options,
        backgroundColorOrder: 'fixed',
      });

      assert.deepEqual(control.color('background'), ['#ffffff']);
      assert.deepEqual(fixed.color('background'), ['#111111']);
    });

    it('should still apply notEqualTo filtering when fixed', () => {
      // hair.notEqualTo = skin
      const resolver = makeResolver(styleWithColors, {
        seed: 'order-not-equal',
        skinColor: '#2c1b18',
        hairColor: ['#2c1b18', '#b55239', '#d6b370'],
        hairColorFill: 'linear',
        hairColorOrder: 'fixed',
      });

      assert.deepEqual(resolver.color('hair'), ['#b55239', '#d6b370']);
    });

    it('should sort a style palette instead of taking it verbatim', () => {
      // Without user-supplied colors, 'fixed' only skips the shuffle: the
      // style palette keeps the canonical code-point sort, for every seed.
      for (let i = 0; i < 5; i++) {
        const resolver = makeResolver(styleWithColors, {
          seed: `order-style-${i}`,
          skinColorFill: 'linear',
          skinColorFillStops: 3,
          skinColorOrder: 'fixed',
        });

        assert.deepEqual(resolver.color('skin'), [
          '#8d5524',
          '#d4a574',
          '#f0c8a0',
        ]);
      }
    });

    it('should keep contrast sorting for a style palette when fixed', () => {
      // background.contrastTo = skin and no user-supplied background colors:
      // the strongest-contrast candidate still comes first.
      const resolver = makeResolver(styleWithColors, {
        seed: 'order-style-contrast',
        skinColor: '#000000',
        backgroundColorOrder: 'fixed',
      });

      assert.deepEqual(resolver.color('background'), ['#ffffff']);
    });

    it('should keep the default of 2 stops for a style palette when fixed', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'order-style-stops',
        skinColorFill: 'linear',
        skinColorOrder: 'fixed',
      });

      assert.deepEqual(resolver.color('skin'), ['#8d5524', '#d4a574']);
    });
  });

  describe('componentTransform()', () => {
    it('should default to identity transform when component has no definition ranges', () => {
      const resolver = makeResolver(styleWithComponents, { seed: 'identity' });
      const t = resolver.componentTransform('eyes');

      assert.equal(t.rotate, 0);
      assert.equal(t.translateX, 0);
      assert.equal(t.translateY, 0);
      assert.equal(t.scale, 1);
    });

    it('should draw rotate from the component definition range', () => {
      const styleWithRotate = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          eyes: {
            width: 50,
            height: 50,
            rotate: { min: -10, max: 10 },
            variants: { open: { elements: [] } },
          },
        },
      });
      const resolver = makeResolver(styleWithRotate, { seed: 'rotate' });
      const t = resolver.componentTransform('eyes');

      assert.ok(t.rotate >= -10 && t.rotate <= 10);
    });

    it('should be deterministic for the same seed', () => {
      const a = makeResolver(styleWithComponents, { seed: 'pick' });
      const b = makeResolver(styleWithComponents, { seed: 'pick' });

      assert.deepEqual(a.componentTransform('eyes'), b.componentTransform('eyes'));
    });

    it('should return identity for an unknown component name', () => {
      const resolver = makeResolver(minimalStyle, { seed: 'unknown' });
      const t = resolver.componentTransform('missing');

      assert.equal(t.rotate, 0);
      assert.equal(t.translateX, 0);
      assert.equal(t.translateY, 0);
      assert.equal(t.scale, 1);
    });
  });

  describe('component aliases', () => {
    const aliasStyle = new Style(aliasFixture);

    it('should silently ignore user options keyed against an alias component', () => {
      const resolver = makeResolver(aliasStyle, {
        seed: 'alias-key-ignored',
        eyesVariant: 'a',
        eyesRightVariant: 'b',
      });

      assert.equal(resolver.variant('eyes'), 'a');
      assert.equal(resolver.variant('eyesRight'), 'a');
    });

    it('should propagate the source probability to the alias', () => {
      const resolver = makeResolver(aliasStyle, {
        seed: 'alias-probability',
        eyesProbability: 0,
      });

      assert.equal(resolver.variant('eyes'), undefined);
      assert.equal(resolver.variant('eyesRight'), undefined);
    });

    it('should resolve the alias variant via the source component variants', () => {
      const resolver = makeResolver(aliasStyle, { seed: 'alias-variant' });
      const result = resolver.variant('eyesRight');

      const sourceVariants = aliasStyle
        .components()
        .get('eyes')
        .variants();

      assert.ok(sourceVariants.has(result));
    });
  });

  describe('variant constraints', () => {
    it('should only pick from style-defined variants', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'variant-test',
        eyesVariant: ['open', 'closed', 'invalid'],
      });

      const result = resolver.variant('eyes');

      assert.ok(result);
      assert.ok(['open', 'closed', 'wink'].includes(result));
      assert.notEqual(result, 'invalid');
    });

    it('should return undefined when no user variants match', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'fallback-test',
        eyesVariant: ['invalid1', 'invalid2'],
      });

      assert.equal(resolver.variant('eyes'), undefined);
    });

    it('should yield undefined variant for an empty variant array', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'empty-test',
        eyesVariant: [],
      });

      assert.equal(resolver.variant('eyes'), undefined);
    });

    it('should pick from style variants when no option is set', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'default-test',
      });

      const result = resolver.variant('eyes');

      assert.ok(result);
      assert.ok(['open', 'closed', 'wink'].includes(result));
    });

    it('should return undefined when component does not exist in style', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'no-component-test',
        eyesVariant: 'open',
      });

      assert.equal(resolver.variant('eyes'), undefined);
    });
  });

  describe('color constraints', () => {
    it('should sort by contrast when contrastTo is set', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'contrast-test',
        skinColor: '#f0c8a0',
        backgroundColor: ['#ffffff', '#000000', '#cccccc'],
      });

      const colors = resolver.color('background');

      assert.equal(colors.length, 1);
      assert.equal(colors[0], '#000000');
    });

    it('should filter colors matching notEqualTo references', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'not-equal-test',
        skinColor: '#f0c8a0',
        hairColor: ['#f0c8a0', '#2c1b18', '#b55239'],
      });

      const colors = resolver.color('hair');

      assert.equal(colors.length, 1);
      assert.notEqual(colors[0], '#f0c8a0');
    });

    it('should ignore notEqualTo when all colors would be filtered', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'all-filtered-test',
        skinColor: '#f0c8a0',
        hairColor: ['#f0c8a0'],
      });

      const colors = resolver.color('hair');

      assert.equal(colors.length, 1);
      assert.equal(colors[0], '#f0c8a0');
    });

    it('should cache color results', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'cache-test',
        skinColor: ['#f0c8a0', '#d4a574'],
      });

      assert.equal(resolver.color('skin'), resolver.color('skin'));
    });

    it('should handle colors without style definition', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'no-style-test',
        customColor: ['#ff0000', '#00ff00'],
      });

      const colors = resolver.color('custom');

      assert.equal(colors.length, 1);
      assert.ok(['#ff0000', '#00ff00'].includes(colors[0]));
    });

    it('should throw CircularColorReferenceError on circular contrastTo', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        colors: {
          a: { values: ['#ff0000', '#00ff00'], contrastTo: 'b' },
          b: { values: ['#0000ff', '#ffffff'], contrastTo: 'a' },
        },
      });

      const resolver = makeResolver(style, {
        seed: 'circular-test',
        aColor: ['#ff0000', '#00ff00'],
        bColor: ['#0000ff', '#ffffff'],
      });

      try {
        resolver.color('a');
        assert.fail('Expected error');
      } catch (e) {
        assert.ok(e instanceof CircularColorReferenceError);
        assert.deepEqual(e.chain, ['a', 'b', 'a']);
        assert.ok(e.message.includes('a → b → a'));
      }
    });

    it('should throw CircularColorReferenceError on circular notEqualTo', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        colors: {
          a: { values: ['#ff0000'], notEqualTo: ['b'] },
          b: { values: ['#00ff00'], notEqualTo: ['a'] },
        },
      });

      const resolver = makeResolver(style, {
        seed: 'circular-not-equal-test',
        aColor: ['#ff0000'],
        bColor: ['#00ff00'],
      });

      try {
        resolver.color('a');
        assert.fail('Expected error');
      } catch (e) {
        assert.ok(e instanceof CircularColorReferenceError);
        assert.deepEqual(e.chain, ['a', 'b', 'a']);
        assert.ok(e.message.includes('a → b → a'));
      }
    });
  });

  describe('resolved()', () => {
    it('should include consumed values', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'test',
        flip: ['horizontal', 'vertical'],
        scale: [0.5, 1],
      });

      resolver.seed();
      resolver.flip();
      resolver.scale();

      const resolved = resolver.resolved();

      assert.ok(['horizontal', 'vertical', 'none'].includes(resolved.flip));
      assert.equal(typeof resolved.scale, 'number');
    });

    it('should not include the seed', () => {
      const resolver = makeResolver(minimalStyle, { seed: 'test' });

      resolver.seed();

      assert.ok(!('seed' in resolver.resolved()));
    });

    it('should include variant values', () => {
      const resolver = makeResolver(styleWithComponents, {
        seed: 'test',
        eyesVariant: ['open', 'closed'],
      });

      resolver.variant('eyes');

      const resolved = resolver.resolved();

      assert.ok('eyesVariant' in resolved);
      assert.ok(['open', 'closed', 'wink'].includes(resolved.eyesVariant));
    });

    it('should include color values', () => {
      const resolver = makeResolver(styleWithColors, {
        seed: 'test',
        skinColor: ['#ff0000', '#00ff00'],
      });

      resolver.color('skin');

      const resolved = resolver.resolved();

      assert.ok('skinColor' in resolved);
      assert.ok(Array.isArray(resolved.skinColor));
    });

    it('should return memoized values on repeated calls', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'test',
        flip: ['horizontal', 'vertical'],
      });

      const first = resolver.flip();
      const second = resolver.flip();

      assert.equal(first, second);
    });
  });

  describe('variant weights', () => {
    it('should never pick a weight-0 variant via PRNG', () => {
      for (let i = 0; i < 100; i++) {
        const resolver = makeResolver(styleWithWeights, { seed: `weight-${i}` });
        const result = resolver.variant('eyes');

        assert.notEqual(result, 'hidden');
      }
    });

    it('should allow weight-0 variant when explicitly specified as string', () => {
      const resolver = makeResolver(styleWithWeights, {
        seed: 'explicit-hidden',
        eyesVariant: 'hidden',
      });

      assert.equal(resolver.variant('eyes'), 'hidden');
    });

    it('should favor higher-weight variants', () => {
      let commonCount = 0;

      for (let i = 0; i < 200; i++) {
        const resolver = makeResolver(styleWithWeights, { seed: `favor-${i}` });

        if (resolver.variant('eyes') === 'common') {
          commonCount++;
        }
      }

      assert.ok(commonCount > 100, `Expected common to be picked most of the time, got ${commonCount}/200`);
    });

    it('should override weights via object variant option', () => {
      for (let i = 0; i < 100; i++) {
        const resolver = makeResolver(styleWithWeights, {
          seed: `override-${i}`,
          eyesVariant: { hidden: 1 },
        });

        assert.equal(resolver.variant('eyes'), 'hidden');
      }
    });

    it('should filter and weight via object variant option', () => {
      for (let i = 0; i < 100; i++) {
        const resolver = makeResolver(styleWithWeights, {
          seed: `filter-${i}`,
          eyesVariant: { common: 1, rare: 1 },
        });

        const result = resolver.variant('eyes');

        assert.ok(['common', 'rare'].includes(result));
      }
    });

    it('should fall back to uniform pick when all variants have weight 0', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          eyes: {
            width: 50,
            height: 50,
            variants: {
              a: { elements: [], weight: 0 },
              b: { elements: [], weight: 0 },
            },
          },
        },
      });
      const resolver = makeResolver(style, { seed: 'all-zero' });

      assert.ok(['a', 'b'].includes(resolver.variant('eyes')));
    });

    it('should be deterministic with weights', () => {
      const a = makeResolver(styleWithWeights, { seed: 'deterministic-test' });
      const b = makeResolver(styleWithWeights, { seed: 'deterministic-test' });

      assert.equal(a.variant('eyes'), b.variant('eyes'));
    });
  });

  describe('colorAngle', () => {
    it('should return 0 by default', () => {
      const resolver = makeResolver(minimalStyle, {});

      assert.equal(resolver.colorAngle('skin'), 0);
    });

    it('should return single value as-is', () => {
      const resolver = makeResolver(minimalStyle, {
        skinColorAngle: 45,
      });

      assert.equal(resolver.colorAngle('skin'), 45);
    });

    it('should interpolate range', () => {
      const resolver = makeResolver(minimalStyle, {
        seed: 'angle-test',
        skinColorAngle: [-90, 90],
      });

      const value = resolver.colorAngle('skin');

      assert.ok(value >= -90 && value <= 90);
    });
  });

  describe('variant tags', () => {
    // hair is mandatory (prob 100). Every variant is tagged on three axes
    // (hairLength, hairShade, tone). facialHair is optional (prob 50) and
    // tagged. nose carries no tags at all, so no tag filter should touch it.
    const styleWithTags = new Style({
      canvas: { width: 100, height: 100, elements: [] },
      components: {
        hair: {
          width: 50,
          height: 50,
          variants: {
            longLight: {
              elements: [],
              tags: ['hairLength:long', 'hairShade:light', 'tone:cool'],
            },
            longDark: {
              elements: [],
              tags: ['hairLength:long', 'hairShade:dark', 'tone:cool'],
            },
            shortLight: {
              elements: [],
              tags: ['hairLength:short', 'hairShade:light', 'tone:warm'],
            },
            shortDark: {
              elements: [],
              tags: ['hairLength:short', 'hairShade:dark', 'tone:warm'],
            },
          },
        },
        facialHair: {
          width: 50,
          height: 50,
          probability: 50,
          variants: {
            beard: { elements: [], tags: ['facialHair:beard', 'tone:warm'] },
            mustache: {
              elements: [],
              tags: ['facialHair:mustache', 'tone:warm'],
            },
          },
        },
        nose: {
          width: 50,
          height: 50,
          variants: {
            small: { elements: [] },
            big: { elements: [] },
          },
        },
      },
    });

    // The pool a component can resolve to: collect every variant picked across
    // many seeds. With small, evenly-weighted pools this surfaces every member.
    const variantPool = (style, options, name, runs = 240) => {
      const pool = new Set();

      for (let i = 0; i < runs; i++) {
        pool.add(
          new Resolver(
            style,
            new Options({ ...options, seed: `pool-${i}` }),
          ).variant(name),
        );
      }

      return pool;
    };

    const assertPool = (set, expected) => {
      assert.deepEqual([...set].sort(), [...expected].sort());
    };

    it('should restrict to variants matching an include token', () => {
      assertPool(variantPool(styleWithTags, { tags: 'hairLength:long' }, 'hair'), [
        'longLight',
        'longDark',
      ]);
    });

    it('should filter an axis that spans several components', () => {
      assertPool(variantPool(styleWithTags, { tags: 'tone:warm' }, 'hair'), [
        'shortLight',
        'shortDark',
      ]);
    });

    it('should OR multiple includes within one axis', () => {
      assertPool(
        variantPool(
          styleWithTags,
          { tags: ['hairLength:long', 'hairLength:short'] },
          'hair',
        ),
        ['longLight', 'longDark', 'shortLight', 'shortDark'],
      );
    });

    it('should AND includes across distinct axes', () => {
      assertPool(
        variantPool(
          styleWithTags,
          { tags: ['hairLength:long', 'hairShade:dark'] },
          'hair',
        ),
        ['longDark'],
      );
    });

    it('should keep a fully tagged component unchanged under a bare include', () => {
      // Every hair variant carries a hairLength tag, so requiring the
      // category drops nothing.
      assertPool(variantPool(styleWithTags, { tags: 'hairLength' }, 'hair'), [
        'longLight',
        'longDark',
        'shortLight',
        'shortDark',
      ]);
    });

    it('should not bind a bare include where the category is unused', () => {
      // No hair variant carries a facialHair tag, so the bare token leaves
      // the component untouched instead of emptying it.
      assertPool(variantPool(styleWithTags, { tags: 'facialHair' }, 'hair'), [
        'longLight',
        'longDark',
        'shortLight',
        'shortDark',
      ]);
    });

    it('should let a value include constrain a category alongside a bare include', () => {
      assertPool(
        variantPool(
          styleWithTags,
          { tags: ['hairLength', 'hairLength:long'] },
          'hair',
        ),
        ['longLight', 'longDark'],
      );
    });

    it('should drop variants untagged in a required category where it is in use', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          hat: {
            width: 50,
            height: 50,
            variants: {
              fedora: { elements: [], tags: ['headwear:hat'] },
              cap: { elements: [], tags: ['headwear:cap'] },
              plain: { elements: [] },
            },
          },
        },
      });

      assertPool(variantPool(style, { tags: 'headwear' }, 'hat'), [
        'fedora',
        'cap',
      ]);
    });

    it('should drive an opt-in animation component through bare tags', () => {
      // The static default outweighs the zero-weight speeds until the bare
      // include drops it; then the all-zero pool is drawn from unweighted.
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          animation: {
            width: 50,
            height: 50,
            variants: {
              none: { elements: [] },
              fast: { elements: [], weight: 0, tags: ['animation:fast'] },
              slow: { elements: [], weight: 0, tags: ['animation:slow'] },
            },
          },
        },
      });

      assertPool(variantPool(style, {}, 'animation'), ['none']);
      assertPool(variantPool(style, { tags: 'animation' }, 'animation'), [
        'fast',
        'slow',
      ]);
      assertPool(variantPool(style, { tags: '!animation' }, 'animation'), [
        'none',
      ]);
      assertPool(
        variantPool(style, { tags: ['animation', 'animation:slow'] }, 'animation'),
        ['slow'],
      );
    });

    it('should remove variants matching an exclude token', () => {
      assertPool(
        variantPool(styleWithTags, { tags: '!hairShade:dark' }, 'hair'),
        ['longLight', 'shortLight'],
      );
    });

    it('should apply excludes after includes (exclude wins)', () => {
      assertPool(
        variantPool(
          styleWithTags,
          { tags: ['hairLength:long', '!hairShade:dark'] },
          'hair',
        ),
        ['longLight'],
      );
    });

    it('should keep variants with no tag on the included axis (axis-scoped)', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          hat: {
            width: 50,
            height: 50,
            variants: {
              fedora: { elements: [], tags: ['headwear:hat'] },
              cap: { elements: [], tags: ['headwear:cap'] },
              plain: { elements: [] },
            },
          },
        },
      });

      assertPool(variantPool(style, { tags: 'headwear:hat' }, 'hat'), [
        'fedora',
        'plain',
      ]);
    });

    it('should leave a component whose variants carry no matching tag untouched', () => {
      assertPool(variantPool(styleWithTags, { tags: 'tone:warm' }, 'nose'), [
        'small',
        'big',
      ]);
    });

    it('should let ${name}Variant override the tag filter', () => {
      // ${name}Variant is more specific, so it ignores the tags filter: both
      // named variants are kept even though shortLight is outside the pool.
      assertPool(
        variantPool(
          styleWithTags,
          {
            tags: 'hairLength:long',
            hairVariant: ['longDark', 'shortLight'],
          },
          'hair',
        ),
        ['longDark', 'shortLight'],
      );
    });

    it('should keep a ${name}Variant name despite a tag exclude', () => {
      // The explicit option wins over the descriptive filter: longLight is
      // kept even though !tone:cool would otherwise drop it.
      assertPool(
        variantPool(
          styleWithTags,
          {
            tags: '!tone:cool',
            hairVariant: ['longLight', 'shortDark'],
          },
          'hair',
        ),
        ['longLight', 'shortDark'],
      );
    });

    it('should let ${name}Variant weights override authored weights in the pool', () => {
      // `long` carries a heavy authored weight, but the option's weight 0 must
      // win, so it is never picked and `short` (authored weight 1) always is.
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          hair: {
            width: 50,
            height: 50,
            variants: {
              long: { elements: [], weight: 100, tags: ['hairLength:long'] },
              short: { elements: [], weight: 1, tags: ['hairLength:short'] },
            },
          },
        },
      });

      let long = 0;
      let short = 0;

      for (let i = 0; i < 200; i++) {
        const result = new Resolver(
          style,
          new Options({
            seed: `weight-${i}`,
            tags: ['hairLength:long', 'hairLength:short'],
            hairVariant: { long: 0, short: 1 },
          }),
        ).variant('hair');

        if (result === 'long') {
          long++;
        } else if (result === 'short') {
          short++;
        }
      }

      // long (authored 100) is overridden to 0 and never picked, so short wins.
      assert.equal(long, 0, `expected weight 0 to override authored 100, got ${long}/200`);
      assert.equal(short, 200, `expected short to always win, got ${short}/200`);
    });

    it('should treat an empty tags array as no filter (classic restriction)', () => {
      assertPool(
        variantPool(
          styleWithTags,
          { tags: [], hairVariant: 'longLight' },
          'hair',
        ),
        ['longLight'],
      );
    });

    it('should resolve to no variant when the filter empties a mandatory component', () => {
      // !hairShade drops every hair variant. Like an empty `${name}Variant`,
      // an empty pool yields nothing rather than forcing variants back in.
      assertPool(variantPool(styleWithTags, { tags: '!hairShade' }, 'hair'), [
        undefined,
      ]);
    });

    it('should hide an optional component when the filter empties its pool', () => {
      // !facialHair drops every facialHair variant. The component is optional
      // (prob 50), so it stays hidden and never resolves to a variant.
      assertPool(variantPool(styleWithTags, { tags: '!facialHair' }, 'facialHair'), [
        undefined,
      ]);
    });

    it('should be deterministic for the same seed and tags', () => {
      const options = { seed: 'deterministic', tags: 'hairLength:long' };
      const a = new Resolver(styleWithTags, new Options(options)).variant('hair');
      const b = new Resolver(styleWithTags, new Options(options)).variant('hair');

      assert.equal(a, b);
      // and the result is constrained by the filter, not just stable
      assert.ok(['longLight', 'longDark'].includes(a));
    });

    it('should yield no variant for an empty ${name}Variant even with tags', () => {
      // An explicit empty allowlist means "none". Since ${name}Variant governs
      // the component, the tags filter is ignored and cannot resurrect the pool.
      assertPool(
        variantPool(styleWithTags, { tags: 'tone:warm', noseVariant: [] }, 'nose'),
        [undefined],
      );
    });

    it('should handle a variant named like an Object.prototype member', () => {
      // `toString` is a valid variant name. It must work as a Map/Set key and
      // as an own weight key without colliding with Object.prototype.toString,
      // so both variants stay reachable.
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        components: {
          hair: {
            width: 50,
            height: 50,
            variants: {
              toString: { elements: [], tags: ['hairLength:long'] },
              long: { elements: [], tags: ['hairLength:long'] },
            },
          },
        },
      });
      const seen = new Set();

      for (let i = 0; i < 200; i++) {
        seen.add(
          new Resolver(
            style,
            new Options({
              seed: `proto-${i}`,
              tags: 'hairLength:long',
              hairVariant: { toString: 1, long: 1 },
            }),
          ).variant('hair'),
        );
      }

      assert.ok(
        seen.has('toString') && seen.has('long'),
        `both variants should be reachable, got ${[...seen]}`,
      );
    });

    it('should reject an invalid tag token at validation', () => {
      assert.throws(() => new Options({ tags: ['Bad:X'] }));
    });
  });

  describe('animation options', () => {
    const style = new Style({
      canvas: { width: 100, height: 100, elements: [] },
    });

    it('should default animation to false and speed to 1', () => {
      const resolver = makeResolver(style);

      assert.equal(resolver.animation(), false);
      assert.equal(resolver.animationSpeed(), 1);
    });

    it('should pass through the configured values', () => {
      const resolver = makeResolver(style, {
        animation: true,
        animationSpeed: 0.5,
      });

      assert.equal(resolver.animation(), true);
      assert.equal(resolver.animationSpeed(), 0.5);
    });

    it('should pick a speed from a range, seeded', () => {
      const resolver = makeResolver(style, {
        seed: 'x',
        animationSpeed: [0.5, 2],
      });
      const speed = resolver.animationSpeed();

      assert.ok(speed >= 0.5 && speed <= 2);
      assert.equal(
        speed,
        makeResolver(style, { seed: 'x', animationSpeed: [0.5, 2] })
          .animationSpeed(),
      );
    });

    it('should reject out-of-range values at validation', () => {
      assert.throws(() => new Options({ animation: 'Yes' }));
      assert.throws(() => new Options({ animation: ['blink', 'Bad'] }));
      assert.throws(() => new Options({ blinkAnimation: 'yes' }));
      assert.throws(() => new Options({ BlinkAnimation: true }));
      assert.throws(() => new Options({ animationSpeed: 0 }));
      assert.throws(() => new Options({ animationSpeed: 20 }));
      assert.throws(() => new Options({ animationSpeed: [0, 2] }));
      assert.throws(() => new Options({ blinkAnimationSpeed: 0 }));
      assert.throws(() => new Options({ blinkAnimationSpeed: [0.5, 2, 4] }));
      assert.throws(() => new Options({ BlinkAnimationSpeed: 2 }));
      assert.throws(() => new Options({ blinkAnimationSpeed: 'fast' }));
    });

    it('should let the specific option win over the global one', () => {
      const resolver = makeResolver(style, {
        animationSpeed: 0.5,
        blinkAnimationSpeed: 2,
      });

      assert.equal(resolver.animationSpeedFor('blink'), 2);
      assert.equal(resolver.animationSpeedFor('sway'), 0.5);
      assert.equal(resolver.animationSpeedFor(undefined), 0.5);
      assert.equal(resolver.resolved().blinkAnimationSpeed, 2);
      assert.equal('swayAnimationSpeed' in resolver.resolved(), false);
    });

    it('should draw a specific range under its own key', () => {
      const options = {
        seed: 'x',
        blinkAnimationSpeed: [0.5, 2],
        swayAnimationSpeed: [0.5, 2],
      };
      const resolver = makeResolver(style, options);
      const blink = resolver.animationSpeedFor('blink');

      assert.ok(blink >= 0.5 && blink <= 2);
      assert.notEqual(blink, resolver.animationSpeedFor('sway'));
      assert.notEqual(
        blink,
        makeResolver(style, { seed: 'x', animationSpeed: [0.5, 2] }).animationSpeed(),
      );
      assert.equal(makeResolver(style, options).animationSpeedFor('blink'), blink);
    });

    it('should share the global factor with every timeline', () => {
      const resolver = makeResolver(style, { animationSpeed: 2 });

      assert.equal(resolver.animationSpeedFor('blink'), 2);
      assert.equal(resolver.animationSpeedFor(undefined), 2);
    });

    it('should let a named switch win over the global one', () => {
      const on = makeResolver(style, { animation: false, blinkAnimation: true });

      assert.equal(on.animationPlays('blink'), true);
      assert.equal(on.animationPlays('sway'), false);
      assert.equal(on.animationPlays(undefined), false);
      assert.equal(on.resolved().blinkAnimation, true);
      assert.equal('swayAnimation' in on.resolved(), false);

      const off = makeResolver(style, { animation: true, blinkAnimation: false });

      assert.equal(off.animationPlays('blink'), false);
      assert.equal(off.animationPlays('sway'), true);
      assert.equal(off.animationPlays(undefined), true);
    });
  });
});
