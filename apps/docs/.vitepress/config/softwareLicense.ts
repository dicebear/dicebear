import * as fs from 'node:fs';
import * as path from 'node:path';

/**
 * Full text of the repository's MIT LICENSE. The licenses page prints the
 * copyright line straight from this file instead of hardcoding it, so the
 * page cannot drift from the file it cites.
 */
export const softwareLicense = fs
  .readFileSync(
    path.resolve(import.meta.dirname, '..', '..', '..', '..', 'LICENSE'),
    'utf-8',
  )
  .trim();
