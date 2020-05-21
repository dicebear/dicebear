import { IStyle } from '@avatars/core';
import IOptions from '../options';
import * as paths from './paths';
import * as colors from './colors';
import { darkerThan, brighterOrDarkerThan } from '../utils/color';

const style: IStyle<IOptions> = function (random, options = {}) {
  options = {
    femaleAccessoriesProbability: 15,
    femaleGlassesProbability: 25,
    femaleHatProbability: 5,
    ...options,
  };

  let skinColor = random.pick(colors.skin(options.skinColor));
  let hairColor = brighterOrDarkerThan(random.pick(colors.hair()), skinColor, 17);
  let eyesColor = random.pick(colors.eyes());
  let eyebrowsColor = darkerThan(darkerThan(hairColor, skinColor, 7), hairColor, 10);
  let accessoriesColor = random.pick(colors.accessories());
  let mouthColor = brighterOrDarkerThan(random.pick(colors.mouth()), skinColor, 10);
  let glassesColor = random.pick(colors.glasses());
  let clothesColor = random.pick(colors.clothes());
  let hatColor = random.pick(colors.hat());

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="isolation:isolate" viewBox="0 0 20 20" version="1.1" shape-rendering="crispEdges">',
    random.pick(paths.head(skinColor)),
    random.pick(paths.eyes(eyesColor)),
    random.pick(paths.eyebrows(eyebrowsColor)),
    random.bool(options.femaleAccessoriesProbability) ? random.pick(paths.accessories(accessoriesColor)) : '',
    random.pick(paths.mouth(mouthColor)),
    random.bool(options.femaleGlassesProbability) ? random.pick(paths.glasses(glassesColor)) : '',
    random.pick(paths.clothes(clothesColor)),
    random.pick(paths.hair(hairColor)),
    random.bool(options.femaleHatProbability) ? random.pick(paths.hat(hatColor)) : '',
    '</svg>',
  ].join('');
};

export default style;
