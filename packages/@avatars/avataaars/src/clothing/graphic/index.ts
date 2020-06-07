import { utils } from '@avatars/core';
import bat from './bat';
import bear from './bear';
import cumbia from './cumbia';
import deer from './deer';
import diamond from './diamond';
import hola from './hola';
import pizza from './pizza';
import resist from './resist';
import selena from './selena';
import skull from './skull';
import skullOutline from './skullOutline';

export default (prng: utils.prng.IPrng) => {
  return prng.pick([bat, bear, cumbia, deer, diamond, hola, pizza, resist, selena, skull, skullOutline])();
};
