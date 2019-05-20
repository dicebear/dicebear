import Color from '@dicebear/avatars/lib/color';

export default (color: Color, texture?: string) => {
  return `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M0 102V68.8517C0 64.3169 0.77112 59.8152 2.28039 55.5389L19.7614 12.0092C22.3014 4.81263 29.1036 0 36.7353 0L93.2647 0C100.896 0 107.699 4.81263 110.239 12.0092L127.72 55.5389C129.229 59.8152 130 64.3169 130 68.8517V102C130 111.941 121.941 120 112 120H18C8.05887 120 0 111.941 0 102Z" fill="#0076DE"/>
        <mask id="faceSquareMask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0 102V68.8517C0 64.3169 0.77112 59.8152 2.28039 55.5389L19.7614 12.0092C22.3014 4.81263 29.1036 0 36.7353 0L93.2647 0C100.896 0 107.699 4.81263 110.239 12.0092L127.72 55.5389C129.229 59.8152 130 64.3169 130 68.8517V102C130 111.941 121.941 120 112 120H18C8.05887 120 0 111.941 0 102Z" fill="white"/>
        </mask>
        <g mask="url(#faceSquareMask0)">
            <rect x="-2" y="-2" width="134" height="124" fill="${color.hex}"/>
            ${texture}
        </g>
    `;
};
