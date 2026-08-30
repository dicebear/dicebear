import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { Style, Avatar } from '../lib/index.js';

const minimalStyle = new Style({
  canvas: { width: 100, height: 100, elements: [] },
});

const aliasFixture = {
  canvas: {
    width: 100,
    height: 100,
    elements: [
      { type: 'component', name: 'eyes' },
      {
        type: 'component',
        name: 'eyesRight',
        attributes: { transform: 'matrix(.85 0 0 .85 10 20)' },
      },
    ],
  },
  components: {
    eyes: {
      width: 20,
      height: 20,
      variants: {
        a: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'a' } }] },
        b: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'b' } }] },
        c: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'c' } }] },
        d: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'd' } }] },
        e: { elements: [{ type: 'element', name: 'circle', attributes: { id: 'e' } }] },
      },
    },
    eyesRight: { extends: 'eyes' },
  },
};

describe('Renderer', () => {
  describe('SVG wrapper', () => {
    it('should render svg with viewBox', () => {
      const svg = new Avatar(minimalStyle).toString();

      assert.ok(svg.startsWith('<svg '));
      assert.ok(svg.includes('xmlns="http://www.w3.org/2000/svg"'));
      assert.ok(svg.includes('viewBox="0 0 100 100"'));
      assert.ok(svg.endsWith('</svg>'));
    });

    it('should include role="img" and aria-label when title is set', () => {
      const svg = new Avatar(minimalStyle, { title: 'Test Avatar' }).toString();

      assert.ok(svg.includes('role="img"'));
      assert.ok(svg.includes('aria-label="Test Avatar"'));
      assert.ok(svg.includes('<title>Test Avatar</title>'));
    });

    it('should escape title in aria-label and title element', () => {
      const svg = new Avatar(minimalStyle, { title: 'A & B <C>' }).toString();

      assert.ok(svg.includes('aria-label="A &amp; B &lt;C&gt;"'));
      assert.ok(svg.includes('<title>A &amp; B &lt;C&gt;</title>'));
    });

    it('should be aria-hidden when title is not set', () => {
      const svg = new Avatar(minimalStyle).toString();

      assert.ok(svg.includes('aria-hidden="true"'));
      assert.ok(!svg.includes('role="img"'));
      assert.ok(!svg.includes('<title>'));
      assert.ok(!svg.includes('aria-label'));
    });

    it('should include size when set', () => {
      const svg = new Avatar(minimalStyle, { size: 64 }).toString();

      assert.ok(svg.includes('width="64"'));
      assert.ok(svg.includes('height="64"'));
    });

    it('should not include size when not set', () => {
      const svg = new Avatar(minimalStyle).toString();
      const openTag = svg.slice(0, svg.indexOf('>') + 1);

      assert.ok(!openTag.includes('width='));
      assert.ok(!openTag.includes('height='));
    });
  });

  describe('element rendering', () => {
    it('should render self-closing elements', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            { type: 'element', name: 'rect', attributes: { x: '0', y: '0', width: '100', height: '100' } },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<rect x="0" y="0" width="100" height="100"/>'));
    });

    it('should render elements with children', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'g',
              children: [
                { type: 'element', name: 'circle', attributes: { cx: '50', cy: '50', r: '10' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<g><circle cx="50" cy="50" r="10"/></g>'));
    });

    it('should render nested elements', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'g',
              attributes: { id: 'outer' },
              children: [
                {
                  type: 'element',
                  name: 'g',
                  attributes: { id: 'inner' },
                  children: [
                    { type: 'element', name: 'rect' },
                  ],
                },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<g id="outer"><g id="inner"><rect/></g></g>'));
    });

    it('should drop wrappers whose children all render to nothing', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'g',
              attributes: { mask: 'url(#mask)' },
              children: [
                { type: 'element', name: 'g', children: [{ type: 'component', name: 'eyes' }] },
              ],
            },
            { type: 'element', name: 'rect' },
          ],
        },
        components: {
          eyes: {
            width: 50,
            height: 50,
            probability: 0,
            variants: { open: { elements: [{ type: 'element', name: 'circle', attributes: { r: '5' } }] } },
          },
        },
      });

      const svg = new Avatar(style, { seed: 'test' }).toString();

      assert.ok(!svg.includes('mask='), 'expected the empty wrappers to be dropped');
      assert.ok(svg.includes('<rect/>'));
    });

    it('should keep an empty wrapper that carries an id', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'g',
              attributes: { id: 'placeholder' },
              children: [{ type: 'component', name: 'eyes' }],
            },
          ],
        },
        components: {
          eyes: {
            width: 50,
            height: 50,
            probability: 0,
            variants: { open: { elements: [{ type: 'element', name: 'circle', attributes: { r: '5' } }] } },
          },
        },
      });

      const svg = new Avatar(style, { seed: 'test' }).toString();

      assert.ok(svg.includes('<g id="placeholder"/>'));
    });
  });

  describe('text rendering', () => {
    it('should render text content', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: 'Hello' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<text>Hello</text>'));
    });

    it('should resolve variable reference: initial', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initial' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { seed: 'Alice' }).toString();

      assert.ok(svg.includes('<text>A</text>'));
    });

    it('should resolve variable reference: initial for supplementary-plane seeds', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initial' } },
              ],
            },
          ],
        },
      });

      // U+10400 is outside the BMP; charAt(0) would emit a lone surrogate
      // (ill-formed XML) instead of the full code point.
      const svg = new Avatar(style, { seed: '𐐀a' }).toString();

      assert.ok(svg.includes('<text>𐐀</text>'));
    });

    it('should resolve initials from multi-word seed', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initials' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { seed: 'Alice Bob' }).toString();

      assert.ok(svg.includes('<text>AB</text>'));
    });

    it('should resolve initials from single-word seed', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initials' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { seed: 'Alice' }).toString();

      assert.ok(svg.includes('<text>AL</text>'));
    });

    it('should discard @-symbol in initials', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: { type: 'variable', name: 'initials' } },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { seed: 'alice@example.com' }).toString();

      assert.ok(svg.includes('<text>AL</text>'));
    });
  });

  describe('component rendering', () => {
    const styleWithComponents = new Style({
      canvas: {
        width: 100,
        height: 100,
        elements: [
          { type: 'component', name: 'eyes' },
        ],
      },
      components: {
        eyes: {
          width: 50,
          height: 50,
          variants: {
            open: {
              elements: [
                { type: 'element', name: 'circle', attributes: { r: '5' } },
              ],
            },
            closed: {
              elements: [
                { type: 'element', name: 'line', attributes: { x1: '0', x2: '10' } },
              ],
            },
          },
        },
      },
    });

    it('should render selected variant', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesVariant: 'open',
      }).toString();

      assert.ok(svg.includes('<circle r="5"/>'));
      assert.ok(!svg.includes('<line'));
    });

    it('should put the variant body in <defs> and reference it via <use>', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesVariant: 'open',
      }).toString();

      const idMatch = svg.match(/<g id="(eyes-open-[a-f0-9]+)"><circle r="5"\/><\/g>/);

      assert.ok(idMatch, 'expected variant body wrapped in <g id="…"> inside <defs>');
      assert.ok(svg.includes('<defs>'));
      assert.ok(svg.includes(`<use href="#${idMatch[1]}"/>`));
    });

    it('should skip component with probability 0', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesProbability: 0,
      }).toString();

      assert.ok(!svg.includes('<circle'));
      assert.ok(!svg.includes('<line'));
      assert.ok(!svg.includes('<use'));
    });

    it('should apply translate from the component definition on the <use> element', () => {
      const styleWithTranslate = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [{ type: 'component', name: 'eyes' }],
        },
        components: {
          eyes: {
            width: 50,
            height: 50,
            translate: { x: { min: 5, max: 5 }, y: { min: 10, max: 10 } },
            variants: { open: { elements: [{ type: 'element', name: 'circle', attributes: { r: '5' } }] } },
          },
        },
      });

      const svg = new Avatar(styleWithTranslate, { seed: 'test' }).toString();

      assert.ok(svg.includes('<use transform="translate(2.5, 5)" href="#eyes-open-'));
    });

    it('should apply rotation from the component definition with center point', () => {
      const styleWithRotate = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [{ type: 'component', name: 'eyes' }],
        },
        components: {
          eyes: {
            width: 50,
            height: 50,
            rotate: { min: 45, max: 45 },
            variants: { open: { elements: [{ type: 'element', name: 'circle', attributes: { r: '5' } }] } },
          },
        },
      });

      const svg = new Avatar(styleWithRotate, { seed: 'test' }).toString();

      assert.ok(svg.includes('<use transform="rotate(45, 25, 25)" href="#eyes-open-'));
    });

    it('should omit the transform attribute when no transforms apply', () => {
      const svg = new Avatar(styleWithComponents, {
        seed: 'test',
        eyesVariant: 'open',
      }).toString();

      assert.ok(svg.includes('<use href="#eyes-open-'));
      assert.ok(!/<use[^>]*\btransform=/.test(svg));
    });

    it('should apply attributes from a component reference to the <use> tag', () => {
      const styleWithCompAttrs = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'component',
              name: 'eyes',
              attributes: { transform: 'matrix(.5 0 0 .5 10 20)', opacity: '.75' },
            },
          ],
        },
        components: {
          eyes: {
            width: 50,
            height: 50,
            variants: {
              open: { elements: [{ type: 'element', name: 'circle', attributes: { r: '5' } }] },
            },
          },
        },
      });

      const svg = new Avatar(styleWithCompAttrs, {
        seed: 'test',
        eyesVariant: 'open',
      }).toString();

      assert.ok(
        svg.includes('<use transform="matrix(.5 0 0 .5 10 20)" opacity=".75" href="#eyes-open-'),
        `expected merged attributes on <use>, got: ${svg}`,
      );
    });

    it('should prepend a user transform to the built-in component transforms', () => {
      const styleWithBoth = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'component',
              name: 'eyes',
              attributes: { transform: 'matrix(.5 0 0 .5 10 20)' },
            },
          ],
        },
        components: {
          eyes: {
            width: 50,
            height: 50,
            rotate: { min: 45, max: 45 },
            variants: {
              open: { elements: [{ type: 'element', name: 'circle', attributes: { r: '5' } }] },
            },
          },
        },
      });

      const svg = new Avatar(styleWithBoth, { seed: 'test' }).toString();

      assert.ok(
        svg.includes('<use transform="matrix(.5 0 0 .5 10 20) rotate(45, 25, 25)" href="#eyes-open-'),
        `expected user transform outermost, then built-in rotate, got: ${svg}`,
      );
    });

    it('should deduplicate identical component references via shared <defs>', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            { type: 'component', name: 'eyes' },
            { type: 'component', name: 'eyes' },
          ],
        },
        components: {
          eyes: {
            width: 50,
            height: 50,
            variants: {
              open: { elements: [{ type: 'element', name: 'circle', attributes: { r: '5' } }] },
            },
          },
        },
      });

      const svg = new Avatar(style, {
        seed: 'test',
        eyesVariant: 'open',
      }).toString();

      const circleMatches = svg.match(/<circle r="5"\/>/g) ?? [];
      const useMatches = svg.match(/<use href="#eyes-open-[a-f0-9]+"\/>/g) ?? [];

      assert.equal(circleMatches.length, 1, 'variant body must appear only once');
      assert.equal(useMatches.length, 2, 'each component reference becomes its own <use>');
    });
  });

  describe('component aliases', () => {
    const aliasStyle = new Style(aliasFixture);

    it('should give source and alias independent variants for the same seed', () => {
      let differed = false;

      for (const seed of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']) {
        const svg = new Avatar(aliasStyle, { seed }).toString();
        const matches = svg.match(/<circle id="([a-z])"\/>/g) ?? [];

        if (matches.length === 2 && matches[0] !== matches[1]) {
          differed = true;
          break;
        }
      }

      assert.ok(differed, 'expected at least one seed where alias picks a different variant than the source');
    });

    it('should inherit eyesVariant on the alias and share the same <defs> entry', () => {
      const svg = new Avatar(aliasStyle, {
        seed: 'fallthrough',
        eyesVariant: 'b',
      }).toString();
      const circles = [...svg.matchAll(/<circle id="([a-z])"\/>/g)].map((m) => m[1]);
      const uses = [...svg.matchAll(/<use[^>]*\bhref="#(eyes-[a-z]-[a-f0-9]+)"\/>/g)].map((m) => m[1]);

      assert.deepEqual(circles, ['b'], 'variant body is registered once');
      assert.equal(uses.length, 2, 'both component slots reference the body');
      assert.equal(uses[0], uses[1], 'both <use> elements share the same href');
    });

    it('should propagate eyesProbability to the alias', () => {
      const svg = new Avatar(aliasStyle, {
        seed: 'probability-fallthrough',
        eyesProbability: 0,
      }).toString();

      assert.ok(!svg.includes('<circle'));
    });

    it('should silently ignore options keyed against an alias component', () => {
      const svgWithoutAliasKey = new Avatar(aliasStyle, {
        seed: 'ignore-alias-key',
        eyesVariant: 'a',
      }).toString();
      const svgWithAliasKey = new Avatar(aliasStyle, {
        seed: 'ignore-alias-key',
        eyesVariant: 'a',
        eyesRightVariant: 'd',
      }).toString();

      assert.equal(svgWithoutAliasKey, svgWithAliasKey);
    });
  });

  describe('color rendering', () => {
    it('should resolve color reference to solid color', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              attributes: { fill: { type: 'color', name: 'bg' } },
            },
          ],
        },
        colors: {
          bg: { values: ['#ff0000'] },
        },
      });

      const svg = new Avatar(style, {
        seed: 'test',
        bgColor: ['#ff0000'],
      }).toString();

      assert.ok(svg.includes('fill="#ff0000"'));
    });

    it('should render linear gradient for multi-color fill', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              attributes: { fill: { type: 'color', name: 'bg' } },
            },
          ],
        },
        colors: {
          bg: { values: ['#ff0000', '#0000ff'] },
        },
      });

      const svg = new Avatar(style, {
        seed: 'test',
        bgColor: ['#ff0000', '#0000ff'],
        bgColorFill: 'linear',
      }).toString();

      assert.ok(svg.includes('<defs>'));
      assert.ok(svg.includes('<linearGradient id="bg-color-'));
      assert.ok(svg.includes('stop-color="#ff0000"'));
      assert.ok(svg.includes('stop-color="#0000ff"'));
      assert.ok(svg.includes('fill="url(#bg-color-'));
    });

    it('should render radial gradient', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              attributes: { fill: { type: 'color', name: 'bg' } },
            },
          ],
        },
        colors: {
          bg: { values: ['#ff0000', '#0000ff'] },
        },
      });

      const svg = new Avatar(style, {
        seed: 'test',
        bgColor: ['#ff0000', '#0000ff'],
        bgColorFill: 'radial',
      }).toString();

      assert.ok(svg.includes('<radialGradient id="bg-color-'));
      assert.ok(svg.includes('fill="url(#bg-color-'));
    });

    it('should keep the stop order when the color order is fixed', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              attributes: { fill: { type: 'color', name: 'bg' } },
            },
          ],
        },
        colors: {
          bg: { values: ['#ff0000', '#0000ff'] },
        },
      });

      const svg = new Avatar(style, {
        seed: 'test',
        bgColor: ['#0055a4', '#ffffff', '#ef4135'],
        bgColorFill: 'linear',
        bgColorOrder: 'fixed',
      }).toString();

      assert.ok(
        svg.includes(
          '<stop offset="0%" stop-color="#0055a4"/>' +
            '<stop offset="50%" stop-color="#ffffff"/>' +
            '<stop offset="100%" stop-color="#ef4135"/>',
        ),
      );
    });
  });

  describe('flip', () => {
    it('should apply horizontal flip', () => {
      const svg = new Avatar(minimalStyle, { flip: 'horizontal' }).toString();

      assert.ok(svg.includes('scale(-1, 1)'));
      assert.ok(svg.includes('translate(100, 0)'));
    });

    it('should apply vertical flip', () => {
      const svg = new Avatar(minimalStyle, { flip: 'vertical' }).toString();

      assert.ok(svg.includes('scale(1, -1)'));
      assert.ok(svg.includes('translate(0, 100)'));
    });

    it('should apply both flip', () => {
      const svg = new Avatar(minimalStyle, { flip: 'both' }).toString();

      assert.ok(svg.includes('scale(-1, -1)'));
      assert.ok(svg.includes('translate(100, 100)'));
    });

    it('should not apply flip when none', () => {
      const svg = new Avatar(minimalStyle, { flip: 'none' }).toString();

      assert.ok(!svg.includes('scale(-1'));
    });
  });

  describe('scale', () => {
    it('should apply scale transform', () => {
      const svg = new Avatar(minimalStyle, { scale: 0.5 }).toString();

      assert.ok(svg.includes('scale(0.5)'));
      assert.ok(svg.includes('translate(50, 50)'));
      assert.ok(svg.includes('translate(-50, -50)'));
    });

    it('should not apply scale when 1', () => {
      const svg = new Avatar(minimalStyle, { scale: 1 }).toString();

      assert.ok(!svg.includes('scale('));
    });
  });

  describe('component scale', () => {
    const buildStyle = (componentExtras = {}) =>
      new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [{ type: 'component', name: 'eyes' }],
        },
        components: {
          eyes: {
            width: 50,
            height: 50,
            ...componentExtras,
            variants: { open: { elements: [{ type: 'element', name: 'rect' }] } },
          },
        },
      });

    it('should apply component scale from definition around component center', () => {
      const svg = new Avatar(buildStyle({ scale: { min: 2, max: 2 } }), { seed: 'test' }).toString();

      assert.ok(svg.includes('translate(25, 25) scale(2) translate(-25, -25)'));
    });

    it('should not apply component scale when definition default is 1', () => {
      const svg = new Avatar(buildStyle(), { seed: 'test' }).toString();

      assert.ok(!svg.includes('scale('));
    });

    it('should place component scale after rotate in the transform attribute', () => {
      const svg = new Avatar(
        buildStyle({ rotate: { min: 45, max: 45 }, scale: { min: 2, max: 2 } }),
        { seed: 'test' },
      ).toString();

      const rotateIndex = svg.indexOf('rotate(45');
      const scaleIndex = svg.indexOf('scale(2)');

      assert.ok(rotateIndex !== -1 && scaleIndex !== -1);
      assert.ok(rotateIndex < scaleIndex);
    });
  });

  describe('borderRadius', () => {
    it('should apply border radius via clipPath', () => {
      const svg = new Avatar(minimalStyle, { borderRadius: 10 }).toString();

      assert.ok(svg.includes('<clipPath id="clip-'));
      assert.ok(svg.includes('rx="10"'));
      assert.ok(svg.includes('ry="10"'));
      assert.ok(svg.includes('clip-path="url(#clip-'));
    });

    it('should still apply a square clipPath when border radius is 0', () => {
      const svg = new Avatar(minimalStyle, { borderRadius: 0 }).toString();

      assert.ok(svg.includes('<clipPath id="clip-'));
      assert.ok(svg.includes('rx="0"'));
      assert.ok(svg.includes('ry="0"'));
      assert.ok(svg.includes('clip-path="url(#clip-'));
    });
  });

  describe('idRandomization', () => {
    const styleWithIds = new Style({
      canvas: {
        width: 100,
        height: 100,
        elements: [
          {
            type: 'element',
            name: 'defs',
            children: [
              {
                type: 'element',
                name: 'linearGradient',
                attributes: { id: 'grad1' },
                children: [
                  { type: 'element', name: 'stop', attributes: { offset: '0%', 'stop-color': 'red' } },
                ],
              },
            ],
          },
          {
            type: 'element',
            name: 'rect',
            attributes: { fill: 'url(#grad1)' },
          },
        ],
      },
    });

    it('should randomize ids when enabled', () => {
      const svg = new Avatar(styleWithIds, {
        seed: 'test',
        idRandomization: true,
      }).toString();

      assert.ok(!svg.includes('id="grad1"'));
      assert.ok(!svg.includes('url(#grad1)'));
      assert.ok(svg.includes('id="grad1-'));
      assert.ok(svg.includes('url(#grad1-'));
    });

    it('should not randomize ids when disabled', () => {
      const svg = new Avatar(styleWithIds, {
        seed: 'test',
        idRandomization: false,
      }).toString();

      assert.ok(svg.includes('id="grad1"'));
      assert.ok(svg.includes('url(#grad1)'));
    });

    it('should produce different ids on each call', () => {
      const svg1 = new Avatar(styleWithIds, { seed: 'test', idRandomization: true }).toString();
      const svg2 = new Avatar(styleWithIds, { seed: 'test', idRandomization: true }).toString();

      assert.notEqual(svg1, svg2);
    });
  });

  describe('background', () => {
    it('should render solid background', () => {
      const svg = new Avatar(minimalStyle, {
        backgroundColor: ['#ff0000'],
      }).toString();

      assert.ok(svg.includes('<rect width="100" height="100" fill="#ff0000"/>'));
    });

    it('should render gradient background', () => {
      const svg = new Avatar(minimalStyle, {
        backgroundColor: ['#ff0000', '#0000ff'],
        backgroundColorFill: 'linear',
      }).toString();

      assert.ok(svg.includes('<linearGradient id="background-color-'));
      assert.ok(svg.includes('fill="url(#background-color-'));
    });

    it('should apply gradient rotation', () => {
      const svg = new Avatar(minimalStyle, {
        backgroundColor: ['#ff0000', '#0000ff'],
        backgroundColorFill: 'linear',
        backgroundColorAngle: 45,
      }).toString();

      assert.ok(svg.includes('gradientTransform="rotate(45, 0.5, 0.5)"'));
    });

    it('should not render background without colors', () => {
      const svg = new Avatar(minimalStyle).toString();

      // The clipPath wrapper always emits a <rect>; only the background
      // <rect> carries a fill attribute, so check for that specifically.
      assert.ok(!/<rect[^>]*\sfill=/.test(svg));
    });
  });

  describe('global transforms', () => {
    it('should apply global rotation', () => {
      const svg = new Avatar(minimalStyle, { rotate: 45 }).toString();

      assert.ok(svg.includes('rotate(45, 50, 50)'));
    });

    it('should not apply global rotation when 0', () => {
      const svg = new Avatar(minimalStyle, { rotate: 0 }).toString();

      assert.ok(!svg.includes('rotate('));
    });

    it('should apply global translate as percentage', () => {
      const svg = new Avatar(minimalStyle, {
        translateX: 10,
        translateY: -20,
      }).toString();

      assert.ok(svg.includes('translate(10, -20)'));
    });
  });

  describe('metadata', () => {
    it('should render metadata with Dublin Core fields', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        meta: {
          creator: { name: 'John Doe' },
          source: { name: 'My Style', url: 'https://example.com' },
          license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('<metadata'));
      assert.ok(svg.includes('xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"'));
      assert.ok(svg.includes('<dc:title>My Style</dc:title>'));
      assert.ok(svg.includes('<dc:creator>John Doe</dc:creator>'));
      assert.ok(svg.includes('<dc:source xsi:type="dcterms:URI">https://example.com</dc:source>'));
      assert.ok(svg.includes('<dcterms:license xsi:type="dcterms:URI">https://opensource.org/licenses/MIT</dcterms:license>'));
    });

    it('should not render metadata when no meta', () => {
      const svg = new Avatar(minimalStyle).toString();

      assert.ok(!svg.includes('<metadata'));
    });

    it('should include dc:rights with license text', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        meta: {
          creator: { name: 'Pablo Stanley' },
          source: { name: 'Avataaars', url: 'https://avataaars.com' },
          license: { name: 'CC BY 4.0', url: 'https://creativecommons.org/licenses/by/4.0/' },
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('Remix of'));
      assert.ok(svg.includes('Avataaars'));
      assert.ok(svg.includes('Pablo Stanley'));
      assert.ok(svg.includes('CC BY 4.0'));
    });

    it('should not prefix "Remix of" for MIT licensed DiceBear styles', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        meta: {
          creator: { name: 'DiceBear' },
          source: { name: 'Initials' },
          license: { name: 'MIT' },
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(!svg.includes('Remix of'));
      assert.ok(svg.includes('Initials'));
    });

    it('should escape XML in metadata', () => {
      const style = new Style({
        canvas: { width: 100, height: 100, elements: [] },
        meta: {
          creator: { name: 'A & B' },
          source: { name: '<Script>' },
          license: { name: 'MIT' },
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('A &amp; B'));
      assert.ok(svg.includes('&lt;Script&gt;'));
    });
  });

  describe('variable attributes', () => {
    it('should resolve font-family variable reference in attributes', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              attributes: { 'font-family': { type: 'variable', name: 'fontFamily' } },
              children: [
                { type: 'text', value: 'Hello' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { fontFamily: 'Arial' }).toString();

      assert.ok(svg.includes('font-family="Arial"'));
    });

    it('should resolve font-weight variable reference in attributes', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              attributes: { 'font-weight': { type: 'variable', name: 'fontWeight' } },
              children: [
                { type: 'text', value: 'Hello' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style, { fontWeight: 700 }).toString();

      assert.ok(svg.includes('font-weight="700"'));
    });

    it('should still accept plain string for font-family', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              attributes: { 'font-family': 'monospace' },
              children: [
                { type: 'text', value: 'Hello' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('font-family="monospace"'));
    });
  });

  describe('xml escaping', () => {
    it('should escape attribute values', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            { type: 'element', name: 'rect', attributes: { d: 'a & b "c"' } },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(svg.includes('d="a &amp; b &quot;c&quot;"'));
    });

    it('should escape text content', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'text',
              children: [
                { type: 'text', value: '<script>alert("xss")</script>' },
              ],
            },
          ],
        },
      });

      const svg = new Avatar(style).toString();

      assert.ok(!svg.includes('<script>'));
      assert.ok(svg.includes('&lt;script&gt;'));
    });
  });

  describe('animations', () => {
    // jelly's squash, reduced to two tracks. scaleX precedes scaleY in the
    // canonical wrapper order, so class -0 is the outer wrapper.
    const squash = {
      canvas: {
        width: 100,
        height: 100,
        elements: [
          {
            type: 'element',
            name: 'g',
            animations: [
              {
                duration: 5.4,
                easing: 'easeOut',
                origin: { x: 50, y: 100 },
                tracks: {
                  scaleX: {
                    keyframes: [
                      { at: 0, value: 1 },
                      { at: 6, value: 1.07 },
                      { at: 46, value: 1 },
                    ],
                  },
                  scaleY: {
                    keyframes: [
                      { at: 0, value: 1 },
                      { at: 6, value: 0.93 },
                      { at: 46, value: 1 },
                    ],
                  },
                },
              },
            ],
            children: [{ type: 'element', name: 'rect' }],
          },
        ],
      },
    };

    const hashOf = (svg) => {
      const match = svg.match(/dba-([0-9a-f]+)-\d+/);

      assert.ok(match, 'expected an animation class in the output');

      return match[1];
    };

    it('should render statically without the animation option', () => {
      const withAnimations = new Avatar(new Style(squash)).toString();
      const stripped = structuredClone(squash);

      delete stripped.canvas.elements[0].animations;

      assert.equal(withAnimations, new Avatar(new Style(stripped)).toString());
      assert.ok(!withAnimations.includes('@keyframes'));
      assert.ok(!withAnimations.includes('dba-'));
    });

    it('should render statically for an empty name selection', () => {
      // The HTTP API turns `?animation=` into an empty list, which has to
      // mean the same as leaving the option out.
      assert.equal(
        new Avatar(new Style(squash), { animation: [] }).toString(),
        new Avatar(new Style(squash)).toString(),
      );
    });

    it('should hand a hidden element its opacity back while animating', () => {
      // The element's own opacity is the resting state an opacity track
      // replaces, not a factor it is multiplied with, so a layer hidden with
      // `opacity="0"` can be brought in by its animation.
      const reveal = {
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              attributes: { opacity: '0' },
              animations: [
                {
                  name: 'reveal',
                  duration: 4,
                  easing: 'hold',
                  tracks: {
                    opacity: {
                      keyframes: [
                        { at: 0, value: 0 },
                        { at: 50, value: 1 },
                        { at: 100, value: 0 },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      const style = new Style(reveal);
      const animated = new Avatar(style, { animation: true }).toString();
      const hash = hashOf(animated);

      assert.ok(animated.includes(`<g class="dba-${hash}-0" opacity="0"><rect/></g>`));

      // With the animation off nothing wraps the element, so its own opacity
      // keeps it hidden.
      assert.ok(new Avatar(style).toString().includes('<rect opacity="0"/>'));
    });

    it('should wrap each track in its own group, outermost first', () => {
      const svg = new Avatar(new Style(squash), { animation: true }).toString();
      const hash = hashOf(svg);

      assert.ok(
        svg.includes(
          `<g class="dba-${hash}-0"><g class="dba-${hash}-1"><g><rect/></g></g></g>`,
        ),
      );
    });

    it('should emit padded keyframes and the full animation shorthand', () => {
      const svg = new Avatar(new Style(squash), { animation: true }).toString();
      const hash = hashOf(svg);

      assert.ok(
        svg.includes(
          `@keyframes dbk-${hash}-0{0%{transform:scaleX(1)}6%{transform:scaleX(1.07)}46%{transform:scaleX(1)}100%{transform:scaleX(1)}}`,
        ),
      );
      assert.ok(
        svg.includes(
          `.dba-${hash}-0{transform-box:fill-box;transform-origin:50% 100%;animation:5.4s ease-out 0s infinite normal none dbk-${hash}-0}`,
        ),
      );
      assert.ok(
        svg.includes('<style>@media (prefers-reduced-motion:no-preference){'),
      );
    });

    it('should divide durations and delays by the animation speed', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              animations: [
                {
                  duration: 5,
                  delay: -1,
                  tracks: {
                    translateY: { keyframes: [{ at: 0, value: 0 }] },
                  },
                },
              ],
            },
          ],
        },
      });
      const svg = new Avatar(style, {
        animation: true,
        animationSpeed: 2,
      }).toString();

      assert.ok(svg.includes('animation:2.5s linear -0.5s infinite'));
    });

    it('should include the animation speed in the class namespace', () => {
      const base = new Avatar(new Style(squash), { animation: true });
      const fast = new Avatar(new Style(squash), {
        animation: true,
        animationSpeed: 2,
      });

      assert.notEqual(hashOf(base.toString()), hashOf(fast.toString()));
    });

    describe('named selection', () => {
      // One named block per element plus an unnamed one, so every selection
      // form has something to include and something to skip.
      const named = {
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              animations: [
                {
                  name: 'sway',
                  duration: 1,
                  tracks: {
                    rotate: {
                      keyframes: [
                        { at: 0, value: 0 },
                        { at: 100, value: 4 },
                      ],
                    },
                  },
                },
              ],
            },
            {
              type: 'element',
              name: 'circle',
              animations: [
                {
                  name: 'blink',
                  duration: 2,
                  tracks: {
                    scaleY: {
                      keyframes: [
                        { at: 0, value: 1 },
                        { at: 50, value: 0.1 },
                      ],
                    },
                  },
                },
                {
                  duration: 3,
                  tracks: {
                    opacity: {
                      keyframes: [
                        { at: 0, value: 1 },
                        { at: 50, value: 0.5 },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
      };

      it('should render only the timelines carrying a selected name', () => {
        const svg = new Avatar(new Style(named), {
          animation: 'blink',
        }).toString();

        assert.equal(svg.match(/animation:/g).length, 1);
        assert.ok(svg.includes('scaleY'));
        assert.ok(!svg.includes('rotate('));
        assert.ok(!svg.includes('opacity:'));
        assert.ok(!svg.includes('<g class="dba-') || svg.includes('scaleY'));
      });

      it('should combine several selected names', () => {
        const svg = new Avatar(new Style(named), {
          animation: ['sway', 'blink'],
        }).toString();

        assert.equal(svg.match(/animation:/g).length, 2);
        assert.ok(svg.includes('rotate('));
        assert.ok(svg.includes('scaleY'));
        assert.ok(!svg.includes('opacity:'));
      });

      it('should play unnamed timelines only with the boolean form', () => {
        const svg = new Avatar(new Style(named), { animation: true }).toString();

        assert.equal(svg.match(/animation:/g).length, 3);
        assert.ok(svg.includes('opacity:'));
      });

      it('should stay static for a name the style does not carry', () => {
        const selected = new Avatar(new Style(named), {
          animation: 'bounce',
        }).toString();
        const off = new Avatar(new Style(named)).toString();

        assert.equal(selected, off);
      });

      it('should record the normalized selection in the resolved options', () => {
        assert.deepEqual(
          new Avatar(new Style(named), { animation: 'blink' }).toJSON().options
            .animation,
          ['blink'],
        );
        assert.deepEqual(
          new Avatar(new Style(named), { animation: ['sway', 'blink'] }).toJSON()
            .options.animation,
          ['sway', 'blink'],
        );
      });

      it('should include the sorted selection in the class namespace', () => {
        const all = new Avatar(new Style(named), { animation: true }).toString();
        const one = new Avatar(new Style(named), {
          animation: 'blink',
        }).toString();
        const both = new Avatar(new Style(named), {
          animation: ['sway', 'blink'],
        }).toString();
        const bothReversed = new Avatar(new Style(named), {
          animation: ['blink', 'sway'],
        }).toString();
        const hashOfNamed = (svg) => svg.match(/dba-([0-9a-f]+)-\d+/)[1];

        assert.notEqual(hashOfNamed(all), hashOfNamed(one));
        assert.notEqual(hashOfNamed(one), hashOfNamed(both));
        assert.equal(hashOfNamed(both), hashOfNamed(bothReversed));
      });
    });

    it('should deduplicate identical keyframes across elements', () => {
      const track = {
        keyframes: [
          { at: 0, value: 0 },
          { at: 100, value: 10 },
        ],
      };
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              animations: [{ duration: 1, tracks: { translateX: track } }],
            },
            {
              type: 'element',
              name: 'circle',
              animations: [{ duration: 2, tracks: { translateX: track } }],
            },
          ],
        },
      });
      const svg = new Avatar(style, { animation: true }).toString();

      assert.equal(svg.match(/@keyframes/g).length, 1);
      assert.equal(svg.match(/animation:/g).length, 2);
    });

    it('should emit per-keyframe easings only when they differ', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              animations: [
                {
                  duration: 1,
                  easing: 'easeOut',
                  tracks: {
                    opacity: {
                      keyframes: [
                        { at: 0, value: 1, easing: 'hold' },
                        {
                          at: 50,
                          value: 0.2,
                          easing: { x1: 0.3, y1: 0, x2: 0.7, y2: 1 },
                        },
                        // easeOut matches the block default: not emitted.
                        { at: 80, value: 0.5, easing: 'easeOut' },
                        // The last keyframe has no segment: never emitted.
                        { at: 100, value: 1, easing: 'hold' },
                      ],
                    },
                  },
                },
              ],
            },
          ],
        },
      });
      const svg = new Avatar(style, { animation: true }).toString();

      assert.ok(
        svg.includes('0%{opacity:1;animation-timing-function:step-end}'),
      );
      assert.ok(
        svg.includes(
          '50%{opacity:0.2;animation-timing-function:cubic-bezier(0.3, 0, 0.7, 1)}',
        ),
      );
      assert.ok(svg.includes('80%{opacity:0.5}'));
      assert.ok(svg.includes('100%{opacity:1}'));
      assert.ok(!svg.includes('100%{opacity:1;'));
    });

    it('should serialize iterations, direction, and fill', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'rect',
              animations: [
                {
                  duration: 1,
                  iterations: 2,
                  direction: 'alternateReverse',
                  fill: 'forwards',
                  tracks: { rotate: { keyframes: [{ at: 0, value: 0 }] } },
                },
              ],
            },
          ],
        },
      });
      const svg = new Avatar(style, { animation: true }).toString();

      assert.ok(svg.includes('animation:1s linear 0s 2 alternate-reverse forwards'));
    });

    it('should animate component references via a wrapped use', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'component',
              name: 'shape',
              animations: [
                {
                  duration: 1,
                  tracks: { rotate: { keyframes: [{ at: 0, value: 0 }] } },
                },
              ],
            },
          ],
        },
        components: {
          shape: {
            width: 20,
            height: 20,
            variants: { a: { elements: [{ type: 'element', name: 'rect' }] } },
          },
        },
      });
      const svg = new Avatar(style, { animation: true }).toString();

      assert.match(svg, /<g class="dba-[0-9a-f]+-0"><use href="#shape-a-[0-9a-f]+"\/><\/g>/);
    });

    it('should share one animated def between two references', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            { type: 'component', name: 'shape' },
            { type: 'component', name: 'shapeRight' },
          ],
        },
        components: {
          shape: {
            width: 20,
            height: 20,
            variants: {
              a: {
                elements: [
                  {
                    type: 'element',
                    name: 'rect',
                    animations: [
                      {
                        duration: 1,
                        tracks: {
                          translateY: { keyframes: [{ at: 0, value: 0 }] },
                        },
                      },
                    ],
                  },
                ],
              },
            },
          },
          shapeRight: { extends: 'shape' },
        },
      });
      const svg = new Avatar(style, { animation: true }).toString();

      // One def holds the wrapped rect. Both <use> tags share it, so the
      // wrapper class and its CSS exist exactly once.
      assert.equal(svg.match(/<use /g).length, 2);
      assert.equal(svg.match(/class="dba-/g).length, 1);
      assert.equal(svg.match(/@keyframes/g).length, 1);
    });

    it('should prune animations together with empty wrappers', () => {
      const style = new Style({
        canvas: {
          width: 100,
          height: 100,
          elements: [
            {
              type: 'element',
              name: 'g',
              animations: [
                {
                  duration: 1,
                  tracks: { opacity: { keyframes: [{ at: 0, value: 1 }] } },
                },
              ],
              children: [{ type: 'component', name: 'maybe' }],
            },
          ],
        },
        components: {
          maybe: {
            width: 20,
            height: 20,
            probability: 0,
            variants: { a: { elements: [{ type: 'element', name: 'rect' }] } },
          },
        },
      });
      const svg = new Avatar(style, { animation: true }).toString();

      assert.ok(!svg.includes('dba-'));
      assert.ok(!svg.includes('<style>'));
    });

    it('should namespace animation classes under idRandomization', () => {
      const options = { animation: true, idRandomization: true };
      const svg = new Avatar(new Style(squash), options).toString();
      const hash = hashOf(svg);

      // The class attribute and the CSS rule still reference the same names.
      assert.ok(svg.includes(`<g class="dba-${hash}-0">`));
      assert.ok(svg.includes(`.dba-${hash}-0{`));
      assert.ok(svg.includes(`@keyframes dbk-${hash}-0{`));

      // Two renders of the same avatar must not select each other's rules.
      const other = new Avatar(new Style(squash), options).toString();

      assert.notEqual(hashOf(other), hash);

      // Without the option the names stay stable for the same input.
      const stable = { animation: true };

      assert.equal(
        hashOf(new Avatar(new Style(squash), stable).toString()),
        hashOf(new Avatar(new Style(squash), stable).toString()),
      );
    });
  });
});
