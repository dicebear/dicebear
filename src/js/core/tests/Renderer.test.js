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
});
