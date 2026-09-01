import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { Style } from '@dicebear/core';

import { runCli } from './helpers/runCli.js';
import { collectUnits, walkElements } from '../lib/utils/definition.js';

const require = createRequire(import.meta.url);

/** Walks every element of every tree in a definition. */
function walk(definition, visit) {
  for (const unit of collectUnits(definition)) {
    walkElements(unit.owner.elements, visit);
  }
}

describe('dicebear --optimize', () => {
  let workdir;

  /**
   * Copies a shipped style into the work directory in the same shape the
   * definition sources are committed in: pretty-printed, trailing newline.
   */
  function fixture(name) {
    const source = require.resolve(`@dicebear/styles/${name}.json`);
    const definition = JSON.parse(fs.readFileSync(source, 'utf-8'));
    const target = path.join(workdir, `${name}.json`);

    fs.writeFileSync(target, `${JSON.stringify(definition, null, 2)}\n`);

    return target;
  }

  const read = (file) => JSON.parse(fs.readFileSync(file, 'utf-8'));

  /**
   * A shipped style with one path that svgo can still compact. Every definition
   * in @dicebear/styles has been through the optimizer, so a fixture that is
   * supposed to have room left has to bring that room itself.
   */
  function unoptimizedFixture() {
    const definition = read(fixture('identicon'));
    const target = path.join(workdir, 'unoptimized.json');

    // svgo rewrites this to "M10 10h10v10h-10z".
    definition.canvas.elements.push({
      name: 'path',
      type: 'element',
      attributes: {
        d: 'M 10.000 10.000 L 20.000 10.000 L 20.000 20.000 L 10.000 20.000 Z',
      },
    });

    fs.writeFileSync(target, `${JSON.stringify(definition, null, 2)}\n`);

    return target;
  }

  before(() => {
    workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'dicebear-optimize-test-'));
  });

  after(() => {
    fs.rmSync(workdir, { recursive: true, force: true });
  });

  it('reports a definition exported from Figma as already optimized', () => {
    const file = fixture('notionists');
    const before = fs.readFileSync(file, 'utf-8');
    const result = runCli([file, '--optimize-check']);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /already optimized/);
    assert.equal(fs.readFileSync(file, 'utf-8'), before);
  });

  it('reports an unoptimized definition and writes nothing', () => {
    const file = unoptimizedFixture();
    const before = fs.readFileSync(file, 'utf-8');
    const result = runCli([file, '--optimize-check']);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /not optimized/);
    assert.match(result.stdout, /-\d+\.\d%/);
    assert.equal(fs.readFileSync(file, 'utf-8'), before);
  });

  it('shrinks an unoptimized definition', () => {
    const file = unoptimizedFixture();
    const before = fs.readFileSync(file, 'utf-8').length;
    const result = runCli([file, '--optimize']);

    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.readFileSync(file, 'utf-8').length < before);

    // A second check now passes, so the two flags agree on what "optimized" is.
    assert.equal(runCli([file, '--optimize-check']).status, 0);
  });

  it('is idempotent', () => {
    const file = fixture('identicon');

    assert.equal(runCli([file, '--optimize']).status, 0);
    const once = fs.readFileSync(file, 'utf-8');

    assert.equal(runCli([file, '--optimize']).status, 0);
    assert.equal(fs.readFileSync(file, 'utf-8'), once);
  });

  it('rebuilds a circle that came back from an editor as a path', () => {
    const file = fixture('identicon');
    const definition = read(file);

    // The same circle, in the three spellings three consecutive trips through
    // Figma produced for it, plus an ellipse in the same shape.
    definition.canvas.elements.push(
      ...[
        'M10 20a7 7 0 1 0 0-14 7 7 0 0 0 0 14',
        'M10 20a7.001 7.001 0 0 0 4.95-11.95A7 7 0 1 0 10 20',
        'M10 20A7 7 0 1 0 8.635 6.135 7 7 0 0 0 10 20',
        'M30 20a5 7 0 1 0 0-14 5 7 0 0 0 0 14',
      ].map((d) => ({ name: 'path', type: 'element', attributes: { d } })),
    );

    fs.writeFileSync(file, `${JSON.stringify(definition, null, 2)}\n`);

    assert.equal(runCli([file, '--optimize']).status, 0);

    const shapes = [];

    walk(read(file), (element) => {
      if (element.name === 'circle' || element.name === 'ellipse') {
        shapes.push({ name: element.name, ...element.attributes });
      }
    });

    assert.deepEqual(shapes, [
      { name: 'circle', cx: '10', cy: '13', r: '7' },
      { name: 'circle', cx: '10', cy: '13', r: '7' },
      { name: 'circle', cx: '10', cy: '13', r: '7' },
      { name: 'ellipse', cx: '30', cy: '13', rx: '5', ry: '7' },
    ]);
  });

  it('rebuilds a circle that came back as bezier curves', () => {
    const file = fixture('identicon');
    const definition = read(file);

    // Larger shapes come out of Figma as curves rather than arcs, because the
    // arc fit svgo attempts on export runs out of room the wider the radius
    // gets. Both of these are shipped marbles paths.
    definition.canvas.elements.push(
      ...[
        'M50 92c19.882 0 36-16.118 36-36S69.882 20 50 20 14 36.118 14 56s16.118 36 36 36',
        'M50 122c29.823 0 54-14.327 54-32S79.823 58 50 58-4 72.327-4 90s24.177 32 54 32',
      ].map((d) => ({ name: 'path', type: 'element', attributes: { d } })),
    );

    fs.writeFileSync(file, `${JSON.stringify(definition, null, 2)}\n`);

    assert.equal(runCli([file, '--optimize']).status, 0);

    const shapes = [];

    walk(read(file), (element) => {
      if (element.name === 'circle' || element.name === 'ellipse') {
        shapes.push({ name: element.name, ...element.attributes });
      }
    });

    assert.deepEqual(shapes, [
      { name: 'circle', cx: '50', cy: '56', r: '36' },
      { name: 'ellipse', cx: '50', cy: '90', rx: '54', ry: '32' },
    ]);
  });

  it('pins the meaningless flag of a half circle', () => {
    const file = fixture('identicon');
    const definition = read(file);

    definition.canvas.elements.push(
      ...[
        // Both arcs draw the same half circle whatever the flag says, so both
        // come out as 0 and stop flipping between exports.
        'M20 1H8a6 6 0 1 0 0 12h12a6 6 0 0 0 0-12',
        // A chord just short of the diameter picks a different center, so this
        // flag carries meaning and has to survive.
        'M8 1a6 6 0 1 0 0 11.998',
      ].map((d) => ({ name: 'path', type: 'element', attributes: { d } })),
    );

    fs.writeFileSync(file, `${JSON.stringify(definition, null, 2)}\n`);

    assert.equal(runCli([file, '--optimize']).status, 0);

    const paths = [];

    walk(read(file), (element) => {
      if (element.name === 'path') {
        paths.push(element.attributes.d);
      }
    });

    assert.ok(paths.includes('M20 1H8a6 6 0 0 0 0 12h12a6 6 0 0 0 0-12'));
    assert.ok(paths.some((d) => d.includes('0 1 0 0 11.998')));
  });

  it('leaves a path that is not a closed ellipse alone', () => {
    const file = fixture('identicon');
    const definition = read(file);

    definition.canvas.elements.push(
      ...[
        // Two arcs running against each other, which draws a lens.
        'M0 0a5 5 0 0 0 10 0 5 5 0 0 1-10 0',
        // A half circle that is one part of a larger outline.
        'M19 109.5v-48a34 34 0 1 1 68 0v48z',
        // Radii that disagree by more than a rounding rest.
        'M10 20a7 7 0 1 0 0-14 7.4 7.4 0 0 0 0 14',
        // Four curves around a center, but with handles that are too short
        // for a circle: this is a rounded blob and has to stay one.
        'M50 10c22 0 40 18 40 40s-18 40-40 40-40-18-40-40 18-40 40-40z',
        // Rectangles keep their straight edges through an editor, so they are
        // not rebuilt either, rounded corners or not.
        'M16.5 6h-5A1.5 1.5 0 0 0 10 7.5V11a1.5 1.5 0 0 0 1.5 1.5h5A1.5 1.5 0 0 0 18 11V7.5A1.5 1.5 0 0 0 16.5 6',
        'M2-.01h1v1.02H2z',
      ].map((d) => ({ name: 'path', type: 'element', attributes: { d } })),
    );

    fs.writeFileSync(file, `${JSON.stringify(definition, null, 2)}\n`);

    assert.equal(runCli([file, '--optimize']).status, 0);

    walk(read(file), (element) => {
      assert.notEqual(element.name, 'circle');
      assert.notEqual(element.name, 'ellipse');
      assert.notEqual(element.name, 'rect');
    });
  });

  it('carries declarative animations through the round-trip', () => {
    const file = fixture('identicon');
    const definition = read(file);

    const pulse = [
      {
        duration: 3,
        easing: 'easeInOut',
        tracks: {
          opacity: {
            keyframes: [
              { at: 0, value: 1 },
              { at: 50, value: 0.3 },
              { at: 100, value: 1 },
            ],
          },
        },
      },
    ];

    definition.canvas.elements.push({
      name: 'g',
      type: 'element',
      animations: pulse,
      children: [
        // Two identical animated sibling paths: without the sibling-index
        // prefix on the carrier attribute, mergePaths would fuse them into
        // one element and halve the animation.
        {
          name: 'path',
          type: 'element',
          attributes: { d: 'M0 0h4v4H0z' },
          animations: pulse,
        },
        {
          name: 'path',
          type: 'element',
          attributes: { d: 'M0 0h4v4H0z' },
          animations: pulse,
        },
      ],
    });

    fs.writeFileSync(file, `${JSON.stringify(definition, null, 2)}\n`);

    assert.equal(runCli([file, '--optimize']).status, 0);

    const after = read(file);
    const found = [];

    walk(after, (element) => {
      if (element.animations) {
        found.push(element.animations);
      }

      assert.equal(element.attributes?.['data-dbanim'], undefined);
    });

    assert.equal(found.length, 3);

    for (const animations of found) {
      assert.deepEqual(animations, pulse);
    }
  });

  it('keeps the animation hooks of an animated style intact', () => {
    // The published @dicebear/styles may not ship an animated style yet, so
    // build the animation shape by hand: a childless marker group that only
    // exists to be matched by `svg:has()`, and a `<style>` element whose CSS
    // must survive byte-identically.
    const file = fixture('identicon');
    const definition = read(file);

    definition.components = {
      ...definition.components,
      animation: {
        width: definition.canvas.width,
        height: definition.canvas.height,
        variants: {
          none: { elements: [] },
          fast: {
            elements: [
              {
                name: 'g',
                type: 'element',
                attributes: { class: 'dbtest-fast' },
              },
              {
                name: 'style',
                type: 'element',
                children: [
                  {
                    type: 'text',
                    value:
                      'svg:has(.dbtest-fast){--dbtest-t:0.5}' +
                      '@media (prefers-reduced-motion: no-preference){' +
                      '@keyframes dbtestBob{50%{transform:translateY(-2px)}}' +
                      '.dbtest-c{animation:dbtestBob calc(var(--dbtest-t,1)*3s) ease-in-out infinite}}',
                  },
                ],
              },
            ],
          },
        },
      },
    };
    definition.canvas.elements.push({ name: 'animation', type: 'component' });

    fs.writeFileSync(file, `${JSON.stringify(definition, null, 2)}\n`);

    const before = read(file);

    assert.equal(runCli([file, '--optimize']).status, 0);

    const after = read(file);

    const collect = (definition) => {
      const classes = [];
      const markers = [];
      const css = [];

      walk(definition, (element) => {
        if (element.attributes?.class) {
          classes.push(element.attributes.class);

          // Childless groups that exist only to be matched by `svg:has()`.
          if (!element.children) {
            markers.push(element.attributes.class);
          }
        }

        if (element.name === 'style') {
          for (const child of element.children ?? []) {
            css.push(child.value);
          }
        }
      });

      return {
        classes: classes.sort(),
        markers: markers.sort(),
        css: css.sort(),
      };
    };

    const a = collect(before);
    const b = collect(after);

    assert.ok(a.markers.length > 0, 'fixture should contain marker groups');
    assert.ok(a.css.length > 0, 'fixture should contain a <style> element');
    assert.deepEqual(b.classes, a.classes);
    assert.deepEqual(b.markers, a.markers);
    assert.deepEqual(b.css, a.css);
  });

  it('keeps variable references intact', () => {
    const file = fixture('initials');
    const before = read(file);

    assert.equal(runCli([file, '--optimize']).status, 0);

    const collect = (definition) => {
      const variables = [];

      walk(definition, (element) => {
        if (element.type === 'text' && typeof element.value === 'object') {
          variables.push(`text:${element.value.name}`);
        }

        for (const [key, value] of Object.entries(element.attributes ?? {})) {
          if (typeof value === 'object' && value.type === 'variable') {
            variables.push(`${key}:${value.name}`);
          }
        }
      });

      return variables.sort();
    };

    const expected = collect(before);

    assert.ok(expected.length > 0, 'fixture should contain variables');
    assert.deepEqual(collect(read(file)), expected);
  });

  it('keeps element ids intact', () => {
    const file = fixture('bottts');
    const before = read(file);

    assert.equal(runCli([file, '--optimize']).status, 0);

    const collect = (definition) => {
      const ids = [];

      walk(definition, (element) => {
        if (element.attributes?.id) {
          ids.push(element.attributes.id);
        }
      });

      return ids.sort();
    };

    const expected = collect(before);

    assert.ok(expected.length > 0, 'fixture should contain ids');
    assert.deepEqual(collect(read(file)), expected);
  });

  it('never resizes a component box', () => {
    for (const name of ['pixel-art', 'shapes', 'bottts', 'thumbs']) {
      const file = fixture(name);
      const before = read(file);

      assert.equal(runCli([file, '--optimize']).status, 0);

      const after = read(file);

      for (const [key, component] of Object.entries(before.components ?? {})) {
        assert.equal(after.components[key].width, component.width, name);
        assert.equal(after.components[key].height, component.height, name);
      }
    }
  });

  it('compresses harder with a lower precision, and stays valid', () => {
    const relaxed = fixture('miniavs');
    const strict = path.join(workdir, 'miniavs-precision-0.json');

    fs.copyFileSync(relaxed, strict);

    assert.equal(runCli([relaxed, '--optimize']).status, 0);
    assert.equal(
      runCli([strict, '--optimize', '--optimize-precision', '0']).status,
      0,
    );

    assert.ok(
      fs.readFileSync(strict, 'utf-8').length <
        fs.readFileSync(relaxed, 'utf-8').length,
    );

    // Throws a StyleValidationError if the result no longer matches the schema.
    new Style(read(strict));
  });

  it('optimizes a definition that carries empty attributes and children', () => {
    const file = fixture('identicon');
    const definition = read(file);

    // Valid per the schema, but the SVG round-trip cannot tell empty from
    // absent, so this used to abort with a "round-trip is not lossless" error.
    definition.canvas.elements.push({
      name: 'g',
      type: 'element',
      attributes: {},
      children: [],
    });

    fs.writeFileSync(file, `${JSON.stringify(definition, null, 2)}\n`);

    const result = runCli([file, '--optimize']);

    assert.equal(result.status, 0, result.stderr);
  });

  it('accepts a boolean flag before the definition path', () => {
    const file = fixture('notionists');
    const result = runCli(['--json', file, '--optimize-check']);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /already optimized/);
  });

  it('rejects an invalid --optimize-precision value', () => {
    const file = fixture('identicon');
    const before = fs.readFileSync(file, 'utf-8');

    for (const value of ['abc', '-1', '9', '2.5']) {
      const result = runCli([
        file,
        '--optimize',
        '--optimize-precision',
        value,
      ]);

      assert.equal(result.status, 1, value);
      assert.match(result.stderr, /optimize-precision/);
      assert.equal(fs.readFileSync(file, 'utf-8'), before);
    }
  });

  it('refuses to optimize a built-in style', () => {
    const result = runCli(['croodles', '--optimize']);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /no definition file to optimize/);
  });
});
