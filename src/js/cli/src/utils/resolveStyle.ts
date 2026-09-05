import { Style } from '@dicebear/core';
import { createRequire } from 'node:module';
import * as fs from 'node:fs';
import * as path from 'node:path';

import { loadDefinition } from './loadDefinition.js';

const require = createRequire(import.meta.url);

/**
 * Returns the path of the minified definition that `@dicebear/styles` ships
 * for the given style name, or `undefined` when there is no such style. A
 * name that could only be a file path is never looked up.
 */
export function resolveBuiltInPath(name: string): string | undefined {
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name)) {
    return undefined;
  }

  try {
    return require.resolve(`@dicebear/styles/${name}.json`);
  } catch {
    return undefined;
  }
}

/**
 * Lists the names of the built-in styles without parsing a single
 * definition: one directory read of the `@dicebear/styles` dist folder.
 */
export function listBuiltInStyles(): string[] {
  const definitionsDir = path.dirname(
    require.resolve('@dicebear/styles/initials.json'),
  );

  return fs
    .readdirSync(definitionsDir)
    .filter((file) => file.endsWith('.min.json'))
    .map((file) => file.replace(/\.min\.json$/, ''))
    .sort();
}

/**
 * Resolves the `<style>` argument of `create`: a built-in style name or the
 * path of a definition file. Only the requested definition is read.
 */
export function resolveStyle(argument: string): { style: Style; name: string } {
  const builtIn = resolveBuiltInPath(argument);

  if (builtIn) {
    return {
      style: new Style(JSON.parse(fs.readFileSync(builtIn, 'utf-8'))),
      name: argument,
    };
  }

  if (!fs.existsSync(path.resolve(process.cwd(), argument))) {
    throw new Error(
      `Unknown style "${argument}". Pass a built-in style name ` +
        `(${listBuiltInStyles().join(', ')}) or the path of a definition file.`,
    );
  }

  const { style, name } = loadDefinition(argument);

  return { style, name };
}
