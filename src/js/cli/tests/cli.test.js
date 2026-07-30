import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { runCli } from './helpers/runCli.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

describe('dicebear CLI', () => {
  let workdir;
  let definition;

  before(() => {
    workdir = fs.mkdtempSync(path.join(os.tmpdir(), 'dicebear-cli-test-'));

    // Use a real, shipped style definition as a custom definition file.
    const source = require.resolve('@dicebear/styles/identicon.json');
    definition = path.join(workdir, 'my-style.json');
    fs.copyFileSync(source, definition);
  });

  after(() => {
    fs.rmSync(workdir, { recursive: true, force: true });
  });

  it('prints the version for --version', () => {
    const result = runCli(['--version']);

    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), pkg.version);
  });

  it('prints help for --help without reading a file', () => {
    const result = runCli(['--help']);

    assert.equal(result.status, 0);
    assert.match(result.stdout, /Commands:/);
    assert.doesNotMatch(result.stderr, /ENOENT/);
  });

  it('lists built-in style commands in --help', () => {
    const result = runCli(['--help']);

    assert.match(result.stdout, /initials \[outputPath\]/);
  });

  it('generates avatars from a built-in style command', () => {
    const out = path.join(workdir, 'out-initials');
    const result = runCli(['initials', out, '--count', '2', '--seed', 'test']);

    assert.equal(result.status, 0, result.stderr);

    const files = fs.readdirSync(out).sort();
    assert.deepEqual(files, ['initials-0.svg', 'initials-1.svg']);
  });

  it('applies style-specific options on a built-in style command', () => {
    // `initials` exposes a `backgroundColor` option; the command must accept
    // it and emit a valid SVG.
    const out = path.join(workdir, 'out-initials-opts');
    const result = runCli([
      'initials',
      out,
      '--seed',
      'abc',
      '--backgroundColor',
      'b6e3f4',
    ]);

    assert.equal(result.status, 0, result.stderr);

    const svg = fs.readFileSync(path.join(out, 'initials-0.svg'), 'utf-8');
    assert.match(svg, /^<svg/);
  });

  it('generates avatars from a definition file', () => {
    const out = path.join(workdir, 'out-definition');
    const result = runCli([definition, out, '--count', '2', '--seed', 'test']);

    assert.equal(result.status, 0, result.stderr);

    const files = fs.readdirSync(out).sort();
    assert.deepEqual(files, ['my-style-0.svg', 'my-style-1.svg']);
  });

  it('generates avatars when flags precede the definition path', () => {
    // Regression: `--count 2 <file>` used to treat the value "2" as the
    // definition path. The definition must still be resolved correctly.
    const out = path.join(workdir, 'out-flags-first');
    const result = runCli(['--count', '2', '--seed', 'abc', definition, out]);

    assert.equal(result.status, 0, result.stderr);
    assert.equal(fs.readdirSync(out).length, 2);
  });

  it('generates avatars when a boolean flag precedes the definition path', () => {
    // Regression: `--json <file>` used to let the parser swallow the path as
    // the value of the boolean flag, loading the wrong file.
    const out = path.join(workdir, 'out-bool-first');
    const result = runCli(['--json', definition, out, '--count', '1']);

    assert.equal(result.status, 0, result.stderr);
    assert.ok(fs.existsSync(path.join(out, 'my-style-0.svg')));
  });

  it('exits with an error for a missing definition file', () => {
    const result = runCli([path.join(workdir, 'does-not-exist.json')]);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /Error:/);
  });
});
