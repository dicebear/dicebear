import type {
  Result,
  Avatar,
  ToJpeg,
  ToPng,
  ToWebp,
  ToAvif,
  Options,
} from './types.js';
import { getMimeType } from './utils/mime-type.js';
import { ensureSize } from './utils/svg-browser.js';

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
 * Browser conversion entry point. Returns a {@link Result} with `toDataUri()`
 * and `toArrayBuffer()` methods that lazily render the avatar to the chosen
 * raster format. Warns when `includeExif` is set, since Exif metadata is
 * only supported by the Node build.
 */
function toFormat(
  avatar: Avatar,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  options: Options = {},
): Result {
  if (options.includeExif) {
    console.warn(
      'The `exif` option is not supported in the browser version of `@dicebear/converter`. \n' +
        'Please use the node version of `@dicebear/converter` to generate images with exif data.',
    );
  }

  const svg = typeof avatar === 'string' ? avatar : avatar.toString();

  return {
    toDataUri: () => toDataUri(svg, format, options),
    toArrayBuffer: () => toArrayBuffer(svg, format, options),
  };
}

/**
 * Returns a `data:` URI for the rendered avatar. The `svg` format is
 * fast-pathed; other formats go through a `<canvas>` rasterization step.
 */
async function toDataUri(
  svg: string,
  format: 'svg' | 'png' | 'jpeg' | 'webp' | 'avif',
  options: Options,
): Promise<string> {
  if ('svg' === format) {
    return `data:${getMimeType(format)};utf8,${encodeURIComponent(svg)}`;
  }

  const canvas = await toCanvas(svg, format, options);

  return canvas.toDataURL(getMimeType(format));
}

/**
 * Returns the rasterized avatar as a raw `ArrayBuffer` by routing the canvas
 * through `canvas.toBlob`.
 */
async function toArrayBuffer(
  rawSvg: string,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  options: Options,
): Promise<ArrayBufferLike> {
  const canvas = await toCanvas(rawSvg, format, options);

  return await new Promise<ArrayBufferLike>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob.arrayBuffer());
      } else {
        reject(new Error('Could not create blob'));
      }
    }, getMimeType(format));
  });
}

/**
 * Renders the SVG into a fresh `<canvas>` of the requested size. JPEG output
 * gets a white background fill so transparent regions don't render black.
 */
async function toCanvas(
  rawSvg: string,
  format: 'png' | 'jpeg' | 'webp' | 'avif',
  options: Options,
): Promise<HTMLCanvasElement> {
  const { svg, size } = ensureSize(rawSvg, options.size);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext('2d');

  if (null === context) {
    throw new Error('Could not get canvas context');
  }

  if (format === 'jpeg') {
    context.fillStyle = 'white';
    context.fillRect(0, 0, size, size);
  }

  const img = document.createElement('img');
  img.width = size;
  img.height = size;

  img.setAttribute('src', await toDataUri(svg, 'svg', options));

  return new Promise((resolve, reject) => {
    img.onload = () => {
      context.drawImage(img, 0, 0, size, size);

      resolve(canvas);
    };

    img.onerror = (e) => reject(e);
  });
}
