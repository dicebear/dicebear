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

  const exifOption = options.includeExif ?? false;
  const exif = exifOption ? getExif(svg) : {};

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
  const fonts = options.fonts ?? [];

  let { svg } = ensureSize(rawSvg);

  let buffer = (
    await renderAsync(svg, {
      font: {
        loadSystemFonts: fonts.length === 0,
        fontFiles: fonts.length > 0 ? fonts : undefined,
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
      await exiftool.write(path, exif, undefined, { useMWG: true });
      buffer = await fs.readFile(path);
    });
  }

  return buffer;
}

function getExif(svg: string): Exif {
  const exif: Exif = {};

  const description = svg.match(/<desc>(.*?)<\/desc>/s);

  const title = svg.match(/<dc:title>(.*?)<\/dc:title>/s);
  const creator = svg.match(/<dc:creator>(.*?)<\/dc:creator>/s);
  const source = svg.match(/<dc:source>(.*?)<\/dc:source>/s);
  const rights = svg.match(/<dc:rights>(.*?)<\/dc:rights>/s);

  if (description) {
    exif['Description'] = description[1];
  }

  if (title) {
    exif['Title'] = title[1];
  }

  if (creator) {
    exif['Creator'] = creator[1];
  }

  if (source) {
    exif['Source'] = source[1];
  }

  if (rights) {
    exif['Rights'] = rights[1];
  }

  return exif;
}
