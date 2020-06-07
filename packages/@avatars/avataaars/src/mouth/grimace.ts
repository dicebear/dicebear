export default () => `
    <rect x="22" y="7" width="64" height="26" rx="13" fill="black" fill-opacity="0.6"/>
    <rect x="24" y="9" width="60" height="22" rx="11" fill="white"/>
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="24" y="9" width="60" height="22">
        <rect x="24" y="9" width="60" height="22" rx="11" fill="white"/>
    </mask>
    <g mask="url(#mask0)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M32 6H36V18H45V6H49V18H58V6H62V18H71V6H75V18H83.8666V22H75V34H71V22H62V34H58V22H49V34H45V22H36V34H32V22H24V18H32V6Z" fill="#E6E6E6"/>
    </g>
`;
