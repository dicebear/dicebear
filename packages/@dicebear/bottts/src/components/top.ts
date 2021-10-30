import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const top: ComponentGroup = {
  antenna: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <mask id="topAntenna-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="38" y="5" width="24" height="47">
    <path d="M52 5h-4v31h-8a2 2 0 0 0-2 2v14h24V38a2 2 0 0 0-2-2h-8V5Z" fill="#E1E6E8"/>
  </mask>
  <g mask="url(#topAntenna-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 3h100v52H0V3Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#fff" fill-opacity=".2" d="M38 36h24v16H38z"/>
  </g>
  <circle cx="50" cy="8" r="8" fill="#FFE65C"/>
  <circle cx="53" cy="5" r="3" fill="#fff"/>
`,
  antennaCrooked: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <mask id="topAntennaCrooked-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="38" y="12" width="24" height="40">
    <path d="m53.57 39 1.97-4.61-6.19-10.68 2.9-10.63-2.9-.79-3.22 11.84 6.05 10.43-2.1 4.44H38v13h24V39h-8.43Z" fill="#E6E6E6"/>
  </mask>
  <g mask="url(#topAntennaCrooked-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 6h100v52H0V6Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#fff" fill-opacity=".2" d="M38 39h24v13H38z"/>
  </g>
  <circle cx="50" cy="8" r="8" fill="#FFE65C"/>
  <circle cx="53" cy="5" r="3" fill="#fff"/>
`,
  bulb01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <mask id="topBulb01-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="22" y="0" width="56" height="52">
    <path d="M48 0a16 16 0 0 0-16 16v16a8 8 0 0 0 8 8H23a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h54a1 1 0 0 0 1-1V41a1 1 0 0 0-1-1H60a8 8 0 0 0 8-8V16A16 16 0 0 0 52 0h-4Z" fill="#59C4FF"/>
  </mask>
  <g mask="url(#topBulb01-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#fff" fill-opacity=".4" d="M20-3h60v43H20z"/>
    <path d="M49 3.5c4.93 0 9.37 2.13 12.44 5.52" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <path d="m49.83 26-9-9L38 19.83l10 10V40h4V29.97l10.14-10.14L59.31 17l-9 9h-.48Z" fill="#fff" fill-opacity=".8"/>
  </g>
`,
  glowingBulb01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g filter="url(#topGlowingBulb01-a)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M32 24A16 16 0 0 1 48 8h4a16 16 0 0 1 16 16v8a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-8Z" fill="#fff" fill-opacity=".3"/>
  </g>
  <path d="M49 11.5c4.93 0 9.37 2.13 12.44 5.52" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="m49.83 29-9-9L38 22.83l10 10V40h4v-7.03l10.14-10.14L59.31 20l-9 9h-.48Z" fill="#fff" fill-opacity=".8"/>
  <rect x="22" y="40" width="56" height="12" rx="1" fill="#48494B"/>
  <mask id="topGlowingBulb01-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="22" y="40" width="56" height="12">
    <rect x="22" y="40" width="56" height="12" rx="1" fill="#fff"/>
  </mask>
  <defs>
    <filter id="topGlowingBulb01-a" x="24" y="0" width="52" height="48" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="4"/>
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_101:619"/>
      <feBlend in="SourceGraphic" in2="effect1_dropShadow_101:619" result="shape"/>
      <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
      <feBlend in2="shape" result="effect2_innerShadow_101:619"/>
    </filter>
  </defs>
`,
  glowingBulb02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g filter="url(#topGlowingBulb02-a)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M30 33a20 20 0 1 1 40 0v11H30V33Z" fill="#fff" fill-opacity=".3"/>
  </g>
  <ellipse cx="50" cy="30" rx="4" ry="6" fill="#fff" fill-opacity=".6"/>
  <path d="M50 15.5c4.93 0 9.37 2.13 12.44 5.52m2.43 3.5c.7 1.3 1.21 2.73 1.53 4.23" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <rect x="20" y="36" width="60" height="16" rx="1" fill="#48494B"/>
  <mask id="topGlowingBulb02-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="20" y="36" width="60" height="16">
    <rect x="20" y="36" width="60" height="16" rx="1" fill="#fff"/>
  </mask>
  <defs>
    <filter id="topGlowingBulb02-a" x="22" y="5" width="56" height="47" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="4"/>
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow_101:632"/>
      <feBlend in="SourceGraphic" in2="effect1_dropShadow_101:632" result="shape"/>
      <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
      <feBlend in2="shape" result="effect2_innerShadow_101:632"/>
    </filter>
  </defs>
`,
  horns: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <mask id="topHorns-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="8" y="12" width="84" height="40">
    <path d="M71.21 40c7.64-6.7 13.42-19.31 12.8-26-.14-1.45 2-1.7 3 0 4.42 7.51 2.72 22.07 2.15 26H92v12H66V40h5.21ZM16.52 13.74c0 7.53 4.97 19.7 12.74 26.26H34v12H8V40h3.23c-.6-3.56-2.7-18.4 2.2-25.9.9-1.38 3.1-1.42 3.1-.36Z" fill="#E1E6E8"/>
  </mask>
  <g mask="url(#topHorns-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#000" fill-opacity=".4" d="M0 40h100v12H0z"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.46 13h16.1v27H20.83c-7.45-7.85-5.36-27-5.36-27ZM84.82 13h7.75v27H81.82c5.75-7.8 3-27 3-27Z" fill="#fff" fill-opacity=".4"/>
  </g>
`,
  lights: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <mask id="topLights-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="10" y="22" width="80" height="30">
    <path d="M23 22a5 5 0 0 0-5 5v13h-6a2 2 0 0 0-2 2v10h80V42a2 2 0 0 0-2-2h-6V27a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v13h-8V27a5 5 0 0 0-5-5h-6a5 5 0 0 0-5 5v13h-8V27a5 5 0 0 0-5-5h-6Z" fill="#E1E6E8"/>
  </mask>
  <g mask="url(#topLights-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#fff" fill-opacity=".6" d="M0 0h100v40H0z"/>
    <rect x="24" y="28" width="4" height="8" rx="2" fill="#fff" fill-opacity=".6"/>
    <rect x="48" y="28" width="4" height="8" rx="2" fill="#fff" fill-opacity=".6"/>
    <rect x="72" y="28" width="4" height="8" rx="2" fill="#fff" fill-opacity=".6"/>
  </g>
`,
  pyramid: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <mask id="topPyramid-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="18" y="8" width="64" height="44">
    <path fill-rule="evenodd" clip-rule="evenodd" d="m50 8 32 44H18L50 8Z" fill="#fff"/>
  </mask>
  <g mask="url(#topPyramid-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#fff" fill-opacity=".8" d="M50 4h30v48H50z"/>
  </g>
`,
  radar: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <mask id="topRadar-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="37" y="0" width="36" height="53">
    <path d="M43.8 28.4A20 20 0 0 1 43.8.1l13.43 13.45 6.46-6.46a4 4 0 1 1 1.41 1.4l-6.45 6.46L72.08 28.4a20 20 0 0 1-20.14 4.94V52.1h-4V31.58a20.02 20.02 0 0 1-4.14-3.18Z" fill="#E1E6E8"/>
  </mask>
  <g mask="url(#topRadar-a)">
    <path d="M0 0h100v52H0V0Z" fill="#90A4AE"/>
    <path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M43.8.11A20 20 0 1 0 72.08 28.4" fill="#fff" fill-opacity=".2"/>
    <circle cx="67.13" cy="7.41" r="5.66" transform="rotate(45 67.13 7.4)" fill="#fff" fill-opacity=".8"/>
  </g>
`,
};
