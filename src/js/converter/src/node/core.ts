import type {
  Result,
  Exif,
  Avatar,
  Options,
  ToPng,
  ToJpeg,
  ToWebp,
  ToAvif,
} from '../types.js';
import { promises as fs } from 'node:fs';
import { getMimeType } from '../utils/mime-type.js';
import {
  getMetadata,
  prepareForResvg,
  type CornerRadius,
} from '../utils/svg.js';
import * as tmp from 'tmp-promise';
import { renderAsync } from '@resvg/resvg-js';
import sharp from 'sharp';
import { exiftool } from 'exiftool-vendored';

export const toPng: ToPng = (avatar: Avatar, options: Options = {}) => {
  return toFormat(avatar, 'png', options);
};

export const toJpeg: ToJpeg = (avatar: Avatar, options: Options = {}) => {
  return toFormat(avatar, 'jpeg', options);
};

export const toWebp: ToWebp = (avatar: Avatar, options: Options = {}) => {
  return toFormat(avatar, 'webp', options);
};

export const toAvif: ToAvif = (avatar: Avatar, options: Options = {}) => {
  return toFormat(avatar, 'avif', options);
};

/**
 * Node conversion entry point. Returns a {@link Result} with `toDataUri()`
 * and `toArrayBuffer()` methods that lazily render the avatar via resvg +
 * sharp, optionally embedding Exif metadata derived from the SVG's
 * `<metadata>` block.
 */
function toFormat(
  avatar: Avatar,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  options: Options,
): Result {
  const svg = typeof avatar === 'string' ? avatar : avatar.toString();

  const exifOption = options.includeExif ?? false;
  const exif = exifOption ? getExif(svg) : {};

  return {
    toDataUri: () => toDataUri(svg, format, exif, options),
    toArrayBuffer: () => toArrayBuffer(svg, format, exif, options),
  };
}

/**
 * Returns a `data:` URI for the rendered avatar. The `svg` format is
 * fast-pathed; raster formats are base64-encoded.
 */
async function toDataUri(
  svg: string,
  format: 'svg' | 'png' | 'jpeg' | 'webp' | 'avif',
  exif: Exif,
  options: Options,
): Promise<string> {
  if (format === 'svg') {
    return `data:${getMimeType(format)};utf8,${encodeURIComponent(svg)}`;
  }

  const buffer = await toBuffer(svg, format, exif, options);

  return `data:${getMimeType(format)};base64,${buffer.toString('base64')}`;
}

/**
 * Returns the rasterized avatar as a raw `ArrayBuffer` by unwrapping the
 * underlying Node `Buffer`.
 */
async function toArrayBuffer(
  rawSvg: string,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  exif: Exif,
  options: Options,
): Promise<ArrayBufferLike> {
  return (await toBuffer(rawSvg, format, exif, options)).buffer;
}

/**
 * Renders the SVG via resvg-js, optionally re-encodes through sharp for
 * non-PNG formats, and writes Exif metadata using exiftool when present.
 */
async function toBuffer(
  rawSvg: string,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  exif: Exif,
  options: Options,
): Promise<Buffer> {
  const hasFonts = Array.isArray(options.fonts);

  // prepareForResvg sets the size, normalizes masks, and strips full-canvas
  // clips in a single parser pass. Only the Node path needs those fixes: the
  // browser build rasterizes through <canvas>, so it inherits the browser's
  // own mask and clip handling.
  const { svg, size, cornerRadius } = prepareForResvg(rawSvg, options.size);

  const rendered = await renderAsync(svg, {
    fitTo: { mode: 'width', value: size },
    font: {
      loadSystemFonts: !hasFonts,
      fontFiles: hasFonts ? options.fonts : undefined,
    },
  });

  let buffer: Buffer;

  if (!cornerRadius && format === 'png') {
    buffer = rendered.asPng();
  } else {
    // A single sharp pipeline from resvg's raw pixels, so the raster is
    // encoded exactly once and never decoded. resvg hands out premultiplied
    // RGBA, and sharp has to be told: read as straight alpha, every
    // translucent pixel comes out darkened (a 25% red turns into 25% of the
    // red channel instead of full red at 25% alpha).
    const raw = {
      width: rendered.width,
      height: rendered.height,
      channels: 4,
      premultiplied: true,
    } as const;

    let image = sharp(rendered.pixels, { raw });

    if (cornerRadius) {
      image.composite([
        {
          input: cornerMask(rendered.width, rendered.height, cornerRadius),
          blend: 'dest-in',
        },
      ]);

      if (format === 'jpeg') {
        // sharp applies flatten before composite regardless of call order,
        // which would punch the corners back out of the flattened image. A
        // raw handoff into a second pipeline keeps the order right without
        // an intermediate encode.
        const { data } = await image.raw().toBuffer({
          resolveWithObject: true,
        });

        // sharp writes raw output with straight alpha, so the flag does not
        // carry over into the second pipeline.
        image = sharp(data, { raw: { ...raw, premultiplied: false } });
      }
    }

    if (format === 'jpeg') {
      image.flatten({ background: '#ffffff' });
    }

    buffer = await image.toFormat(format).toBuffer();
  }

  if (Object.keys(exif).length > 0) {
    buffer = await tmp.withFile(async ({ path }) => {
      await fs.writeFile(path, buffer);
      await exiftool.write(path, exif, { writeArgs: ['-overwrite_original'] });

      return fs.readFile(path);
    });
  }

  return buffer;
}

/**
 * The alpha mask that re-applies the rounded crop of a stripped full-canvas
 * clip (see `prepareForResvg`): composited with `dest-in`, the corners
 * outside the rounded rectangle become transparent, exactly as the SVG clip
 * would have left them. The jpeg flatten downstream turns them white, as it
 * did before.
 */
function cornerMask(
  width: number,
  height: number,
  cornerRadius: CornerRadius,
): Buffer {
  const rx = cornerRadius.rx * width;
  const ry = cornerRadius.ry * height;

  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" rx="${rx}" ry="${ry}" fill="#ffffff"/></svg>`,
  );
}

/**
 * Maps the SVG's embedded `<metadata>` block to an Exif tag set covering
 * IPTC-PhotoMetadata and Google's image license metadata schemas.
 *
 * @see https://www.iptc.org/std/photometadata/specification/IPTC-PhotoMetadata
 * @see https://developers.google.com/search/docs/appearance/structured-data/image-license-metadata
 */
function getExif(svg: string): Exif {
  const metadata = getMetadata(svg);

  const exif: Exif = {};

  if (metadata.title) {
    exif['IPTC:ObjectName'] = metadata.title;
    exif['XMP-dc:Title'] = metadata.title;
  }

  if (metadata.source) {
    exif['XMP-plus:LicensorURL'] = metadata.source;
  }

  if (metadata.creator) {
    exif['IPTC:By-line'] = metadata.creator;
    exif['XMP-dc:Creator'] = metadata.creator;

    exif['IPTC:Credit'] = metadata.creator;
    exif['XMP-photoshop:Credit'] = metadata.creator;
  }

  if (metadata.license) {
    exif['XMP-xmpRights:WebStatement'] = metadata.license;
  }

  if (metadata.copyright) {
    exif['IPTC:CopyrightNotice'] = metadata.copyright;
    exif['XMP-dc:Rights'] = metadata.copyright;
  }

  return exif;
}
