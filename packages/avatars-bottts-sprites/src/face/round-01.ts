import Color from '@dicebear/avatars/lib/color';

export default (color: Color, texture?: string) => {
  return `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M66 0C124.352 0 130.001 40.6854 130 78C129.999 111.315 104.534 120 66 120C28.5387 120 0 111.315 0 78C0 40.6854 7.64843 0 66 0Z" fill="black" fill-opacity="0.8"/>
        <mask id="faceRound01Mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M66 0C124.352 0 130.001 40.6854 130 78C129.999 111.315 104.534 120 66 120C28.5387 120 0 111.315 0 78C0 40.6854 7.64843 0 66 0Z" fill="white"/>
        </mask>
        <g mask="url(#faceRound01Mask0)">
            <rect x="-4" y="-2" width="138" height="124" fill="${color.hex}"/>
            ${texture}
        </g>
    `;
};
