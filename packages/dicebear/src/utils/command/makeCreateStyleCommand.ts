import type { Style } from '@dicebear/avatars';
import { Command } from 'commander';
import * as path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import cliProgress from 'cli-progress';
import { validateInputBySchema } from '../validateInputBySchema';
import { outputStyleLicenseBanner } from '../outputStyleLicenseBanner';
import { getOptionsBySchema } from '../getOptionsBySchema';
import mergeAllOf from 'json-schema-merge-allof';

export async function makeCreateStyleCommand(name: string, style: Style<any>) {
  const { createAvatar, schema: coreSchema } = await import('@dicebear/avatars');

  const schema = mergeAllOf(
    {
      allOf: [
        {
          properties: {
            count: {
              title: 'Count',
              description: 'Defines how many avatars to create. Does not work in combination with a "seed".',
              type: 'number',
              default: 1,
            },
            format: {
              title: 'Format',
              type: 'string',
              enum: ['svg', 'png', 'jpg', 'jpeg'],
              default: 'svg',
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
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const validated = validateInputBySchema(options, schema);
    const promises = [];

    outputStyleLicenseBanner(name, style);

    bar.start(validated.count as number, 0);

    outputPath = path.resolve(process.cwd(), outputPath);

    await fs.ensureDir(outputPath);

    for (let i = 0; i < validated.count; i++) {
      promises.push(
        (async () => {
          if (validated.format !== 'svg') {
            validated.base64 = false;
            validated.dataUri = false;

            validated.width = validated.width || validated.height || 512;
            validated.height = validated.width;
          }

          const fileName = path.resolve(process.cwd(), outputPath, `${name}-${i}.${validated.format}`);

          let avatar = createAvatar(style, validated);

          switch (validated.format) {
            case 'png':
              await sharp(Buffer.from(avatar)).png().toFile(fileName);
              break;

            case 'jpg':
            case 'jpeg':
              await sharp(Buffer.from(avatar)).jpeg().toFile(fileName);
              break;

            default:
              await fs.writeFile(fileName, avatar, { encoding: 'utf-8' });
          }

          bar.increment();
        })()
      );
    }

    await Promise.all(promises);

    bar.stop();
  });

  return cmd;
}
