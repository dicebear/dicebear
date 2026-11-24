import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { Style } from '@dicebear/core';

import { runCli } from './helpers/runCli.js';
import { diffDefinition } from '../lib/utils/compare/diffDefinition.js';

const require = createRequire(import.meta.url);

function readStyle(name) {
  return JSON.parse(
    fs.readFileSync(require.resolve(`@dicebear/styles/${name}.json`), 'utf-8'),
  );
}

/** Multiplies every animation duration of a definition. */
function slowDown(node, factor) {
  if (Array.isArray(node)) {
    node.forEach((item) => slowDown(item, factor));
  } else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) {
      if (key === 'duration' && typeof value === 'number') {
        node[key] = value * factor;
      } else {
        slowDown(value, factor);
      }
    }
  }

  return node;
}

describe('compare guards', () => {
  let workdir;
  let gaze;

  before(() => {
    workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'dicebear-guards-test-'));
    gaze = path.join(workdir, 'gaze.json');
    fs.writeFileSync(gaze, JSON.stringify(readStyle('gaze')));
  });

  after(() => {
    fs.rmSync(workdir, { recursive: true, force: true });
  });

  it('reports changed keyframes, which still images cannot show', () => {
    const before = readStyle('gaze');
    const after = slowDown(readStyle('gaze'), 3);
    const changes = diffDefinition(new Style(before), new Style(after));

    assert.ok(changes.length > 0);
    assert.ok(changes.every((change) => change.scope === 'animations'));
  });

  for (const [flag, value] of [
    ['--tolerance', 'abc'],
    ['--tolerance', '-1'],
    ['--tolerance', '101'],
    ['--threshold', '5'],
    ['--threshold', 'abc'],
  ]) {
    it(`refuses ${flag} ${value}`, () => {
      const result = runCli(['compare', gaze, gaze, flag, value]);

      assert.notEqual(result.status, 0);
      assert.match(result.stderr, new RegExp(`The ${flag} value`));
    });
  }

  it('refuses a directory with both x.json and x.min.json', () => {
    const left = path.join(workdir, 'left');
    const right = path.join(workdir, 'right');

    fs.mkdirSync(left);
    fs.mkdirSync(right);
    fs.copyFileSync(gaze, path.join(left, 'gaze.json'));
    fs.copyFileSync(gaze, path.join(right, 'gaze.json'));
    fs.copyFileSync(gaze, path.join(right, 'gaze.min.json'));

    const result = runCli(['compare', left, right, '--seeds', '1']);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /both pair as "gaze"/);
  });
});

describe('output guards', () => {
  let workdir;

  before(() => {
    workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'dicebear-output-test-'));
  });

  after(() => {
    fs.rmSync(workdir, { recursive: true, force: true });
  });

  it('refuses to optimize two files with one basename into one directory', () => {
    const a = path.join(workdir, 'a');
    const b = path.join(workdir, 'b');
    const out = path.join(workdir, 'out');

    fs.mkdirSync(a);
    fs.mkdirSync(b);
    fs.writeFileSync(
      path.join(a, 'x.json'),
      JSON.stringify(readStyle('thumbs')),
    );
    fs.writeFileSync(path.join(b, 'x.json'), JSON.stringify(readStyle('gaze')));

    const result = runCli([
      'optimize',
      path.join(a, 'x.json'),
      path.join(b, 'x.json'),
      '-o',
      out,
    ]);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /would both be written/);
    assert.equal(fs.existsSync(out), false);
  });

  it('reads -o - as stdout', () => {
    const result = runCli(['create', 'initials', '--seed', 'a', '-o', '-']);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /^<svg/);
    assert.equal(fs.existsSync(path.join(process.cwd(), '-')), false);
  });

  it('refuses a file extension the command cannot write', () => {
    const target = path.join(workdir, 'avatar.gif');
    const result = runCli(['create', 'initials', '-o', target]);

    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /extension "\.gif"/);
    assert.equal(fs.existsSync(target), false);
  });

  it('still takes a dotted directory name', () => {
    const target = path.join(workdir, 'avatars.v2');
    const result = runCli(['create', 'initials', '-o', target, '--count', '2']);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readdirSync(target).length, 2);
  });

  it('takes an animation switch before the style name', () => {
    const result = runCli([
      'create',
      '--blinkAnimation',
      'gaze',
      '--seed',
      'a',
    ]);

    assert.equal(result.status, 0, result.stderr);
    assert.match(result.stdout, /@keyframes/);
  });
});
