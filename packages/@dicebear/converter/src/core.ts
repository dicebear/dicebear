import type { Result, Exif, Format, ToFormat } from './types';
import { getMimeType } from './utils/mime-type.js';
import { ensureSize } from './utils/svg.js';

export const toFormat: ToFormat = function (
  svg: string,
  format: Format,
  exif?: Exif
): Result {
  return {
    toDataUri: async () => {
      return toDataUri(await toBlob(svg, format, exif));
    },
    toFile: async (name: string) => {
      return toFile(await toBlob(svg, format, exif), name);
    },
    toArrayBuffer: async () => {
      return (await toBlob(svg, format, exif)).arrayBuffer();
    },
  };
};

async function toDataUri(blob: Blob): Promise<string> {
  if (blob.type === getMimeType('svg')) {
    return `data:image/svg+xml;utf8,${encodeURIComponent(await blob.text())}`;
  } else {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.readAsDataURL(blob);

      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (e) => reject(e);
    });
  }
}

async function toFile(blob: Blob, name: string): Promise<void> {
  const link = document.createElement('a');
  link.href = await toDataUri(blob);
  link.download = name;
  link.click();
  link.remove();
}

async function toBlob(
  rawSvg: string,
  format: Format,
  exif?: Exif
): Promise<Blob> {
  if (exif) {
    console.warn(
      'The `exif` option is not supported in the browser version of `@dicebear/converter`.'
    );
    console.warn(
      'Please use the node version of `@dicebear/converter` to generate images with exif data.'
    );
  }

  if (format === 'svg') {
    return new Blob([rawSvg], { type: getMimeType('svg') });
  }

  let { svg, size } = ensureSize(rawSvg);

  const svgBlob = new Blob([svg], { type: getMimeType('svg') });

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

  img.setAttribute('src', await toDataUri(svgBlob));

  return new Promise((resolve, reject) => {
    img.onload = () => {
      context.drawImage(img, 0, 0, size, size);

      canvas.toBlob((blob) => {
        blob ? resolve(blob) : reject(new Error('Could not create blob'));
      }, `image/${format}`);
    };

    img.onerror = (e) => reject(e);
  });
}
