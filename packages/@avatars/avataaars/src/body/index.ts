import type { utils } from '@avatars/core';
import * as color from '../utils/color';
import * as mask from '../utils/mask';
import Options from '../options';

export default function (prng: utils.prng.IPrng, options: Options) {
  return `
    <mask id="${mask.next()}" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="200" height="244">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M100 0C69.0721 0 44 25.0721 44 56V62.1659C38.3246 63.1181 34 68.054 34 74V88C34 94.0521 38.4803 99.0578 44.3051 99.8812C46.3722 119.687 58.7626 136.422 76 144.611V163H72C32.2355 163 0 195.236 0 235V244H200V235C200 195.236 167.764 163 128 163H124V144.611C141.237 136.422 153.628 119.687 155.695 99.8812C161.52 99.0578 166 94.0521 166 88V74C166 68.054 161.675 63.1181 156 62.1659V56C156 25.0721 130.928 0 100 0Z" fill="white"/>
    </mask>
    <g mask="url(#${mask.current()})">
      <rect x="-32" width="264" height="244" fill="${color.skin(prng, options)}"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M44 94V102C44 132.928 69.0721 158 100 158C130.928 158 156 132.928 156 102V94C156 124.928 130.928 150 100 150C69.0721 150 44 124.928 44 94Z" fill="black" fill-opacity="0.1"/>
    </g>
  `;
}
