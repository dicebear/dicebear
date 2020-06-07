import { utils } from '@avatars/core';
import type Options from '../options';
import * as color from '../utils/color';
import * as mask from '../utils/mask';

export default (prng: utils.prng.IPrng, options: Options) => {
  return `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M92.6808 29.9363C58.2939 35.3663 32 65.1384 32 101.052V110H232V101.052C232 65.1384 205.706 35.3663 171.319 29.9363C170.421 34.993 167.898 39.8105 163.764 43.5389L134.679 69.7676C133.157 71.1402 130.843 71.1402 129.321 69.7676L100.236 43.5389C96.1016 39.8105 93.5787 34.993 92.6808 29.9363Z" fill="#E6E6E6"/>
    <mask id="${mask.next()}" mask-type="alpha" maskUnits="userSpaceOnUse" x="32" y="29" width="200" height="81">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M92.6808 29.9363C58.2939 35.3663 32 65.1384 32 101.052V110H232V101.052C232 65.1384 205.706 35.3663 171.319 29.9363C170.421 34.993 167.898 39.8105 163.764 43.5389L134.679 69.7676C133.157 71.1402 130.843 71.1402 129.321 69.7676L100.236 43.5389C96.1016 39.8105 93.5787 34.993 92.6808 29.9363Z" fill="white"/>
    </mask>
    <g mask="url(#${mask.current()})">
        <rect width="264" height="110" fill="${color.clothing(prng, options)}"/>
    </g>
`;
};
