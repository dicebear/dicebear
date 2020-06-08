import type { utils } from '@avatars/core';
import type Options from '../options';
import * as color from '../utils/color';
import * as mask from '../utils/mask';

export default (prng: utils.prng.IPrng, options: Options) => {
  return `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M159 32.0517C159 45.8588 146.912 57.0517 132 57.0517C117.088 57.0517 105 45.8588 105 32.0517C105 31.0365 105.065 30.0353 105.192 29.0517H104C64.2355 29.0517 32 61.2873 32 101.052V110H232V101.052C232 61.2872 199.764 29.0517 160 29.0517H158.808C158.935 30.0353 159 31.0365 159 32.0517Z" fill="#E6E6E6"/>
    <mask id="${mask.next()}" mask-type="alpha" maskUnits="userSpaceOnUse" x="32" y="29" width="200" height="81">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M159 32.0517C159 45.8588 146.912 57.0517 132 57.0517C117.088 57.0517 105 45.8588 105 32.0517C105 31.0365 105.065 30.0353 105.192 29.0517H104C64.2355 29.0517 32 61.2873 32 101.052V110H232V101.052C232 61.2872 199.764 29.0517 160 29.0517H158.808C158.935 30.0353 159 31.0365 159 32.0517Z" fill="white"/>
    </mask>
    <g mask="url(#${mask.current()})">
        <rect width="264" height="110" fill="${color.clothing(prng, options)}"/>
    </g>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M108 21.5715C101.233 26.174 97 32.7398 97 40.0279C97 47.4262 101.362 54.08 108.308 58.6916L114.421 53.8765L119 54.2079L118 51.0568L118.078 50.9955C111.978 47.8531 108 42.7004 108 36.8768V21.5715ZM156 36.8768C156 42.7004 152.022 47.8531 145.922 50.9955L146 51.0568L145 54.2079L149.579 53.8765L155.229 58.3272C161.863 53.733 166 47.2335 166 40.0279C166 33.1057 162.182 26.8352 156 22.2795V36.8768Z" fill="#F2F2F2"/>
`;
};
