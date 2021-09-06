import type { BinaryResult, Exif, Format, ToFormat } from '../types';
import { promises as fs } from 'node:fs';
import { Blob } from 'node:buffer';
import { getMimeType } from '../utils/mime-type.js';
import { ensureSize } from '../utils/svg.js';
import * as tmp from 'tmp-promise';
import { ensurePackage } from '../utils/package-helper.js';

export const toFormat: ToFormat = function (
  svg: string,
  format: Format,
  exif?: Exif
): BinaryResult {
  const blob = toBlob(svg, format, exif);

  return {
    toDataUri: async () => toDataUri(await blob),
    toFile: async (name: string) => toFile(await blob, name),
    toArrayBuffer: async () => (await blob).arrayBuffer(),
  };
};

async function toDataUri(blob: Blob): Promise<string> {
  if (blob.type === getMimeType('svg')) {
    return `data:${blob.type};utf8,${encodeURIComponent(await blob.text())}`;
  } else {
    const buffer = Buffer.from(await blob.arrayBuffer());

    return `data:image/${blob.type};base64,${buffer.toString('base64')}`;
  }
}

async function toFile(blob: Blob, name: string): Promise<void> {
  return fs.writeFile(name, Buffer.from(await blob.arrayBuffer()));
}

async function toBlob(
  rawSvg: string,
  format: Format,
  exif?: Exif
): Promise<Blob> {
  if (format === 'svg') {
    if (exif) {
      console.warn('Exif is ignored when converting to svg.');
    }

    return new Blob([rawSvg], { type: getMimeType('svg') });
  }

  await ensurePackage('@resvg/resvg-js', '1.4.0');
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

  let buffer = await renderAsync(svg, {
    font: {
      loadSystemFonts: false,
      defaultFontFamily: 'Inter',
      fontFiles: [interRegular.pathname, interBold.pathname],
    },
  });

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

  return new Blob([buffer], { type: getMimeType(format) });
}
