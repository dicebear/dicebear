import Color from '@dicebear/avatars/lib/color';

export default (color: Color) => {
  return `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M53.5683 39L55.5437 34.3851L49.3528 23.7098L52.2483 13.0836L49.3539 12.2949L46.1288 24.1305L52.179 34.5631L50.0881 39H38V52H62V39H53.5683Z" fill="#E6E6E6"/>
        <mask id="topAntennaCrookedMask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="38" y="12" width="24" height="40">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M53.5683 39L55.5437 34.3851L49.3528 23.7098L52.2483 13.0836L49.3539 12.2949L46.1288 24.1305L52.179 34.5631L50.0881 39H38V52H62V39H53.5683Z" fill="white"/>
        </mask>
        <g mask="url(#topAntennaCrookedMask0)">
            <rect width="100" height="52" fill="${color.hex}"/>
            <rect x="38" y="39" width="24" height="13" fill="white" fill-opacity="0.2"/>
        </g>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M50 16C54.4183 16 58 12.4183 58 8C58 3.58172 54.4183 0 50 0C45.5817 0 42 3.58172 42 8C42 12.4183 45.5817 16 50 16Z" fill="#FFE65C"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M53 8C54.6569 8 56 6.65685 56 5C56 3.34315 54.6569 2 53 2C51.3431 2 50 3.34315 50 5C50 6.65685 51.3431 8 53 8Z" fill="white"/>
    `;
};
