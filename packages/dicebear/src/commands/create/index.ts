import type { CommandModule } from 'yargs';
import type { Style } from '@dicebear/core';
import { createAvatar } from '@dicebear/core';
import cliProgress from 'cli-progress';
import PQueue from 'p-queue';
import os from 'node:os';
import * as path from 'node:path';
import fs from 'fs-extra';
import { exiftool } from 'exiftool-vendored';
import * as collection from '@dicebear/collection';
import { toPng, toJpeg } from '@dicebear/converter';

import { getSchema } from './utils/getSchema.js';
import { getOptionsBySchema } from './utils/getOptionsBySchema.js';
import { validateInputBySchema } from './utils/validateInputBySchema.js';
import { outputStyleLicenseBanner } from './utils/outputStyleLicenseBanner.js';
import { createRandomSeed } from './utils/createRandomSeed.js';

export const createCommand: CommandModule = {
  command: `create`,
  describe: `Generate avatars`,
  builder: async (yargs) => {
    for (let name of Object.keys(collection)) {
      const style = collection[name as keyof typeof collection] as Style<any>;
      const schema = getSchema(style);

      yargs.command({
        command: `${name} [outputPath]`,
        describe: `Generate "${name}" avatars`,
        builder: (yargs) => {
          return yargs
            .default('outputPath', '.')
            .options(getOptionsBySchema(getSchema(style)));
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

          const outputPath = path.resolve(
            process.cwd(),
            argv.outputPath as string
          );

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
                  await fs.writeFile(fileName, avatar.toString());
                  break;

                case 'png':
                  await fs.writeFile(
                    fileName,
                    Buffer.from(
                      await toPng(avatar, { includeExif }).toArrayBuffer()
                    )
                  );
                  break;

                case 'jpg':
                case 'jpeg':
                  await fs.writeFile(
                    fileName,
                    Buffer.from(
                      await toJpeg(avatar, {
                        includeExif,
                      }).toArrayBuffer()
                    )
                  );
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

                await fs.writeJSON(jsonFileName, avatar.toJson(), {
                  spaces: 2,
                });
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

    return yargs;
  },
  handler: async (argv) => {},
};
