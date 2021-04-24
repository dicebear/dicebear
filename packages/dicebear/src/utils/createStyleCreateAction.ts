import { Style, createAvatar, StyleSchema } from '@dicebear/avatars';
import * as path from 'path';
import fs from 'fs-extra';
import { validateInputBySchema } from './validateInputBySchema';
import sharp from 'sharp';

export function createStyleCreateAction(name: string, style: Style<any>, schema: StyleSchema) {
  return async (outputPath = '.', options = {}) => {
    const validated = validateInputBySchema(options, schema);
    const promises = [];

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

          let avatar = Buffer.from(createAvatar(style, validated));

          switch (validated.format) {
            case 'png':
              avatar = await sharp(Buffer.from(avatar)).png().toBuffer();
              break;

            case 'jpg':
            case 'jpeg':
              avatar = await sharp(Buffer.from(avatar)).jpeg().toBuffer();
              break;
          }

          await fs.writeFile(fileName, avatar, { encoding: 'utf-8' });
        })()
      );
    }

    await Promise.all(promises);
  };
}
