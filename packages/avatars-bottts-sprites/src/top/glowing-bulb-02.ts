import Color from '@dicebear/avatars/lib/color';

export default (color: Color) => {
  return `
        <g filter="url(#topGlowingBulb02Filter0)">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M30 33C30 21.9543 38.9543 13 50 13V13C61.0457 13 70 21.9543 70 33V44H30V33Z" fill="white" fill-opacity="0.3"/>
        </g>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M50 36C52.2091 36 54 35.028 54 31.7143C54 28.4006 52.2091 24 50 24C47.7909 24 46 28.4006 46 31.7143C46 35.028 47.7909 36 50 36Z" fill="white" fill-opacity="0.6"/>
        <path d="M50 14.5C49.4477 14.5 49 14.9477 49 15.5C49 16.0523 49.4477 16.5 50 16.5V14.5ZM61.6941 21.6875C62.0649 22.0968 62.6973 22.1281 63.1066 21.7573C63.5159 21.3865 63.5471 20.7541 63.1763 20.3448L61.6941 21.6875ZM65.7595 24.0473C65.5035 23.5579 64.8993 23.3686 64.4099 23.6246C63.9205 23.8806 63.7313 24.4848 63.9873 24.9742L65.7595 24.0473ZM65.4248 28.9559C65.5404 29.4959 66.0719 29.84 66.6119 29.7244C67.152 29.6088 67.4961 29.0773 67.3805 28.5373L65.4248 28.9559ZM50 16.5C54.6375 16.5 58.8065 18.4999 61.6941 21.6875L63.1763 20.3448C59.9256 16.7563 55.2256 14.5 50 14.5V16.5ZM63.9873 24.9742C64.6357 26.2139 65.1239 27.5501 65.4248 28.9559L67.3805 28.5373C67.0411 26.9518 66.4904 25.4448 65.7595 24.0473L63.9873 24.9742Z" fill="white"/>
        <rect x="20" y="36" width="60" height="16" rx="1" fill="${color.hex}"/>
        <defs>
            <filter id="topGlowingBulb02Filter0" x="22" y="5" width="56" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
