import type { Style } from '@dicebear/core';
import { createAvatar, schema as coreSchema } from '@dicebear/core';
import { Command } from 'commander';
import * as path from 'node:path';
import fs from 'fs-extra';
import cliProgress from 'cli-progress';
import { validateInputBySchema } from '../utils/validateInputBySchema.js';
import { outputStyleLicenseBanner } from '../utils/outputStyleLicenseBanner.js';
import { getOptionsBySchema } from '../utils/getOptionsBySchema.js';
import mergeAllOf from 'json-schema-merge-allof';
import PQueue from 'p-queue';
import os from 'node:os';
import { exiftool } from 'exiftool-vendored';

export async function makeStyleCommand(name: string, style: Style<any>) {
  const schema = mergeAllOf(
    {
      allOf: [
        {
          properties: {
            count: {
              title: 'Count',
              description:
                'Defines how many avatars to create. Does not work in combination with a "seed".',
              type: 'number',
              default: 1,
            },
            format: {
              title: 'Format',
              type: 'string',
              enum: ['svg', 'png', 'jpg', 'jpeg'],
              default: 'svg',
            },
            exif: {
              title: 'Include Exif Metadata',
              type: 'boolean',
              default: false,
            },
          },
        },
        coreSchema,
        style.schema,
      ],
      additionalItems: true,
    },
    { ignoreAdditionalProperties: true }
  );

  const cmd = new Command(name);

  cmd.arguments('[outputPath]');

  for (let option of await getOptionsBySchema(schema)) {
    cmd.addOption(option);
  }

  cmd.action(async (outputPath = '.', options = {}) => {
    const bar = new cliProgress.SingleBar(
      {},
      cliProgress.Presets.shades_classic
    );
    const validated = validateInputBySchema(options, schema);
    const count = validated.count as number;
    const includeExif = validated.exif as boolean;

    outputStyleLicenseBanner(name, style);

    bar.start(count, 0);

    const queue = new PQueue({ concurrency: os.cpus().length });

    queue.on('next', () => {
      bar.update(count - queue.size - queue.pending);
    });

    outputPath = path.resolve(process.cwd(), outputPath);

    await fs.ensureDir(outputPath);

    for (let i = 0; i < count; i++) {
      queue.add(async () => {
        const fileName = path.resolve(
          process.cwd(),
          outputPath,
          `${name}-${i}.${validated.format}`
        );

        const avatar = createAvatar(style, validated);

        switch (validated.format) {
          case 'svg':
            await avatar.toFile(fileName);
            break;

          case 'png':
            await avatar.png({ includeExif }).toFile(fileName);
            break;

          case 'jpg':
          case 'jpeg':
            await avatar.jpeg({ includeExif }).toFile(fileName);
            break;
        }

        bar.increment();
      });
    }

    await queue.onIdle();

    bar.stop();

    exiftool.end();
  });

  return cmd;
}
