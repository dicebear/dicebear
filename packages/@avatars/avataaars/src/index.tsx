import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Random from '@avatars/core/lib/random';
import Avatar from 'avataaars';
import Options from './options';
import getAvatarStyle from './utils/getAvatarStyle';
import getTopType from './utils/getTopType';
import getAccessoriesType from './utils/getAccessoriesType';
import getHatColor from './utils/getHatColor';
import getHairColor from './utils/getHairColor';
import getFacialHairType from './utils/getFacialHairType';
import getFacialHairColor from './utils/getFacialHairColor';
import getClotheType from './utils/getClotheType';
import getClotheColor from './utils/getClotheColor';
import getEyeType from './utils/getEyeType';
import getEyebrowType from './utils/getEyebrowType';
import getMouthType from './utils/getMouthType';
import getSkinColor from './utils/getSkinColor';

export default function (random: Random, options: Options = {}) {
  let jsx = (
    <Avatar
      avatarStyle={getAvatarStyle(options)}
      topType={getTopType(options, random)}
      accessoriesType={getAccessoriesType(options, random)}
      // @ts-ignore
      hatColor={getHatColor(options, random)}
      hairColor={getHairColor(options, random)}
      facialHairType={getFacialHairType(options, random)}
      facialHairColor={getFacialHairColor(options, random)}
      clotheType={getClotheType(options, random)}
      clotheColor={getClotheColor(options, random)}
      eyeType={getEyeType(options, random)}
      eyebrowType={getEyebrowType(options, random)}
      mouthType={getMouthType(options, random)}
      skinColor={getSkinColor(options, random)}
    />
  );

  let rendered = renderToStaticMarkup(jsx);

  if (options.background && options.style === 'circle') {
    rendered = rendered.replace('mask="url(#mask-2)" fill="#65C9FF"', `mask="url(#mask-2)" fill="${options.background}"`);

    options.background = undefined;
  }

  return rendered
    .replace('width="264px"', '')
    .replace('height="280px"', '')
    .replace('viewBox="0 0 264 280"', 'viewBox="-8 0 280 280"');
}
