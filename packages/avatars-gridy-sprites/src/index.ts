// @ts-ignore
import * as gridy from 'gridy-avatars';
import Random from '@dicebear/avatars/lib/random';

type Options = {
  colorful?: boolean;
};

export default function(options: Options = {}) {
  return function(random: Random) {
    let body = random.integer(0, 7);
    let bodyColor = random.integer(0, 7);

    let eyes = random.integer(0, 7);
    let eyesColor = random.integer(0, 7);

    let mouth = random.integer(0, 7);
    let mouthColor = options.colorful ? random.integer(0, 7) : eyesColor;

    return [
      '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 24 24" version="1.1" shape-rendering="crispEdges">',
      gridy(`${body}${bodyColor}${eyes}${eyesColor}${mouth}${mouthColor}`),
      '</svg>'
    ].join('');
  };
}
