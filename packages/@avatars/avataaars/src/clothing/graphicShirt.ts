import graphic from './graphic';
import type { utils } from '@avatars/core';
import * as group from '../utils/group';
import type Options from '../options';
import * as color from '../utils/color';
import * as mask from '../utils/mask';

export default (prng: utils.prng.IPrng, options: Options) => {
  return `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M166 32.5C166 44.3741 151.002 54 132.5 54C113.998 54 99 44.3741 99 32.5C99 31.3767 99.1342 30.2735 99.3929 29.1967C61.7752 31.5722 32 62.8348 32 101.052V110H232V101.052C232 63.1798 202.76 32.1373 165.624 29.2681C165.872 30.3223 166 31.4015 166 32.5Z" fill="#E6E6E6"/>
    <mask id="${mask.next()}" mask-type="alpha" maskUnits="userSpaceOnUse" x="32" y="29" width="200" height="81">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M166 32.5C166 44.3741 151.002 54 132.5 54C113.998 54 99 44.3741 99 32.5C99 31.3767 99.1342 30.2735 99.3929 29.1967C61.7752 31.5722 32 62.8348 32 101.052V110H232V101.052C232 63.1798 202.76 32.1373 165.624 29.2681C165.872 30.3223 166 31.4015 166 32.5Z" fill="white"/>
    </mask>
    <g mask="url(#${mask.current()})">
        <rect width="264" height="110" fill="${color.clothing(prng, options)}"/>
        ${group.create(graphic(prng), 77, 58)}
    </g>
`;
};
