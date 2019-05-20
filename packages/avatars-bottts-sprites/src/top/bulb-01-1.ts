import Color from '@dicebear/avatars/lib/color';

export default (color: Color) => {
  return `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M48 0C39.1634 0 32 7.16344 32 16V32C32 36.4183 35.5817 40 40 40H23C22.4477 40 22 40.4477 22 41V51C22 51.5523 22.4477 52 23 52H77C77.5523 52 78 51.5523 78 51V41C78 40.4477 77.5523 40 77 40H60C64.4183 40 68 36.4183 68 32V16C68 7.16344 60.8366 0 52 0H48Z" fill="#59C4FF"/>
        <mask id="topBulb011Mask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="22" y="0" width="56" height="52">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M48 0C39.1634 0 32 7.16344 32 16V32C32 36.4183 35.5817 40 40 40H23C22.4477 40 22 40.4477 22 41V51C22 51.5523 22.4477 52 23 52H77C77.5523 52 78 51.5523 78 51V41C78 40.4477 77.5523 40 77 40H60C64.4183 40 68 36.4183 68 32V16C68 7.16344 60.8366 0 52 0H48Z" fill="white"/>
        </mask>
        <g mask="url(#topBulb011Mask0)">
            <rect width="100" height="52" fill="${color.hex}"/>
            <rect x="20" y="-3" width="60" height="43" fill="white" fill-opacity="0.4"/>
            <path d="M49 3.5C53.9315 3.5 58.366 5.62814 61.4352 9.01616" stroke="white" stroke-width="2" stroke-linecap="round"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M49.8284 26L40.8284 17L38 19.8284L48 29.8284V40H52V29.9706L62.1421 19.8284L59.3137 17L50.3137 26H49.8284Z" fill="white" fill-opacity="0.8"/>
        </g>
    `;
};
