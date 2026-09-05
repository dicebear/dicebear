import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { Style } from '@dicebear/core';

import { runCli } from './helpers/runCli.js';
import { diffDefinition } from '../lib/utils/compare/diffDefinition.js';
import { pairKey } from '../lib/utils/compare/pairInputs.js';

/**
 * A small style: a face that places the eyes, which are only reachable
 * through the face's variant, plus a palette with a constraint and a
 * background.
 */
function baseDefinition() {
  const rect = (x, y, w, h, color) => ({
    name: 'rect',
    type: 'element',
    attributes: {
      x: String(x),
      y: String(y),
      width: String(w),
      height: String(h),
      fill: { type: 'color', name: color },
    },
  });

  return {
    canvas: {
      width: 100,
      height: 100,
      elements: [{ type: 'component', name: 'face' }],
    },
    components: {
      face: {
        width: 100,
        height: 100,
        variants: {
          round: {
            elements: [
              rect(10, 10, 80, 80, 'skin'),
              { type: 'component', name: 'eyes' },
            ],
          },
          square: {
            weight: 2,
            elements: [
              rect(0, 0, 100, 100, 'skin'),
              { type: 'component', name: 'eyes' },
            ],
          },
        },
      },
      eyes: {
        width: 60,
        height: 20,
        probability: 100,
        variants: {
          open: {
            elements: [rect(0, 0, 20, 20, 'eye'), rect(40, 0, 20, 20, 'eye')],
          },
          closed: {
            elements: [rect(0, 8, 20, 4, 'eye'), rect(40, 8, 20, 4, 'eye')],
          },
        },
      },
      brows: { extends: 'eyes' },
    },
    colors: {
      skin: { values: ['#f2d3b1', '#ecad80'], notEqualTo: ['eye'] },
      eye: { values: ['#000000'] },
      background: { values: ['#ffffff'] },
    },
  };
}

const compareArgs = ['--seeds', '2', '--size', '32'];

describe('diffDefinition', () => {
  const diff = (mutate) => {
    const before = baseDefinition();
    const after = baseDefinition();

    mutate(after);

    return diffDefinition(new Style(before), new Style(after));
  };

  it('finds nothing for an identical definition', () => {
    assert.deepEqual(
      diff(() => {}),
      [],
    );
  });

  it('treats a spelled-out default like a missing field', () => {
    const changes = diff((after) => {
      after.components.face.variants.round.weight = 1;
      after.components.face.variants.round.tags = [];
      after.colors.eye.notEqualTo = [];
      delete after.components.eyes.probability;
    });

    assert.deepEqual(changes, []);
  });

  it('reports component, variant and color changes', () => {
    const changes = diff((after) => {
      after.components.eyes.probability = 50;
      after.components.face.variants.square.weight = 3;
      delete after.components.face.variants.round;
      after.components.mouth = {
        width: 10,
        height: 10,
        variants: { smile: { elements: [] } },
      };
      after.components.brows = { extends: 'mouth' };
      after.colors.skin.values = ['#ecad80', '#f2d3b1'];
      after.colors.eye.values = ['#111111'];
      delete after.colors.background;
    });

    assert.deepEqual(changes, [
      {
        scope: 'component',
        kind: 'changed',
        name: 'brows',
        detail: 'extends "eyes" -> "mouth"',
      },
      {
        scope: 'component',
        kind: 'changed',
        name: 'eyes',
        detail: 'probability 100 -> 50',
      },
      { scope: 'variant', kind: 'removed', name: 'face/round' },
      {
        scope: 'variant',
        kind: 'changed',
        name: 'face/square',
        detail: 'weight 2 -> 3',
      },
      { scope: 'component', kind: 'added', name: 'mouth' },
      { scope: 'color', kind: 'removed', name: 'background' },
      {
        scope: 'color',
        kind: 'changed',
        name: 'eye',
        detail: 'values +#111111 -#000000',
      },
      {
        scope: 'color',
        kind: 'changed',
        name: 'skin',
        detail: 'values order changed',
      },
    ]);
  });

  it('reports canvas, meta and animation changes', () => {
    const changes = diff((after) => {
      after.canvas.width = 120;
      after.meta = { license: { name: 'MIT' } };
    });

    assert.deepEqual(changes, [
      {
        scope: 'canvas',
        kind: 'changed',
        name: 'canvas',
        detail: 'width 100 -> 120',
      },
      {
        scope: 'meta',
        kind: 'changed',
        name: 'license',
        detail: 'name unset -> "MIT"',
      },
    ]);
  });
});

describe('pairKey', () => {
  it('matches a built definition with its source', () => {
    assert.equal(pairKey('/a/lorelei.min.json'), 'lorelei');
    assert.equal(pairKey('/b/lorelei.json'), 'lorelei');
  });
});

describe('dicebear compare', () => {
  let workdir;

  const write = (name, definition) => {
    const file = path.join(workdir, name);

    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify(definition));

    return file;
  };

  before(() => {
    workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'dicebear-compare-test-'));
  });

  after(() => {
    fs.rmSync(workdir, { recursive: true, force: true });
  });

  it('reports an identical style and exits 0', () => {
    const before = write('identical/before.json', baseDefinition());
    const after = write('identical/after.json', baseDefinition());
    const result = runCli(['compare', before, after, ...compareArgs]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /after\s+0\/2\s+0\/4\s+-\s+-\s+identical/);
  });

  it('reports a moved element in the variant that carries it', () => {
    const definition = baseDefinition();

    definition.components.eyes.variants.open.elements[0].attributes.x = '10';

    const before = write('moved/before.json', baseDefinition());
    const after = write('moved/after.json', definition);
    const result = runCli(['compare', before, after, ...compareArgs, '--json']);

    assert.equal(result.status, 1);

    const report = JSON.parse(result.stdout);
    const [style] = report.styles;

    assert.equal(style.status, 'changed');
    assert.deepEqual(style.changes, []);
    assert.equal(style.variants.total, 4);
    // The eyes changed, not the faces that place them: the sweep pins the
    // face's eyes to the unchanged variant.
    assert.deepEqual(
      style.variants.different.map((entry) => entry.name),
      ['eyes/open'],
    );
    assert.ok(style.variants.different[0].share > 0);
    assert.ok(style.seeds.different.length > 0);
    assert.equal(report.options.seeds, 2);
  });

  it('keeps a palette change out of the pixel sweeps', () => {
    const definition = baseDefinition();

    definition.colors.skin.values = ['#123456'];

    const before = write('palette/before.json', baseDefinition());
    const after = write('palette/after.json', definition);
    const result = runCli(['compare', before, after, ...compareArgs, '--json']);

    assert.equal(result.status, 1);

    const [style] = JSON.parse(result.stdout).styles;

    assert.equal(style.changes.length, 1);
    assert.equal(style.changes[0].scope, 'color');
    assert.deepEqual(style.variants.different, []);
    assert.ok(style.seeds.different.length > 0);
  });

  it('tolerates differences below --tolerance', () => {
    const definition = baseDefinition();

    definition.components.eyes.variants.open.elements[0].attributes.x = '10';

    const before = write('tolerance/before.json', baseDefinition());
    const after = write('tolerance/after.json', definition);
    const result = runCli([
      'compare',
      before,
      after,
      ...compareArgs,
      '--tolerance',
      '100',
    ]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /identical/);
  });

  it('pairs directories by name and lists unpaired files', () => {
    write('dirs/before/a.json', baseDefinition());
    write('dirs/before/only-before.json', baseDefinition());
    write('dirs/after/a.min.json', baseDefinition());
    write('dirs/after/only-after.json', baseDefinition());

    const result = runCli([
      'compare',
      path.join(workdir, 'dirs/before'),
      path.join(workdir, 'dirs/after'),
      ...compareArgs,
    ]);

    assert.equal(result.status, 1);
    assert.match(result.stdout, /^a\s+0\/2\s+0\/4\s+-\s+-\s+identical/m);
    assert.match(result.stdout, /^only-after\s+.*only in after/m);
    assert.match(result.stdout, /^only-before\s+.*only in before/m);
  });

  it('writes before, after and diff images with --output', () => {
    const definition = baseDefinition();

    definition.components.eyes.variants.open.elements[0].attributes.x = '10';

    const before = write('images/before.json', baseDefinition());
    const after = write('images/after.json', definition);
    const output = path.join(workdir, 'images', 'diff');
    const result = runCli([
      'compare',
      before,
      after,
      ...compareArgs,
      '-o',
      output,
    ]);

    assert.equal(result.status, 1);

    const files = fs.readdirSync(path.join(output, 'after')).sort();

    assert.ok(files.includes('eyes-open.before.png'));
    assert.ok(files.includes('eyes-open.after.png'));
    assert.ok(files.includes('eyes-open.diff.png'));
  });

  it('refuses to compare a file with a directory', () => {
    const file = write('mixed/a.json', baseDefinition());
    const result = runCli(['compare', file, path.dirname(file)]);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /not a file and a directory/);
  });
});
