import { Format } from '../types';

export function getMimeType(format: Format): string {
  switch (format) {
    case 'png':
    case 'jpeg':
      return `image/${format}`;
    default:
      return 'image/svg+xml';
  }
}
