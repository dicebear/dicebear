import { Style, createAvatar, StyleSchema } from '@dicebear/avatars';
import * as path from 'path';
import fs from 'fs-extra';
import { validateInputBySchema } from './validateInputBySchema';
import { outputLicenseBanner } from './outputLicenseBanner';
import sharp from 'sharp';
import cliProgress from 'cli-progress';

export function createStyleCreateAction(name: string, style: Style<any>, schema: StyleSchema) {
  return async (outputPath = '.', options = {}) => {
    const bar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
    const validated = validateInputBySchema(options, schema);
    const promises = [];

    outputLicenseBanner(name, style);

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
  };
}
