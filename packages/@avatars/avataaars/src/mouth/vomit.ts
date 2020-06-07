export default () => `
    <path fill-rule="evenodd" clip-rule="evenodd" d="M34.0082 30.3979C35.128 19.9071 38.2345 11.0056 53.9962 11C69.7578 10.9944 72.9169 19.9575 73.9943 30.4952C74.081 31.3433 73.1739 32 72.037 32C65.3505 32 62.6703 30.5048 53.9894 30.5C45.3085 30.4952 40.7568 32 36.0925 32C34.949 32 33.8962 31.4475 34.0082 30.3979Z" fill="black" fill-opacity="0.7"/>
    <mask id="mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="34" y="11" width="40" height="21">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M34.0082 30.3979C35.128 19.9071 38.2345 11.0056 53.9962 11C69.7578 10.9944 72.9169 19.9575 73.9943 30.4952C74.081 31.3433 73.1739 32 72.037 32C65.3505 32 62.6703 30.5048 53.9894 30.5C45.3085 30.4952 40.7568 32 36.0925 32C34.949 32 33.8962 31.4475 34.0082 30.3979Z" fill="white"/>
    </mask>
    <g mask="url(#mask0)">
        <rect x="39" width="31" height="16" rx="5" fill="white"/>
    </g>
    <g filter="url(#filter0_i)">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M42 25C38.6863 25 36 27.6863 36 31V34V36V38C36 41.3137 38.6863 44 42 44C45.3137 44 48 41.3137 48 38V37V36H48.083C48.559 33.1623 51.027 31 54 31C56.973 31 59.441 33.1623 59.917 36H60C60 39.3137 62.6863 42 66 42C69.3137 42 72 39.3137 72 36V34V31C72 27.6863 69.3137 25 66 25H42Z" fill="#88C553"/>
    </g>
    <defs>
        <filter id="filter0_i" x="36" y="25" width="36" height="19" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset dy="-1"/>
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"/>
            <feBlend mode="normal" in2="shape" result="effect1_innerShadow"/>
        </filter>
    </defs>
`;
