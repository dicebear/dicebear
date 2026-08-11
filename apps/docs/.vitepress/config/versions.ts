/**
 * The released version of every DiceBear library, read from the workspace at
 * build time.
 *
 * The numbers end up in `llms.txt` and on the AI assistants page, where a
 * stale number is worse than none at all: a model that reads
 * `@dicebear/core@10.2.0` there will happily pin that in a user's
 * `package.json`. Reading the manifests removes the chance of the docs and the
 * packages drifting apart.
 *
 * Two ecosystems carry no version in their manifest. Composer and Go Modules
 * both take it from the Git tag, so PHP and Go get the major derived from the
 * JS core version instead. That is the number those two ecosystems need anyway,
 * for a `require` constraint and for the import path.
 */
import * as fs from 'node:fs/promises';
import * as path from 'node:path';

const srcDir = path.resolve(import.meta.dirname, '../../../../src');

async function readFile(...segments: string[]): Promise<string> {
  return fs.readFile(path.join(srcDir, ...segments), 'utf8');
}

/**
 * Pulls the package's own version out of a manifest, without a parser for the
 * respective format.
 *
 * All three files this runs on (`pyproject.toml`, `Cargo.toml`,
 * `pubspec.yaml`) declare the version in their first section, so the first
 * match belongs to the package itself. The pattern is anchored to the line
 * start, which keeps a dependency's nested `version = …` from matching.
 */
function manifestVersion(source: string, file: string): string {
  const match = source.match(/^version\s*[=:]\s*["']?([^"'\s]+)["']?/m);

  if (!match) {
    throw new Error(`No version found in ${file}.`);
  }

  return match[1];
}

async function packageJsonVersion(...segments: string[]): Promise<string> {
  return JSON.parse(await readFile(...segments, 'package.json')).version;
}

const coreVersion = await packageJsonVersion('js', 'core');

/** Major version of the release train, e.g. `10` for 10.5.0. */
export const majorVersion = coreVersion.split('.')[0];

export interface LibraryVersion {
  /** Human-readable name, as used in the docs navigation. */
  readonly label: string;
  /** Package name in that ecosystem's registry. */
  readonly pkg: string;
  /** Package name of the matching style definitions, if there is one. */
  readonly stylesPkg?: string;
  /** Released version, or a constraint where the registry has no manifest. */
  readonly version: string;
  /** Documentation path on the website. */
  readonly docs: string;
}

export const libraryVersions: readonly LibraryVersion[] = [
  {
    label: 'JavaScript',
    pkg: '@dicebear/core',
    stylesPkg: '@dicebear/styles',
    version: coreVersion,
    docs: '/how-to-use/js-library/',
  },
  {
    label: 'PHP',
    pkg: 'dicebear/core',
    stylesPkg: 'dicebear/styles',
    version: `^${majorVersion}.0`,
    docs: '/how-to-use/php-library/',
  },
  {
    label: 'Python',
    pkg: 'dicebear-core',
    stylesPkg: 'dicebear-styles',
    version: manifestVersion(
      await readFile('python', 'core', 'pyproject.toml'),
      'pyproject.toml',
    ),
    docs: '/how-to-use/python-library/',
  },
  {
    label: 'Rust',
    pkg: 'dicebear-core',
    stylesPkg: 'dicebear-styles',
    version: manifestVersion(
      await readFile('rust', 'core', 'Cargo.toml'),
      'Cargo.toml',
    ),
    docs: '/how-to-use/rust-library/',
  },
  {
    label: 'Go',
    pkg: `github.com/dicebear/dicebear-go/v${majorVersion}`,
    stylesPkg: `github.com/dicebear/styles/v${majorVersion}`,
    version: `v${majorVersion}`,
    docs: '/how-to-use/go-library/',
  },
  {
    label: 'Dart',
    pkg: 'dicebear_core',
    stylesPkg: 'dicebear_styles',
    version: manifestVersion(
      await readFile('dart', 'core', 'pubspec.yaml'),
      'pubspec.yaml',
    ),
    docs: '/how-to-use/dart-library/',
  },
  {
    label: 'CLI',
    pkg: 'dicebear',
    version: await packageJsonVersion('js', 'cli'),
    docs: '/how-to-use/cli/',
  },
  {
    label: 'Converter',
    pkg: '@dicebear/converter',
    version: await packageJsonVersion('js', 'converter'),
    docs: '/how-to-use/js-library/converter/',
  },
];

export const versions = {
  core: coreVersion,
  major: majorVersion,
  /** Version prefix of the HTTP API, e.g. `10.x`. */
  httpApi: `${majorVersion}.x`,
};
