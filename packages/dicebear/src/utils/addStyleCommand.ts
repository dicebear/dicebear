import { Style } from '@dicebear/core';
import { createAvatar } from '@dicebear/core';
import yargs from 'yargs';
import cliProgress from 'cli-progress';
import PQueue from 'p-queue';
import os from 'node:os';
import * as path from 'node:path';
import fs from 'fs-extra';
import { exiftool } from 'exiftool-vendored';

import { getStyleCommandSchema } from './getStyleCommandSchema.js';
import { getOptionsBySchema } from './getOptionsBySchema.js';
import { validateInputBySchema } from './validateInputBySchema.js';
import { outputStyleLicenseBanner } from './outputStyleLicenseBanner.js';
import { createRandomSeed } from './createRandomSeed.js';

export function addStyleCommand(
  cli: yargs.Argv<{}>,
  name: string,
  style: Style<any>
) {
  const schema = getStyleCommandSchema(style);

  return cli.command({
    command: `${name} [outputPath]`,
    describe: `Generate "${name}" avatar(s)`,
    builder: (yargs) => {
      return yargs
        .default('outputPath', '.')
        .options(getOptionsBySchema(schema));
    },
    handler: async (argv) => {
      const bar = new cliProgress.SingleBar(
        {},
        cliProgress.Presets.shades_classic
      );

      const validated = validateInputBySchema(argv, schema);

      const format = validated.format as string;
      const count = validated.count as number;
      const includeExif = validated.exif as boolean;
      const json = validated.json as boolean;

      outputStyleLicenseBanner(name, style);

      bar.start(count, 0);

      const queue = new PQueue({ concurrency: os.cpus().length });

      queue.on('next', () => {
        bar.update(count - queue.size - queue.pending);
      });

      const outputPath = path.resolve(process.cwd(), argv.outputPath as string);

      await fs.ensureDir(outputPath);

      for (let i = 0; i < count; i++) {
        queue.add(async () => {
          const fileName = path.resolve(
            process.cwd(),
            outputPath,
            `${name}-${i}.${format}`
          );

          const avatar = createAvatar(
            style,
            count <= 1
              ? validated
              : {
                  ...validated,
                  seed: createRandomSeed(),
                }
          );

          switch (format) {
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

            case 'json':
              await fs.writeJSON(fileName, avatar.toJson(), { spaces: 2 });
              break;
          }

          if (json && 'json' !== format) {
            const jsonFileName = path.resolve(
              process.cwd(),
              outputPath,
              `${name}-${i}.json`
            );

            await fs.writeJSON(jsonFileName, avatar.toJson(), { spaces: 2 });
          }

          bar.increment();
        });
      }

      await queue.onIdle();

      bar.stop();

      exiftool.end();
    },
  });
}
