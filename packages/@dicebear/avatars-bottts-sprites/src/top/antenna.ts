import Color from '@dicebear/avatars/lib/color';

export default (color: Color) => {
  return `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M52 5H48V36H40C38.8954 36 38 36.8954 38 38V52H62V38C62 36.8954 61.1046 36 60 36H52V5Z" fill="#E1E6E8"/>
        <mask id="topAntennaMask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="38" y="5" width="24" height="47">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M52 5H48V36H40C38.8954 36 38 36.8954 38 38V52H62V38C62 36.8954 61.1046 36 60 36H52V5Z" fill="white"/>
        </mask>
        <g mask="url(#topAntennaMask0)">
            <rect width="100" height="52" fill="${color.hex}"/>
            <rect x="38" y="36" width="24" height="16" fill="white" fill-opacity="0.2"/>
        </g>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M50 16C54.4183 16 58 12.4183 58 8C58 3.58172 54.4183 0 50 0C45.5817 0 42 3.58172 42 8C42 12.4183 45.5817 16 50 16Z" fill="#FFE65C"/>
        <path fill-rule="evenodd" clip-rule="evenodd" d="M53 8C54.6569 8 56 6.65685 56 5C56 3.34315 54.6569 2 53 2C51.3431 2 50 3.34315 50 5C50 6.65685 51.3431 8 53 8Z" fill="white"/>
    `;
};
