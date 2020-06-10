import angry from './angry';
import angryNatural from './angryNatural';
import default_ from './default';
import defaultNatural from './defaultNatural';
import flatNatural from './flatNatural';
import frownNatural from './frownNatural';
import raisedExcited from './raisedExcited';
import raisedExcitedNatural from './raisedExcitedNatural';
import sadConcerned from './sadConcerned';
import sadConcernedNatural from './sadConcernedNatural';
import unibrowNatural from './unibrowNatural';
import upDown from './upDown';
import upDownNatural from './upDownNatural';
import type { utils } from '@avatars/core';
import type Options from '../options';
import * as filter from '../utils/filter';

export default (prng: utils.prng.IPrng, options: Options) => {
  let eyebrows = filter.byOptionName(options, 'eyebrows', {
    angry,
    angryNatural,
    default: default_,
    defaultNatural,
    flatNatural,
    raisedExcited,
    raisedExcitedNatural,
    sadConcerned,
    sadConcernedNatural,
    upDown,
    upDownNatural,
    frownNatural,
    unibrowNatural,
  });

  return prng.pick(Object.values(eyebrows))();
};
