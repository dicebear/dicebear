import fs from 'fs-extra';
import path from 'node:path';

/**
 * Writes a string or binary buffer to disk, refusing to overwrite an
 * existing file. Creates intermediate directories as needed.
 */
export async function writeFile(
  filePath: string,
  content: string | ArrayBufferLike,
) {
  if (fs.existsSync(filePath)) {
    throw new Error(`File already exists at ${filePath}`);
  }

  await fs.ensureDir(path.dirname(filePath));

  if (typeof content === 'string') {
    await fs.writeFile(filePath, content);
  } else {
    await fs.writeFile(filePath, new Uint8Array(content));
  }
}
