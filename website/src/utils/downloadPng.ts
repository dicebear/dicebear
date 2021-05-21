import { Style, StyleOptions, createAvatar } from '@dicebear/avatars';
import canvg from 'canvg';
import { getFilename } from './getFilename';

export function downloadPng<T>(style: Style<T>, options: StyleOptions<T>) {
  const avatar = createAvatar(style, { width: 1024, height: 1024, ...options, dataUri: false, base64: false });

  const canvas = document.createElement('canvas');
  const renderer = canvg.fromString(canvas.getContext('2d'), avatar);

  renderer.start();

  const link = document.createElement('a');
  link.download = getFilename(options.seed, 'png');
  link.href = canvas.toDataURL('image/png');
  link.click();
  link.remove();

  renderer.stop();

  canvas.remove();
}
