import { Style, Avatar } from '@dicebear/core';
import { toJpeg, toPng, toWebp, toAvif } from '@dicebear/converter';
import type { ArgumentsCamelCase } from 'yargs';
import cliProgress from 'cli-progress';
import PQueue from 'p-queue';
import os from 'node:os';
import * as path from 'node:path';
import fs from 'fs-extra';
import { exiftool } from 'exiftool-vendored';

import { extractStyleOptions } from './extractStyleOptions.js';
import { outputStyleLicenseBanner } from './outputStyleLicenseBanner.js';
import { createRandomSeed } from './createRandomSeed.js';
import { writeFile } from './writeFile.js';
import { resolveOutputTarget } from './resolveOutputTarget.js';
import { createFormats, type CreateFormat } from './createCommandOptions.js';

/**
 * Renders one avatar in the given format. Text formats come back as a
 * string, raster formats as the encoded bytes.
 */
async function renderAvatar(
  avatar: Avatar,
  format: CreateFormat,
  options: { includeExif: boolean; size?: number },
): Promise<string | ArrayBufferLike> {
  switch (format) {
    case 'svg':
      return avatar.toString();
    case 'json':
      return JSON.stringify(avatar.toJSON(), null, 2);
    case 'png':
      return toPng(avatar.toString(), options).toArrayBuffer();
    case 'jpg':
    case 'jpeg':
      return toJpeg(avatar.toString(), options).toArrayBuffer();
    case 'webp':
      return toWebp(avatar.toString(), options).toArrayBuffer();
    case 'avif':
      return toAvif(avatar.toString(), options).toArrayBuffer();
  }
}

/**
 * Writes to stdout and resolves once the data has left the process, so the
 * caller can let the process end without truncating a piped output.
 */
function writeStdout(data: string | ArrayBufferLike): Promise<void> {
  const chunk = typeof data === 'string' ? data : new Uint8Array(data);

  return new Promise((resolve, reject) => {
    process.stdout.write(chunk, (error) => (error ? reject(error) : resolve()));
  });
}

/**
 * Handles the `create` command: renders the requested number of avatars in
 * the chosen format and sends them to stdout, a single file, or a directory.
 */
export async function handleCreateCommand(
  argv: ArgumentsCamelCase<Record<string, unknown>>,
  name: string,
  style: Style,
) {
  const count = (argv.count as number) ?? 1;
  const includeExif = (argv.exif as boolean) ?? false;
  const json = (argv.json as boolean) ?? false;
  const size = argv.size as number | undefined;
  const target = resolveOutputTarget(argv.output as string | undefined, [
    ...createFormats,
  ]);

  const explicitFormat = argv.format as CreateFormat | undefined;
  const format: CreateFormat =
    explicitFormat ??
    (target.kind === 'file' ? (target.format as CreateFormat) : 'svg');

  if (target.kind === 'file' && explicitFormat) {
    const wanted = explicitFormat === 'jpg' ? 'jpeg' : explicitFormat;
    const given = target.format === 'jpg' ? 'jpeg' : target.format;

    if (wanted !== given) {
      throw new Error(
        `The --output extension ".${target.format}" does not match ` +
          `--format ${explicitFormat}.`,
      );
    }
  }

  if (target.kind !== 'dir' && count > 1) {
    throw new Error(
      'Writing more than one avatar needs --output <dir>. Without --output ' +
        'a single avatar goes to stdout.',
    );
  }

  if (target.kind !== 'dir' && json) {
    throw new Error(
      '--json saves a JSON file next to each image, which needs ' +
        '--output <dir>. Use --format json to print the metadata instead.',
    );
  }

  outputStyleLicenseBanner(name, style);

  const render = (seed: string) => {
    const avatar = new Avatar(style, {
      ...extractStyleOptions(argv, style),
      seed,
    });

    return {
      avatar,
      data: renderAvatar(avatar, format, { includeExif, size }),
    };
  };

  // With several avatars the seed option is ignored, every file gets its own
  // random seed so that the avatars differ.
  const seedFor = () =>
    count <= 1
      ? ((argv.seed as string) ?? createRandomSeed())
      : createRandomSeed();

  try {
    if (target.kind === 'stdout') {
      await writeStdout(await render(seedFor()).data);

      return;
    }

    if (target.kind === 'file') {
      await writeFile(target.path, await render(seedFor()).data);

      return;
    }

    await fs.ensureDir(target.path);

    const bar =
      count > 1
        ? new cliProgress.SingleBar(
            { stream: process.stderr },
            cliProgress.Presets.shades_classic,
          )
        : undefined;
    const queue = new PQueue({ concurrency: os.cpus().length || 1 });
    const errors: Error[] = [];

    bar?.start(count, 0);

    for (let i = 0; i < count; i++) {
      queue.add(async () => {
        try {
          const fileName = path.join(target.path, `${name}-${i}.${format}`);
          const { avatar, data } = render(seedFor());

          await writeFile(fileName, await data);

          if (json && format !== 'json') {
            await writeFile(
              path.join(target.path, `${name}-${i}.json`),
              JSON.stringify(avatar.toJSON(), null, 2),
            );
          }

          bar?.increment();
        } catch (error) {
          errors.push(
            error instanceof Error ? error : new Error(String(error)),
          );
        }
      });
    }

    await queue.onIdle();

    bar?.stop();

    if (errors.length > 0) {
      throw errors[0];
    }
  } finally {
    if (includeExif) {
      // The converter keeps an exiftool process around for Exif writes. It
      // has to be told to stop, otherwise it lingers after the last write.
      await exiftool.end();
    }
  }
}
