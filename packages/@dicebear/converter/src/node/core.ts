import type { Result, Exif, Format, ToFormat } from '../types.js';
import { promises as fs } from 'node:fs';
import { getMimeType } from '../utils/mime-type.js';
import { ensureSize } from '../utils/svg.js';
import * as tmp from 'tmp-promise';
import { getEncoder } from '../utils/text.js';

export const toFormat: ToFormat = function (
  svg: string,
  format: Format,
  exif?: Exif
): Result {
  return {
    toDataUri: () => toDataUri(svg, format, exif),
    toFile: (name: string) => toFile(name, svg, format, exif),
    toArrayBuffer: () => toArrayBuffer(svg, format, exif),
  };
};

async function toDataUri(
  svg: string,
  format: Format,
  exif?: Exif
): Promise<string> {
  if (format === 'svg') {
    return `data:${getMimeType(format)};utf8,${encodeURIComponent(svg)}`;
  }

  const buffer = await toBuffer(svg, format, exif);

  return `data:${getMimeType(format)};base64,${buffer.toString('base64')}`;
}

async function toFile(
  name: string,
  svg: string,
  format: Format,
  exif?: Exif
): Promise<void> {
  if (format === 'svg') {
    await fs.writeFile(name, svg);
    return;
  }

  await fs.writeFile(name, await toBuffer(svg, format, exif));
}

async function toArrayBuffer(
  rawSvg: string,
  format: Format,
  exif?: Exif
): Promise<ArrayBufferLike> {
  if (format === 'svg') {
    return getEncoder().encode(rawSvg);
  }

  return (await toBuffer(rawSvg, format, exif)).buffer;
}

async function toBuffer(
  rawSvg: string,
  format: Exclude<Format, 'svg'>,
  exif?: Exif
): Promise<Buffer> {
  const { renderAsync } = await import('@resvg/resvg-js');

  const interRegular = new URL(
    '../../fonts/inter/inter-regular.otf',
    import.meta.url
  );

  const interBold = new URL(
    '../../fonts/inter/inter-bold.otf',
    import.meta.url
  );

  let { svg } = ensureSize(rawSvg);

  let buffer = (
    await renderAsync(svg, {
      font: {
        loadSystemFonts: false,
        defaultFontFamily: 'Inter',
        fontFiles: [interRegular.pathname, interBold.pathname],
      },
    })
  ).asPng();

  if ('jpeg' === format) {
    const sharp = (await import('sharp')).default;

    buffer = await sharp(buffer)
      .flatten({ background: '#ffffff' })
      .toFormat(format)
      .toBuffer();
  }

  if (exif) {
    const exiftool = (await import('exiftool-vendored')).exiftool;

    buffer = await tmp.withFile(async ({ path }) => {
      await fs.writeFile(path, buffer);
      await exiftool.write(path, exif, ['-overwrite_original']);
      
      return fs.readFile(path);
    });
  }

  return buffer;
}
