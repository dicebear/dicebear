import { utils } from '@avatars/core';
import type Options from '../options';
import * as clothingUtils from './utils';

export default (prng: utils.prng.IPrng, options: Options) => {
  return `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M108 13.0709C90.0813 15.0759 76.2798 20.5518 76.0042 34.645C50.1464 45.5681 32 71.1646 32 100.999V110H232V100.999C232 71.1646 213.854 45.5681 187.996 34.645C187.72 20.5518 173.919 15.0759 156 13.0709V32C156 45.2548 145.255 56 132 56C118.745 56 108 45.2548 108 32V13.0709Z" fill="#B7C1DB"/>
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="32" y="13" width="200" height="97">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M108 13.0709C90.0813 15.0759 76.2798 20.5518 76.0042 34.645C50.1464 45.5681 32 71.1646 32 100.999V110H232V100.999C232 71.1646 213.854 45.5681 187.996 34.645C187.72 20.5518 173.919 15.0759 156 13.0709V32C156 45.2548 145.255 56 132 56C118.745 56 108 45.2548 108 32V13.0709Z" fill="white"/>
    </mask>
    <g mask="url(#mask0)">
        <rect width="264" height="110" fill="${clothingUtils.color(prng, options)}"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M95 58.1503C97.2038 59.4601 99.5468 60.6608 102 61.7391V110H95V58.1503ZM169 58.1503C166.796 59.4601 164.453 60.6608 162 61.7391V98.5C162 100.433 163.567 102 165.5 102C167.433 102 169 100.433 169 98.5V58.1503Z" fill="#F4F4F4"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M188 31.0769C188 51.469 160.179 68 132 68C103.821 68 76 51.469 76 31.0769C76 21.7061 81.8751 16.0745 90.9601 12.7244C75.9093 15.5712 65.5 21.2429 65.5 32.3077C65.5 52.02 98.5377 68 132 68C165.462 68 198.5 52.02 198.5 32.3077C198.5 21.2429 188.091 15.5712 173.04 12.7244C182.125 16.0745 188 21.7061 188 31.0769Z" fill="black" fill-opacity="0.16"/>
    </g>
`;
};
