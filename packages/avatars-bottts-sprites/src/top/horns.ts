import Color from '@dicebear/avatars/lib/color';

export default (color: Color) => {
  return `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M71.2104 40C78.8499 33.2931 84.6313 20.6882 84 14C83.8635 12.5535 85.9998 12.2993 87 14C91.418 21.5124 89.7172 36.0672 89.1535 40H92V52H66V40H71.2104ZM16.521 13.7408C16.521 21.2733 21.4918 33.445 29.2618 40H34V52H8V40H11.2251C10.6299 36.4414 8.52929 21.6012 13.4337 14.1009C14.3353 12.7219 16.521 12.6807 16.521 13.7408Z" fill="#E1E6E8"/>
        <mask id="topHornsMask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="8" y="12" width="84" height="40">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M71.2104 40C78.8499 33.2931 84.6313 20.6882 84 14C83.8635 12.5535 85.9998 12.2993 87 14C91.418 21.5124 89.7172 36.0672 89.1535 40H92V52H66V40H71.2104ZM16.521 13.7408C16.521 21.2733 21.4918 33.445 29.2618 40H34V52H8V40H11.2251C10.6299 36.4414 8.52929 21.6012 13.4337 14.1009C14.3353 12.7219 16.521 12.6807 16.521 13.7408Z" fill="white"/>
        </mask>
        <g mask="url(#topHornsMask0)">
            <rect width="100" height="52" fill="${color.hex}"/>
            <rect y="40" width="100" height="12" fill="black" fill-opacity="0.4"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M15.4558 13H31.5689V40H20.8201C13.3712 32.1499 15.4558 13 15.4558 13Z" fill="white" fill-opacity="0.4"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M84.8203 13H92.5691V40H81.8203C87.5713 32.1946 84.8203 13 84.8203 13Z" fill="white" fill-opacity="0.4"/>
        </g>
    `;
};
