import Color from '@dicebear/avatars/lib/color';

export default (color: Color) => {
  return `
        <path fill-rule="evenodd" clip-rule="evenodd" d="M23 22C20.2386 22 18 24.2386 18 27V40H12C10.8954 40 10 40.8954 10 42V52H18H34H42H58H66H82H90V42C90 40.8954 89.1046 40 88 40H82V27C82 24.2386 79.7614 22 77 22H71C68.2386 22 66 24.2386 66 27V40H58V27C58 24.2386 55.7614 22 53 22H47C44.2386 22 42 24.2386 42 27V40H34V27C34 24.2386 31.7614 22 29 22H23Z" fill="#E1E6E8"/>
        <mask id="topLightsMask0" mask-type="alpha" maskUnits="userSpaceOnUse" x="10" y="22" width="80" height="30">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M23 22C20.2386 22 18 24.2386 18 27V40H12C10.8954 40 10 40.8954 10 42V52H18H34H42H58H66H82H90V42C90 40.8954 89.1046 40 88 40H82V27C82 24.2386 79.7614 22 77 22H71C68.2386 22 66 24.2386 66 27V40H58V27C58 24.2386 55.7614 22 53 22H47C44.2386 22 42 24.2386 42 27V40H34V27C34 24.2386 31.7614 22 29 22H23Z" fill="white"/>
        </mask>
        <g mask="url(#topLightsMask0)">
            <rect width="100" height="52" fill="${color.hex}"/>
            <rect width="100" height="40" fill="white" fill-opacity="0.6"/>
            <rect x="24" y="28" width="4" height="8" rx="2" fill="white" fill-opacity="0.6"/>
            <rect x="48" y="28" width="4" height="8" rx="2" fill="white" fill-opacity="0.6"/>
            <rect x="72" y="28" width="4" height="8" rx="2" fill="white" fill-opacity="0.6"/>
        </g>
    `;
};
