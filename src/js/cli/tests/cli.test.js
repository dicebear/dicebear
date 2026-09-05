import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { runCli, runCliBinary } from './helpers/runCli.js';

const require = createRequire(import.meta.url);
const pkg = require('../package.json');

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47]);

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

  it('lists the three commands in --help', () => {
    const result = runCli(['--help']);

    assert.equal(result.status, 0);
    assert.match(result.stdout, /create <style>/);
    assert.match(result.stdout, /optimize <definition\.\.\.>/);
    assert.match(result.stdout, /compare <before> <after>/);
  });

  it('points a bare style name at the create command', () => {
    const result = runCli(['lorelei']);

    assert.equal(result.status, 1);
    assert.match(result.stderr, /dicebear create lorelei/);
  });

  describe('create', () => {
    it('prints one SVG to stdout and the banner to stderr', () => {
      const result = runCli(['create', 'initials', '--seed', 'Alice']);

      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /^<svg/);
      assert.doesNotMatch(result.stdout, /License/);
      assert.match(result.stderr, /License/);
    });

    it('prints raster formats as raw bytes', () => {
      const result = runCliBinary([
        'create',
        'initials',
        '--seed',
        'Alice',
        '--format',
        'png',
        '--size',
        '32',
      ]);

      assert.equal(result.status, 0, result.stderr.toString());
      assert.ok(result.stdout.subarray(0, 4).equals(PNG_SIGNATURE));
    });

    it('writes a single file and takes the format from its extension', () => {
      const file = path.join(workdir, 'out-file', 'alice.png');
      const result = runCli([
        'create',
        'initials',
        '--seed',
        'Alice',
        '--size',
        '32',
        '-o',
        file,
      ]);

      assert.equal(result.status, 0, result.stderr);
      assert.equal(result.stdout, '');

      const bytes = fs.readFileSync(file);
      assert.ok(bytes.subarray(0, 4).equals(PNG_SIGNATURE));
    });

    it('refuses an --output extension that contradicts --format', () => {
      const result = runCli([
        'create',
        'initials',
        '--format',
        'png',
        '-o',
        path.join(workdir, 'alice.svg'),
      ]);

      assert.equal(result.status, 1);
      assert.match(result.stderr, /does not match --format png/);
    });

    it('writes several avatars into a directory', () => {
      const out = path.join(workdir, 'out-dir');
      const result = runCli(['create', 'initials', '-o', out, '--count', '2']);

      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(fs.readdirSync(out).sort(), [
        'initials-0.svg',
        'initials-1.svg',
      ]);
    });

    it('writes the JSON sidecar in directory mode', () => {
      const out = path.join(workdir, 'out-json');
      const result = runCli([
        'create',
        'initials',
        '-o',
        out,
        '--json',
        '--seed',
        'Alice',
      ]);

      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(fs.readdirSync(out).sort(), [
        'initials-0.json',
        'initials-0.svg',
      ]);
    });

    it('refuses --count above 1 without an output directory', () => {
      const result = runCli(['create', 'initials', '--count', '2']);

      assert.equal(result.status, 1);
      assert.match(result.stderr, /--output <dir>/);
    });

    it('refuses --json without an output directory', () => {
      const result = runCli(['create', 'initials', '--json']);

      assert.equal(result.status, 1);
      assert.match(result.stderr, /--format json/);
    });

    it('rejects an unknown style and lists the built-in ones', () => {
      const result = runCli(['create', 'no-such-style']);

      assert.equal(result.status, 1);
      assert.match(result.stderr, /Unknown style "no-such-style"/);
      assert.match(result.stderr, /lorelei/);
    });

    it('renders from a definition file', () => {
      const out = path.join(workdir, 'out-definition');
      const result = runCli([
        'create',
        definition,
        '-o',
        out,
        '--count',
        '2',
      ]);

      assert.equal(result.status, 0, result.stderr);
      assert.deepEqual(fs.readdirSync(out).sort(), [
        'my-style-0.svg',
        'my-style-1.svg',
      ]);
    });

    it('accepts flags before the style argument', () => {
      // `--count 2` and `--json` used to be mistaken for the definition path
      // in different ways. Both have to leave the style intact.
      const out = path.join(workdir, 'out-flags-first');
      const result = runCli([
        'create',
        '--count',
        '2',
        '--json',
        '--seed',
        'abc',
        definition,
        '-o',
        out,
      ]);

      assert.equal(result.status, 0, result.stderr);
      assert.equal(fs.readdirSync(out).length, 4);
    });

    it('does not read the style name as a value of a list flag', () => {
      const result = runCli([
        'create',
        '--flip',
        'horizontal',
        'initials',
        '--seed',
        'Alice',
      ]);

      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /^<svg/);
    });

    it('splits comma-separated list values', () => {
      const result = runCli([
        'create',
        'initials',
        '--seed',
        'Alice',
        '--backgroundColor',
        'b6e3f4,c0aede',
      ]);

      assert.equal(result.status, 0, result.stderr);
      assert.match(result.stdout, /#(b6e3f4|c0aede)/);
    });

    it('lists the style options in --help', () => {
      const result = runCli(['create', 'initials', '--help']);

      assert.equal(result.status, 0);
      assert.match(result.stdout, /--backgroundColor/);
      assert.match(result.stdout, /-o, --output/);
    });

    it('lists the built-in styles in --help without a style', () => {
      const result = runCli(['create', '--help']);

      assert.equal(result.status, 0);
      assert.match(result.stdout, /lorelei/);
      assert.doesNotMatch(result.stderr, /ENOENT/);
    });

    it('exits with an error for a missing definition file', () => {
      const result = runCli([
        'create',
        path.join(workdir, 'does-not-exist.json'),
      ]);

      assert.equal(result.status, 1);
      assert.match(result.stderr, /Unknown style/);
    });
  });
});
