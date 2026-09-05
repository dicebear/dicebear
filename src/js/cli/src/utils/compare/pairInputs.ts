import * as fs from 'node:fs';
import * as path from 'node:path';

export interface InputPair {
  name: string;
  before?: string;
  after?: string;
}

/**
 * The key two files are matched on: the basename without `.json`, with the
 * `.min` of a built definition stripped too, so `lorelei.min.json` from the
 * package pairs with `lorelei.json` from the source tree.
 */
export function pairKey(file: string): string {
  return path
    .basename(file)
    .replace(/\.min\.json$/, '')
    .replace(/\.json$/, '');
}

function listDefinitions(dir: string): Map<string, string> {
  const result = new Map<string, string>();

  for (const file of fs.readdirSync(dir).sort()) {
    if (!file.endsWith('.json')) {
      continue;
    }

    result.set(pairKey(file), path.join(dir, file));
  }

  return result;
}

/**
 * Pairs the `<before>` and `<after>` arguments: two files form one pair,
 * two directories are matched file by file on {@link pairKey}. Files that
 * only exist on one side come back with the other side missing.
 */
export function pairInputs(before: string, after: string): InputPair[] {
  const beforePath = path.resolve(process.cwd(), before);
  const afterPath = path.resolve(process.cwd(), after);

  for (const candidate of [beforePath, afterPath]) {
    if (!fs.existsSync(candidate)) {
      throw new Error(`No such file or directory: ${candidate}`);
    }
  }

  const beforeIsDir = fs.statSync(beforePath).isDirectory();
  const afterIsDir = fs.statSync(afterPath).isDirectory();

  if (beforeIsDir !== afterIsDir) {
    throw new Error(
      'Compare two definition files or two directories, not a file and a ' +
        'directory.',
    );
  }

  if (!beforeIsDir) {
    return [{ name: pairKey(afterPath), before: beforePath, after: afterPath }];
  }

  const beforeFiles = listDefinitions(beforePath);
  const afterFiles = listDefinitions(afterPath);
  const names = Array.from(
    new Set([...beforeFiles.keys(), ...afterFiles.keys()]),
  ).sort();

  return names.map((name) => ({
    name,
    before: beforeFiles.get(name),
    after: afterFiles.get(name),
  }));
}
