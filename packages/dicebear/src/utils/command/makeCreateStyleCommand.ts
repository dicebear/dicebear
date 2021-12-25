import type { Style } from '@dicebear/core';
import { createAvatar, schema as coreSchema } from '@dicebear/core';
import { Command } from 'commander';
import * as path from 'path';
import fs from 'fs-extra';
import sharp from 'sharp';
import { renderAsync } from '@resvg/resvg-js';
import cliProgress from 'cli-progress';
import { validateInputBySchema } from '../validateInputBySchema.js';
import { outputStyleLicenseBanner } from '../outputStyleLicenseBanner.js';
import { getOptionsBySchema } from '../getOptionsBySchema.js';
import mergeAllOf from 'json-schema-merge-allof';

export async function makeCreateStyleCommand(name: string, style: Style<any>) {
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

          const avatar = createAvatar(style, validated);
          const png = await renderAsync(avatar, {
            font: {
              loadSystemFonts: false,
              defaultFontFamily: 'Inter',
              fontFiles: [
                new URL('../../../fonts/inter/inter-regular.otf', import.meta.url).pathname,
                new URL('../../../fonts/inter/inter-bold.otf', import.meta.url).pathname,
              ],
            },
          });

          switch (validated.format) {
            case 'png':
              await fs.writeFile(fileName, png);

              break;

            case 'jpg':
            case 'jpeg':
              await sharp(png).jpeg().toFile(fileName);
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
