import { utils } from '@avatars/core';
import type Options from '../options';
import * as clothingUtils from './utils';

export default (prng: utils.prng.IPrng, options: Options) => {
  return `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M68 110L78 110L94 110H170L186 110L196 110V38.6318C188.15 34.0908 179.363 30.9893 170 29.6884V74H94V29.6884C84.6371 30.9893 75.8501 34.0908 68 38.6318V110Z" fill="#B7C1DB"/>
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="68" y="29" width="128" height="81">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M68 110L78 110L94 110H170L186 110L196 110V38.6318C188.15 34.0908 179.363 30.9893 170 29.6884V74H94V29.6884C84.6371 30.9893 75.8501 34.0908 68 38.6318V110Z" fill="white"/>
    </mask>
    <g mask="url(#mask0)">
        <rect width="264" height="110" fill="${clothingUtils.color(prng, options)}"/>
    </g>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M81 88C83.7614 88 86 85.7614 86 83C86 80.2386 83.7614 78 81 78C78.2386 78 76 80.2386 76 83C76 85.7614 78.2386 88 81 88Z" fill="#F4F4F4"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M183 88C185.761 88 188 85.7614 188 83C188 80.2386 185.761 78 183 78C180.239 78 178 80.2386 178 83C178 85.7614 180.239 88 183 88Z" fill="#F4F4F4"/>
`;
};
