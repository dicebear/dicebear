import Color from '@dicebear/avatars/lib/color';

export default (color: Color) => {
  return `
        <g filter="url(#topGlowingBulb01Filter0)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M32 24C32 15.1634 39.1634 8 48 8H52C60.8366 8 68 15.1634 68 24V32C68 36.4183 64.4183 40 60 40H40C35.5817 40 32 36.4183 32 32V24Z" fill="white" fill-opacity="0.3"/>
        </g>
        <path d="M49 11.5C53.9315 11.5 58.366 13.6281 61.4352 17.0162" stroke="white" stroke-width="2" stroke-linecap="round"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M49.8284 29L40.8284 20L38 22.8284L48 32.8284V40H52V32.9706L62.1421 22.8284L59.3137 20L50.3137 29H49.8284Z" fill="white" fill-opacity="0.8"/>
        <rect x="22" y="40" width="56" height="12" rx="1" fill="${color.hex}"/>
        <defs>
            <filter id="topGlowingBulb01Filter0" x="24" y="0" width="52" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="4"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                <feOffset/>
                <feGaussianBlur stdDeviation="2"/>
                <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
                <feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
                <feBlend mode="normal" in2="shape" result="effect2_innerShadow"/>
            </filter>
        </defs>
    `;
};
