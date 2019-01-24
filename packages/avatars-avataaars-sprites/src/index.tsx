import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Random from '@dicebear/avatars/lib/random';
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

export default function(options: Options = {}) {
  return function(random: Random) {
    let jsx = (
      <Avatar
        avatarStyle={getAvatarStyle(options)}
        topType={getTopType(options, random)}
        accessoriesType={getAccessoriesType(options, random)}
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

    return rendered
      .replace('width="264px"', '')
      .replace('height="280px"', '')
      .replace('viewBox="0 0 264 280"', 'viewBox="-8 0 280 280"');
  };
}
