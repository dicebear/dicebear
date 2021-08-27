import SpriteCollection from '../types/spriteCollection';

import avataaarsOptions from './avataaars';
import botttsOptions from './bottts';
import femaleOptions from './female';
import humanOptions from './human';
import gridyOptions from './gridy';
import identiconOptions from './identicon';
import initialsOptions from './initials';
import jdenticonOptions from './jdenticon';
import maleOptions from './male';
import micahOptions from './micah';
import croodlesOptions from './croodles';
import croodlesNeutralOptions from './croodlesNeutral';

import * as collection from '@dicebear/collection';

export default [
  {
    id: 'male',
    name: '@dicebear/avatars-male-sprites',
    style: collection.male,
    options: maleOptions,
  },
  {
    id: 'female',
    name: '@dicebear/avatars-female-sprites',
    style: collection.female,
    options: femaleOptions,
  },
  {
    id: 'human',
    name: '@dicebear/avatars-human-sprites',
    style: collection.human,
    options: humanOptions,
  },
  {
    id: 'avataaars',
    name: '@dicebear/avatars-avataaars-sprites',
    style: collection.avataaars,
    options: avataaarsOptions,
  },
  {
    id: 'bottts',
    name: '@dicebear/avatars-bottts-sprites',
    style: collection.bottts,
    options: botttsOptions,
  },
  {
    id: 'micah',
    name: '@dicebear/micah',
    style: collection.micah,
    options: micahOptions,
  },
  {
    id: 'croodles',
    name: '@dicebear/croodles',
    style: collection.croodles,
    options: croodlesOptions,
  },
  {
    id: 'croodles-neutral',
    name: '@dicebear/croodles-neutral',
    style: collection.croodlesNeutral,
    options: croodlesNeutralOptions,
  },
  {
    id: 'initials',
    name: '@dicebear/avatars-initials-sprites',
    style: collection.initials,
    options: initialsOptions,
  },
  {
    id: 'identicon',
    name: '@dicebear/avatars-identicon-sprites',
    style: collection.identicon,
    options: identiconOptions,
  },
  {
    id: 'jdenticon',
    name: '@dicebear/avatars-jdenticon-sprites',
    style: collection.jdenticon,
    options: jdenticonOptions,
  },
  {
    id: 'gridy',
    name: '@dicebear/avatars-gridy-sprites',
    style: collection.gridy,
    options: gridyOptions,
  },
] as SpriteCollection[];
