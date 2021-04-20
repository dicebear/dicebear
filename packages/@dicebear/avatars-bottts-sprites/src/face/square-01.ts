import Color from '@dicebear/avatars/lib/color';

export default (color: Color, texture?: string) => {
  return `
        <rect width="130" height="120" rx="18" fill="#0076DE"/>
        <mask id="faceSquare01Mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
            <rect width="130" height="120" rx="18" fill="white"/>
        </mask>
        <g mask="url(#faceSquare01Mask0)">
            <rect x="-2" y="-2" width="134" height="124" fill="${color.hex}"/>
            ${texture}
        </g>
    `;
};
