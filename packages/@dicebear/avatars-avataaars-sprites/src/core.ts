import { Style, StyleSchema } from '@dicebear/avatars';
import { Options } from './options';
import * as utils from './utils';
import { palette } from './colors';

import { schema } from './schema';

export const style: Style<Options> = {
  meta: {
    title: 'Avataaars',
    creator: 'Pablo Stanley',
    contributor: 'Florian Körner',
    source: 'https://avataaars.com/',
    license: {
      name: 'Other - Free for personal and commercial use',
      url: 'https://avataaars.com/',
    },
  },
  schema,
  create: ({ prng, options }) => {
    let noseType = utils.getNoseType();
    let skinType = utils.getSkinType();
    let skinColor = utils.getSkinColor(options, prng);
    let top = utils.getTopType(options, prng);
    let facialHairType = utils.getFacialHairType(options, prng);
    let facialHairColor = utils.getFacialHairColor(options, prng);
    let clotheType = utils.getClotheType(options, prng);
    let clotheGraphicType = utils.getClotheGraphicType(options, prng);
    let clotheColor = utils.getClotheColor(options, prng);
    let eyeType = utils.getEyeType(options, prng);
    let eyebrowType = utils.getEyebrowType(options, prng);
    let mouthType = utils.getMouthType(options, prng);
    let accessoriesType = utils.getAccessoriesType(options, prng);
    let accessoriesColor = utils.getAccessoriesColor(options, prng);
    let hatColor = utils.getHatColor(options, prng);
    let hairColor = utils.getHairColor(options, prng);

    const group = (content: string, x: number, y: number) => {
      return content.length > 0 ? `<g transform="translate(${x}, ${y})">${content}</g>` : '';
    };

    const topPath = group(top.path(top.isHat ? hatColor : hairColor), 7, 0);

    let body = `
      ${group(skinType(skinColor), 40, 36)}
      ${group(clotheType(clotheColor, clotheGraphicType()), 8, 170)}
      ${group(mouthType(), 86, 134)}
      ${group(noseType(), 112, 122)}
      ${group(eyeType(), 84, 90)}
      ${group(eyebrowType(), 84, 82)}
      ${0 === top.zIndex ? topPath : ''}
      ${facialHairType ? group(facialHairType(facialHairColor), 56, 72) : ''}
      ${1 === top.zIndex ? topPath : ''}
      ${accessoriesType ? group(accessoriesType(accessoriesColor), 69, 85) : ''}
      ${2 === top.zIndex ? topPath : ''}
    `;

    if (options.style === 'circle') {
      body = `
        <path d="M260 160c0 66.274-53.726 120-120 120S20 226.274 20 160 73.726 40 140 40s120 53.726 120 120z" fill="${
          options.background ?? palette.blue01
        }"/>
        <mask id="a" maskUnits="userSpaceOnUse" x="8" y="0" width="264" height="280">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M272 0H8v160h12c0 66.274 53.726 120 120 120s120-53.726 120-120h12V0z" fill="#fff"/>
        </mask>
        <g mask="url(#a)">
          ${body}
        </g>
      `;

      options.background = undefined;
    }

    return {
      attributes: {
        viewBox: '0 0 280 280',
        fill: 'none',
      },
      body,
    };
  },
};
