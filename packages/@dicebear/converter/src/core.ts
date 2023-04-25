import type { Result, Exif, Format, ToFormat } from './types.js';
import { getMimeType } from './utils/mime-type.js';
import { ensureSize } from './utils/svg.js';
import { getEncoder } from './utils/text.js';

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
  if ('svg' === format) {
    return `data:${getMimeType(format)};utf8,${encodeURIComponent(svg)}`;
  }

  const canvas = await toCanvas(svg, format, exif);

  return canvas.toDataURL(getMimeType(format));
}

async function toArrayBuffer(
  rawSvg: string,
  format: Format,
  exif?: Exif
): Promise<ArrayBufferLike> {
  if ('svg' === format) {
    return getEncoder().encode(rawSvg);
  }

  const canvas = await toCanvas(rawSvg, format, exif);

  return await new Promise<ArrayBufferLike>((resolve, reject) => {
    canvas.toBlob((blob) => {
      blob
        ? resolve(blob.arrayBuffer())
        : reject(new Error('Could not create blob'));
    }, getMimeType(format));
  });
}

async function toFile(
  name: string,
  svg: string,
  format: Format,
  exif?: Exif
): Promise<void> {
  const link = document.createElement('a');
  link.href = await toDataUri(svg, format, exif);
  link.download = name;
  link.click();
  link.remove();
}

async function toCanvas(
  rawSvg: string,
  format: Exclude<Format, 'svg'>,
  exif?: Exif
): Promise<HTMLCanvasElement> {
  if (exif) {
    console.warn(
      'The `exif` option is not supported in the browser version of `@dicebear/converter`. \n' +
        'Please use the node version of `@dicebear/converter` to generate images with exif data.'
    );
  }

  let { svg, size } = ensureSize(rawSvg);

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

  var img = document.createElement('img');
  img.width = size;
  img.height = size;

  img.setAttribute('src', await toDataUri(svg, 'svg'));

  return new Promise((resolve, reject) => {
    img.onload = () => {
      context.drawImage(img, 0, 0, size, size);

      resolve(canvas);
    };

    img.onerror = (e) => reject(e);
  });
}
