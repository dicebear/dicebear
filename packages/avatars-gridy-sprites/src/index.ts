// @ts-ignore
import { inner } from 'gridy-avatars/dist/avatars';
import Random from '@dicebear/avatars/lib/random';

type Options = {
  colorful?: boolean;
};

export default function(random: Random, options: Options = {}) {
  let body = random.integer(0, 7);
  let bodyColor = random.integer(0, 7);

  let eyes = random.integer(0, 7);
  let eyesColor = random.integer(0, 7);

  let mouth = random.integer(0, 7);
  let mouthColor = options.colorful ? random.integer(0, 7) : eyesColor;

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" version="1.1">',
    inner(`${body}${bodyColor}${eyes}${eyesColor}${mouth}${mouthColor}`),
    '</svg>'
  ].join('');
}
