import SpriteCollection from '../types/spriteCollection';

import avataaarsOptions from './avataaars';
import botttsOptions from './bottts';
import gridyOptions from './gridy';
import identiconOptions from './identicon';
import initialsOptions from './initials';
import jdenticonOptions from './jdenticon';
import micahOptions from './micah';
import croodlesOptions from './croodles';
import croodlesNeutralOptions from './croodlesNeutral';
import pixelArtOptions from './pixelArt';
import pixelArtNeutralOptions from './pixelArtNeutral';
import openPeepsOptions from './openPeeps';
import personasOptions from './personas';
import miniavsOptions from './miniavs';
import bigSmileOptions from './bigSmile';
import bigEarsOptions from './bigEars';
import bigEarsNeutralOptions from './bigEarsNeutral';
import adventurerOptions from './adventurer';
import adventurerNeutralOptions from './adventurerNeutral';

import * as collection from '@dicebear/collection';

export default [
  {
    id: 'adventurer',
    name: '@dicebear/adventurer',
    style: collection.adventurer,
    options: adventurerOptions,
  },
  {
    id: 'adventurer-neutral',
    name: '@dicebear/adventurer-neutral',
    style: collection.adventurerNeutral,
    options: adventurerNeutralOptions,
  },
  {
    id: 'avataaars',
    name: '@dicebear/avatars-avataaars-sprites',
    style: collection.avataaars,
    options: avataaarsOptions,
  },
  {
    id: 'big-ears',
    name: '@dicebear/big-ears',
    style: collection.bigEars,
    options: bigEarsOptions,
  },
  {
    id: 'big-ears-neutral',
    name: '@dicebear/big-ears-neutral',
    style: collection.bigEarsNeutral,
    options: bigEarsNeutralOptions,
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
    id: 'gridy',
    name: '@dicebear/avatars-gridy-sprites',
    style: collection.gridy,
    options: gridyOptions,
  },
  {
    id: 'identicon',
    name: '@dicebear/avatars-identicon-sprites',
    style: collection.identicon,
    options: identiconOptions,
  },
  {
    id: 'initials',
    name: '@dicebear/avatars-initials-sprites',
    style: collection.initials,
    options: initialsOptions,
  },
  {
    id: 'jdenticon',
    name: '@dicebear/avatars-jdenticon-sprites',
    style: collection.jdenticon,
    options: jdenticonOptions,
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
    id: 'open-peeps',
    name: '@dicebear/open-peeps',
    style: collection.openPeeps,
    options: openPeepsOptions,
  },
  {
    id: 'personas',
    name: '@dicebear/personas',
    style: collection.personas,
    options: personasOptions,
  },
  {
    id: 'pixel-art',
    name: '@dicebear/pixel-art',
    style: collection.pixelArt,
    options: pixelArtOptions,
  },
  {
    id: 'pixel-art-neutral',
    name: '@dicebear/pixel-art-neutral',
    style: collection.pixelArtNeutral,
    options: pixelArtNeutralOptions,
  },
] as SpriteCollection[];
