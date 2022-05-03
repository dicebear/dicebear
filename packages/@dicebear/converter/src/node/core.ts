import type { Result, Exif, Format, ToFormat } from '../types';
import { promises as fs } from 'node:fs';
import { getMimeType } from '../utils/mime-type.js';
import { ensureSize } from '../utils/svg.js';
import * as tmp from 'tmp-promise';
import { ensurePackage } from '../utils/package-helper.js';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export const toFormat: ToFormat = function (
  svg: string,
  format: Format,
  exif?: Exif
): Result {
  return {
    toDataUri: async () => {
      return toDataUri(await toArrayBuffer(svg, format, exif), format);
    },
    toFile: async (name: string) => {
      return toFile(await toArrayBuffer(svg, format, exif), name);
    },
    toArrayBuffer: async () => {
      return toArrayBuffer(svg, format, exif);
    },
  };
};

async function toDataUri(
  arrayBuffer: ArrayBuffer,
  format: Format
): Promise<string> {
  if (format === 'svg') {
    return `data:${getMimeType(format)};utf8,${encodeURIComponent(
      decoder.decode(arrayBuffer)
    )}`;
  } else {
    const buffer = Buffer.from(arrayBuffer);

    return `data:${getMimeType(format)};base64,${buffer.toString('base64')}`;
  }
}

async function toFile(arrayBuffer: ArrayBuffer, name: string): Promise<void> {
  return fs.writeFile(name, Buffer.from(arrayBuffer));
}

async function toArrayBuffer(
  rawSvg: string,
  format: Format,
  exif?: Exif
): Promise<ArrayBuffer> {
  if (format === 'svg') {
    if (exif) {
      console.warn('Exif is ignored when converting to svg.');
    }

    return encoder.encode(rawSvg);
  }

  await ensurePackage('@resvg/resvg-js', '2.0.0');
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

  if (format === 'jpeg') {
    await ensurePackage('sharp', '0.30.0');
    const sharp = (await import('sharp')).default;

    buffer = await sharp(buffer)
      .flatten({ background: '#ffffff' })
      .toFormat(format)
      .toBuffer();
  }

  if (exif) {
    await ensurePackage('exiftool-vendored', '16.3.0');
    const exiftool = (await import('exiftool-vendored')).exiftool;

    await tmp.withFile(async ({ path }) => {
      await fs.writeFile(path, buffer);
      await exiftool.write(path, exif);
      buffer = await fs.readFile(path);
    });
  }

  return buffer.buffer;
}
