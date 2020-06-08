import type { utils } from '@avatars/core';
import type Options from '../options';
import * as color from '../utils/color';
import * as mask from '../utils/mask';

export default (prng: utils.prng.IPrng, options: Options) => {
  return `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M166 30.3476C166 42.2107 151.002 51.8277 132.5 51.8277C113.998 51.8277 99 42.2107 99 30.3476C99 29.9692 99.0153 29.5931 99.0454 29.2195C61.592 31.765 32 62.9526 32 101.052V110H232V101.052C232 63.2943 202.936 32.325 165.96 29.2949C165.987 29.6437 166 29.9947 166 30.3476Z" fill="#E6E6E6"/>
    <mask id="${mask.next()}" mask-type="alpha" maskUnits="userSpaceOnUse" x="32" y="29" width="200" height="81">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M166 30.3476C166 42.2107 151.002 51.8277 132.5 51.8277C113.998 51.8277 99 42.2107 99 30.3476C99 29.9692 99.0153 29.5931 99.0454 29.2195C61.592 31.765 32 62.9526 32 101.052V110H232V101.052C232 63.2943 202.936 32.325 165.96 29.2949C165.987 29.6437 166 29.9947 166 30.3476Z" fill="white"/>
    </mask>
    <g mask="url(#${mask.current()})">
        <rect width="264" height="110" fill="${color.clothing(prng, options)}"/>
        <g opacity="0.6">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M132.5 58.7615C154.39 58.7615 172.135 46.7117 172.135 31.8476C172.135 16.9835 154.39 4.9338 132.5 4.9338C110.61 4.9338 92.8649 16.9835 92.8649 31.8476C92.8649 46.7117 110.61 58.7615 132.5 58.7615Z" fill="black" fill-opacity="0.16"/>
        </g>
    </g>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M163.638 110H232V101.052C232 62.7068 202.025 31.3629 164.229 29.1738C167.265 40.7709 169 54.1942 169 68.5C169 83.7087 167.039 97.92 163.638 110ZM100.785 29.1222C97.74 40.7311 96 54.173 96 68.5C96 83.7087 97.9607 97.92 101.362 110H32V101.052C32 62.3647 62.5123 30.8041 100.785 29.1222Z" fill="#3A4C5A"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M181 86L190.556 78.8331C191.999 77.7508 193.988 77.7683 195.412 78.8757L202 84L181 86Z" fill="#E6E6E6"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M101 28C95 57 106 110 106 110H90L76 74L82 65L76 59L95 29C95 29 98.0415 28.0539 101 28Z" fill="#2F4351"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M163 28C169 57 158 110 158 110H174L188 74L182 65L188 59L169 29C169 29 165.959 28.0539 163 28Z" fill="#2F4351"/>
`;
};
