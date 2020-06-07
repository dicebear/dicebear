import { utils } from '@avatars/core';
import type Options from '../options';
import * as clothingUtils from './utils';

export default (prng: utils.prng.IPrng, options: Options) => {
  return `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M182 36.3476C182 52.629 159.838 65.8277 132.5 65.8277C105.162 65.8277 83 52.629 83 36.3476C83 34.8712 83.1822 33.4202 83.534 32.002C53.7388 40.8196 32 68.397 32 101.052V110H232V101.052C232 68.7922 210.784 41.4879 181.544 32.3304C181.845 33.6439 182 34.985 182 36.3476Z" fill="#E6E6E6"/>
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="32" y="32" width="200" height="78">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M182 36.3476C182 52.629 159.838 65.8277 132.5 65.8277C105.162 65.8277 83 52.629 83 36.3476C83 34.8712 83.1822 33.4202 83.534 32.002C53.7388 40.8196 32 68.397 32 101.052V110H232V101.052C232 68.7922 210.784 41.4879 181.544 32.3304C181.845 33.6439 182 34.985 182 36.3476Z" fill="white"/>
    </mask>
    <g mask="url(#mask0)">
        <rect width="264" height="110" fill="${clothingUtils.color(prng, options)}"/>
    </g>
`;
};
