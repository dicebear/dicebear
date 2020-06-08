import blazerAndShirt from './blazerAndShirt';
import blazerAndSweater from './blazerAndSweater';
import collarAndSweater from './collarAndSweater';
import graphicShirt from './graphicShirt';
import hoodie from './hoodie';
import overall from './overall';
import shirtCrewNeck from './shirtCrewNeck';
import shirtScoopNeck from './shirtScoopNeck';
import shirtVNeck from './shirtVNeck';
import type Options from '../options';
import type { utils } from '@avatars/core';
import * as filter from '../utils/filter';
import * as map from '../utils/map';

export default (prng: utils.prng.IPrng, options: Options) => {
  let clothing = filter.byOptionName(options, 'clothes', {
    blazer: [blazerAndShirt, blazerAndSweater],
    sweater: [collarAndSweater],
    shirt: [graphicShirt, shirtCrewNeck, shirtScoopNeck, shirtVNeck],
    hoodie: [hoodie],
    overall: [overall],
  });

  return prng.pick(map.flatten(clothing))(prng, options);
};
