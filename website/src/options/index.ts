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

import * as avataaars from '@dicebear/avatars-avataaars-sprites';
import * as bottts from '@dicebear/avatars-bottts-sprites';
import * as female from '@dicebear/avatars-female-sprites';
import * as human from '@dicebear/avatars-human-sprites';
import * as gridy from '@dicebear/avatars-gridy-sprites';
import * as identicon from '@dicebear/avatars-identicon-sprites';
import * as initials from '@dicebear/avatars-initials-sprites';
import * as jdenticon from '@dicebear/avatars-jdenticon-sprites';
import * as male from '@dicebear/avatars-male-sprites';
import * as micah from '@dicebear/micah';
import SpriteCollection from '../types/spriteCollection';

export default [
  {
    id: 'male',
    name: '@dicebear/avatars-male-sprites',
    style: male,
    options: maleOptions,
  },
  {
    id: 'female',
    name: '@dicebear/avatars-female-sprites',
    style: female,
    options: femaleOptions,
  },
  {
    id: 'human',
    name: '@dicebear/avatars-human-sprites',
    style: human,
    options: humanOptions,
  },
  {
    id: 'avataaars',
    name: '@dicebear/avatars-avataaars-sprites',
    style: avataaars,
    options: avataaarsOptions,
  },
  {
    id: 'bottts',
    name: '@dicebear/avatars-bottts-sprites',
    style: bottts,
    options: botttsOptions,
  },
  {
    id: 'micah',
    name: '@dicebear/micah',
    style: micah,
    options: micahOptions,
  },
  {
    id: 'initials',
    name: '@dicebear/avatars-initials-sprites',
    style: initials,
    options: initialsOptions,
  },
  {
    id: 'identicon',
    name: '@dicebear/avatars-identicon-sprites',
    style: identicon,
    options: identiconOptions,
  },
  {
    id: 'jdenticon',
    name: '@dicebear/avatars-jdenticon-sprites',
    style: jdenticon,
    options: jdenticonOptions,
  },
  {
    id: 'gridy',
    name: '@dicebear/avatars-gridy-sprites',
    style: gridy,
    options: gridyOptions,
  },
] as SpriteCollection[];
