import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import type { IStyle } from '@avatars/core';
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

const style: IStyle<Options> = function (prng, options = {}) {
  let jsx = (
    <Avatar
      avatarStyle={getAvatarStyle(options)}
      topType={getTopType(options, prng)}
      accessoriesType={getAccessoriesType(options, prng)}
      // @ts-ignore
      hatColor={getHatColor(options, prng)}
      hairColor={getHairColor(options, prng)}
      facialHairType={getFacialHairType(options, prng)}
      facialHairColor={getFacialHairColor(options, prng)}
      clotheType={getClotheType(options, prng)}
      clotheColor={getClotheColor(options, prng)}
      eyeType={getEyeType(options, prng)}
      eyebrowType={getEyebrowType(options, prng)}
      mouthType={getMouthType(options, prng)}
      skinColor={getSkinColor(options, prng)}
    />
  );

  let rendered = renderToStaticMarkup(jsx);

  if (options.background && options.style === 'circle') {
    rendered = rendered.replace(
      'mask="url(#mask-2)" fill="#65C9FF"',
      `mask="url(#mask-2)" fill="${options.background}"`
    );

    options.background = undefined;
  }

  return rendered
    .replace('width="264px"', '')
    .replace('height="280px"', '')
    .replace('viewBox="0 0 264 280"', 'viewBox="-8 0 280 280"');
};

export default style;
