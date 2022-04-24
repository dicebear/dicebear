import type { Result, Exif, Format, ToFormat } from './types';
import { getMimeType } from './utils/mime-type.js';
import { ensureSize } from './utils/svg.js';

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
      return toFile(await toArrayBuffer(svg, format, exif), format, name);
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
    return `data:${getMimeType('svg')};utf8,${encodeURIComponent(
      decoder.decode(arrayBuffer)
    )}`;
  } else {
    let binary = '';

    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;

    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }

    return `data:${getMimeType(format)};base64,${window.btoa(binary)}`;
  }
}

async function toFile(
  arrayBuffer: ArrayBuffer,
  format: Format,
  name: string
): Promise<void> {
  const link = document.createElement('a');
  link.href = await toDataUri(arrayBuffer, format);
  link.download = name;
  link.click();
  link.remove();
}

async function toArrayBuffer(
  rawSvg: string,
  format: Format,
  exif?: Exif
): Promise<ArrayBuffer> {
  if (exif) {
    console.warn(
      'The `exif` option is not supported in the browser version of `@dicebear/converter`.'
    );
    console.warn(
      'Please use the node version of `@dicebear/converter` to generate images with exif data.'
    );
  }

  if (format === 'svg') {
    return encoder.encode(rawSvg);
  }

  let { svg, size } = ensureSize(rawSvg);

  const svgArrayBuffer = encoder.encode(svg);

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

  img.setAttribute('src', await toDataUri(svgArrayBuffer, 'svg'));

  return new Promise((resolve, reject) => {
    img.onload = () => {
      context.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => {
        blob
          ? resolve(blob.arrayBuffer())
          : reject(new Error('Could not create blob'));
      }, `image/${format}`);
    };

    img.onerror = (e) => reject(e);
  });
}
