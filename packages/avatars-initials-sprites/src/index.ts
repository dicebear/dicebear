import Color from '@dicebear/avatars/lib/color';
import Random from '@dicebear/avatars/lib/random';
import { ColorCollection, Color as ColorType } from '@dicebear/avatars/lib/types';

// @ts-ignore
import initials from 'initials';
import Bowser from 'bowser';

type Options = {
  backgroundColors?: Array<keyof ColorCollection>;
  backgroundColorLevel?: keyof ColorType;
  fontSize?: number;
  chars?: number;
  bold?: boolean;
  userAgent?: string;
};

export default function(options: Options = {}) {
  options = {
    backgroundColorLevel: 600,
    fontSize: 50,
    chars: 2,
    userAgent: typeof window !== 'undefined' && window.navigator && window.navigator.userAgent,
    ...options
  };

  let backgroundColors: string[] = [];
  let isInternetExplorer =
    options.userAgent &&
    Bowser.getParser(options.userAgent).satisfies({
      ie: '>0',
      edge: '>0'
    });
  let isSafari =
    options.userAgent &&
    Bowser.getParser(options.userAgent).satisfies({
      safari: '>0'
    });

  Object.keys(Color.collection).forEach((backgroundColor: keyof ColorCollection) => {
    if (
      options.backgroundColors === undefined ||
      options.backgroundColors.length === 0 ||
      options.backgroundColors.indexOf(backgroundColor) !== -1
    ) {
      backgroundColors.push(Color.collection[backgroundColor][options.backgroundColorLevel]);
    }
  });

  return function(random: Random) {
    let backgroundColor = random.pickone(backgroundColors);
    let seedInitials = (initials(random.seed.trim()) as string).toLocaleUpperCase().slice(0, options.chars);
    let fontFamily = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif";

    // prettier-ignore
    return [
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate; background: ${backgroundColor}" viewBox="0 0 1 1" version="1.1">`,
      `<text x="50%" y="50%" style="line-height: 1; ${options.bold ? 'font-weight: bold;' : ''} font-family: ${fontFamily}; font-size: ${options.fontSize / 100}px" ${isInternetExplorer ? 'dy=".35em"' : `dy="${isSafari ? '.05em' : '.1em'}" alignment-baseline="middle"`} fill="#FFF" text-anchor="middle" dominant-baseline="middle">${seedInitials}</text>`,
      '</svg>'
    ].join('');
  };
}
