import type { Result, Exif, Avatar, Options } from '../types.js';
import { promises as fs } from 'node:fs';
import { getMimeType } from '../utils/mime-type.js';
import { ensureSize } from '../utils/svg.js';
import * as tmp from 'tmp-promise';
import { renderAsync } from '@resvg/resvg-js';
import sharp from 'sharp';
import { exiftool } from 'exiftool-vendored';

export function toPng(avatar: Avatar, options: Options = {}): Result {
  return toFormat(avatar, 'png', options);
}

export function toJpeg(avatar: Avatar, options: Options = {}): Result {
  return toFormat(avatar, 'jpeg', options);
}

function toFormat(
  avatar: Avatar,
  format: 'png' | 'jpeg',
  options: Options
): Result {
  const svg = typeof avatar === 'string' ? avatar : avatar.toString();
  const exif = {};

  return {
    toDataUri: () => toDataUri(svg, format, exif, options),
    toArrayBuffer: () => toArrayBuffer(svg, format, exif, options),
  };
}

async function toDataUri(
  svg: string,
  format: 'svg' | 'png' | 'jpeg',
  exif: Exif,
  options: Options
): Promise<string> {
  if (format === 'svg') {
    return `data:${getMimeType(format)};utf8,${encodeURIComponent(svg)}`;
  }

  const buffer = await toBuffer(svg, format, exif, options);

  return `data:${getMimeType(format)};base64,${buffer.toString('base64')}`;
}

async function toArrayBuffer(
  rawSvg: string,
  format: 'png' | 'jpeg',
  exif: Exif,
  options: Options
): Promise<ArrayBufferLike> {
  return (await toBuffer(rawSvg, format, exif, options)).buffer;
}

async function toBuffer(
  rawSvg: string,
  format: 'png' | 'jpeg',
  exif: Exif,
  options: Options
): Promise<Buffer> {
  const fonts = options.fonts;

  let { svg } = ensureSize(rawSvg);

  let buffer = (
    await renderAsync(svg, {
      font: {
        loadSystemFonts: undefined === fonts || fonts.length === 0,
        fontFiles: fonts,
      },
    })
  ).asPng();

  if ('jpeg' === format) {
    buffer = await sharp(buffer)
      .flatten({ background: '#ffffff' })
      .toFormat(format)
      .toBuffer();
  }

  if (Object.keys(exif).length > 0) {
    await tmp.withFile(async ({ path }) => {
      await fs.writeFile(path, buffer);
      await exiftool.write(path, exif);
      buffer = await fs.readFile(path);
    });
  }

  return buffer;
}

function getExif(svg: string): Exif {
  const exif: Exif = {};

  const match = svg.match(/<desc>(.*?)<\/desc>/s);

  if (match) {
    const description = match[1];

    return {
      ImageDescription: description,
      Copyright: description,
    };
  }

  return exif;
}
