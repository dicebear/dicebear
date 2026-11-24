import * as fs from 'node:fs';
import * as path from 'node:path';

/** Extensions that name a file, never a directory someone meant to create. */
const FILE_EXTENSIONS = new Set([
  'svg',
  'svgz',
  'png',
  'jpg',
  'jpeg',
  'webp',
  'avif',
  'gif',
  'bmp',
  'tif',
  'tiff',
  'ico',
  'heic',
  'heif',
  'jxl',
  'pdf',
  'json',
  'txt',
  'html',
]);

export type OutputTarget =
  | { kind: 'stdout' }
  | { kind: 'file'; path: string; format: string }
  | { kind: 'dir'; path: string };

/**
 * Turns the `--output` value into a target. No value, or `-`, means stdout. A
 * path whose extension names one of the given formats is a single file,
 * unless a directory of that name already exists. A file extension the
 * command cannot write, such as `.gif`, is refused, where it used to create a
 * directory called `avatar.gif`. Everything else is a directory, a dotted name
 * such as `avatars.v2` included.
 */
export function resolveOutputTarget(
  output: string | undefined,
  formats: readonly string[],
): OutputTarget {
  if (output === undefined || output === '' || output === '-') {
    return { kind: 'stdout' };
  }

  const resolved = path.resolve(process.cwd(), output);
  const extension = path.extname(resolved).slice(1).toLowerCase();

  if (formats.includes(extension)) {
    const isDirectory =
      fs.existsSync(resolved) && fs.statSync(resolved).isDirectory();

    if (!isDirectory) {
      return { kind: 'file', path: resolved, format: extension };
    }
  }

  const isDirectory =
    fs.existsSync(resolved) && fs.statSync(resolved).isDirectory();

  if (FILE_EXTENSIONS.has(extension) && !isDirectory) {
    throw new Error(
      `--output ${output} has the extension ".${extension}", which is not ` +
        `one of ${formats.map((format) => `.${format}`).join(', ')}. Use one ` +
        'of these for a file, or a path without an extension for a directory.',
    );
  }

  return { kind: 'dir', path: resolved };
}
