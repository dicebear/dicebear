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
import pixelArtOptions from './pixelArt';
import pixelArtNeutralOptions from './pixelArtNeutral';
import openPeepsOptions from './openPeeps';
import personasOptions from './personas';
import miniavsOptions from './miniavs';
import bigSmileOptions from './big-smile';

import * as collection from '@dicebear/collection';

export default [
  {
    id: 'pixel-art',
    name: '@dicebear/pixel-art',
    style: collection.pixelArt,
    options: pixelArtOptions,
  },
  {
    id: 'avataaars',
    name: '@dicebear/avatars-avataaars-sprites',
    style: collection.avataaars,
    options: avataaarsOptions,
  },
  {
    id: 'big-smile',
    name: '@dicebear/big-smile',
    style: collection.bigSmile,
    options: bigSmileOptions,
  },
  {
    id: 'bottts',
    name: '@dicebear/avatars-bottts-sprites',
    style: collection.bottts,
    options: botttsOptions,
  },
  {
    id: 'open-peeps',
    name: '@dicebear/open-peeps',
    style: collection.openPeeps,
    options: openPeepsOptions,
  },
  {
    id: 'micah',
    name: '@dicebear/micah',
    style: collection.micah,
    options: micahOptions,
  },
  {
    id: 'miniavs',
    name: '@dicebear/micah',
    style: collection.miniavs,
    options: miniavsOptions,
  },
  {
    id: 'croodles',
    name: '@dicebear/croodles',
    style: collection.croodles,
    options: croodlesOptions,
  },
  {
    id: 'personas',
    name: '@dicebear/personas',
    style: collection.personas,
    options: personasOptions,
  },
  {
    id: 'croodles-neutral',
    name: '@dicebear/croodles-neutral',
    style: collection.croodlesNeutral,
    options: croodlesNeutralOptions,
  },
  {
    id: 'pixel-art-neutral',
    name: '@dicebear/pixel-art-neutral',
    style: collection.pixelArtNeutral,
    options: pixelArtNeutralOptions,
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
] as SpriteCollection[];
