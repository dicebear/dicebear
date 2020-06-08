import type { utils } from '@avatars/core';
import type Options from '../options';
import * as color from '../utils/color';
import * as mask from '../utils/mask';

export default (prng: utils.prng.IPrng, options: Options) => {
  return `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M166 30.3476C166 42.2107 151.002 51.8276 132.5 51.8276C113.998 51.8276 99 42.2107 99 30.3476C99 29.9692 99.0153 29.5931 99.0454 29.2195C61.592 31.7649 32 62.9525 32 101.052V110H232V101.052C232 63.2943 202.936 32.325 165.96 29.2949C165.987 29.6437 166 29.9946 166 30.3476Z" fill="#E6E6E6"/>
    <mask id="${mask.next()}" mask-type="alpha" maskUnits="userSpaceOnUse" x="32" y="29" width="200" height="81">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M166 30.3476C166 42.2107 151.002 51.8276 132.5 51.8276C113.998 51.8276 99 42.2107 99 30.3476C99 29.9692 99.0153 29.5931 99.0454 29.2195C61.592 31.7649 32 62.9525 32 101.052V110H232V101.052C232 63.2943 202.936 32.325 165.96 29.2949C165.987 29.6437 166 29.9946 166 30.3476Z" fill="white"/>
    </mask>
    <g mask="url(#${mask.current()})">
        <rect width="264" height="110" fill="${color.clothing(prng, options)}"/>
        <g opacity="0.6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M132.5 58.7614C154.39 58.7614 172.135 46.7117 172.135 31.8476C172.135 16.9835 154.39 4.93378 132.5 4.93378C110.61 4.93378 92.8649 16.9835 92.8649 31.8476C92.8649 46.7117 110.61 58.7614 132.5 58.7614Z" fill="black" fill-opacity="0.16"/>
        </g>
    </g>
`;
};
