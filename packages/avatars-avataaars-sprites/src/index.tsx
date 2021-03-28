import type Options from './options';
import type Random from '@dicebear/avatars/lib/random';
import * as utils from './utils';
import { palette } from './colors';

export function create(random: Random, options: Options = {}) {
  let noseType = utils.getNoseType();
  let skinType = utils.getSkinType();
  let skinColor = utils.getSkinColor(options, random);
  let top = utils.getTopType(options, random);
  let facialHairType = utils.getFacialHairType(options, random);
  let facialHairColor = utils.getFacialHairColor(options, random);
  let clotheType = utils.getClotheType(options, random);
  let clotheGraphicType = utils.getClotheGraphicType(options, random);
  let clotheColor = utils.getClotheColor(options, random);
  let eyeType = utils.getEyeType(options, random);
  let eyebrowType = utils.getEyebrowType(options, random);
  let mouthType = utils.getMouthType(options, random);
  let accessoriesType = utils.getAccessoriesType(options, random);
  let accessoriesColor = utils.getAccessoriesColor(options, random);
  let hatColor = utils.getHatColor(options, random);
  let hairColor = utils.getHairColor(options, random);

  const group = (content: string, x: number, y: number) => {
    return content.length > 0 ? `<g transform="translate(${x}, ${y})">${content}</g>` : '';
  };

  const topPath = group(top.path(top.isHat ? hatColor : hairColor), 7, 0);

  let content = `
    ${group(skinType(skinColor), 40, 36)}
    ${group(clotheType(clotheColor, clotheGraphicType()), 8, 170)}
    ${group(mouthType(), 86, 134)}
    ${group(noseType(), 112, 122)}
    ${group(eyeType(), 84, 90)}
    ${group(eyebrowType(), 84, 82)}
    ${0 === top.zIndex ? top : ''}
    ${facialHairType ? group(facialHairType(facialHairColor), 56, 72) : ''}
    ${1 === top.zIndex ? top : ''}
    ${accessoriesType ? group(accessoriesType(accessoriesColor), 69, 85) : ''}
    ${2 === top.zIndex ? top : ''}
  `;

  if (options.style === 'circle') {
    content = `
      <path d="M260 160c0 66.274-53.726 120-120 120S20 226.274 20 160 73.726 40 140 40s120 53.726 120 120z" fill="${
        options.background ?? palette.blue01
      }"/>
      <mask id="a" maskUnits="userSpaceOnUse" x="8" y="0" width="264" height="280">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M272 0H8v160h12c0 66.274 53.726 120 120 120s120-53.726 120-120h12V0z" fill="#fff"/>
      </mask>
      <g mask="url(#a)">
        ${content}
      </g>
    `;

    options.background = undefined;
  }

  return `
    <svg viewBox="0 0 280 280" fill="none" xmlns="http://www.w3.org/2000/svg">
      ${content}
    </svg>
  `;
}

export default create;
