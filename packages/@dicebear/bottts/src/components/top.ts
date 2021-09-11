import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const top: ComponentGroup = {
  antenna: {
    width: 100,
    height: 52,
    render: (
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
  },
  antennaCrooked: {
    width: 100,
    height: 52,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="topAntennaCrooked-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="38" y="12" width="24" height="40">
    <path d="m53.568 39 1.976-4.615-6.191-10.675 2.895-10.626-2.894-.79-3.225 11.837 6.05 10.432L50.089 39H38v13h24V39h-8.432Z" fill="#E6E6E6"/>
  </mask>
  <g mask="url(#topAntennaCrooked-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 6h100v52H0V6Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#fff" fill-opacity=".2" d="M38 39h24v13H38z"/>
  </g>
  <circle cx="50" cy="8" r="8" fill="#FFE65C"/>
  <circle cx="53" cy="5" r="3" fill="#fff"/>
`,
  },
  bulb01: {
    width: 100,
    height: 52,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="topBulb01-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="22" y="0" width="56" height="52">
    <path d="M48 0c-8.837 0-16 7.163-16 16v16a8 8 0 0 0 8 8H23a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h54a1 1 0 0 0 1-1V41a1 1 0 0 0-1-1H60a8 8 0 0 0 8-8V16c0-8.837-7.163-16-16-16h-4Z" fill="#59C4FF"/>
  </mask>
  <g mask="url(#topBulb01-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#fff" fill-opacity=".4" d="M20-3h60v43H20z"/>
    <path d="M49 3.5c4.931 0 9.366 2.128 12.435 5.516" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
    <path d="m49.828 26-9-9L38 19.828l10 10V40h4V29.97l10.142-10.142L59.314 17l-9 9h-.486Z" fill="#fff" fill-opacity=".8"/>
  </g>
`,
  },
  glowingBulb01: {
    width: 100,
    height: 52,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <g filter="url(#topGlowingBulb01-a)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M32 24c0-8.837 7.163-16 16-16h4c8.837 0 16 7.163 16 16v8a8 8 0 0 1-8 8H40a8 8 0 0 1-8-8v-8Z" fill="#fff" fill-opacity=".3"/>
  </g>
  <path d="M49 11.5c4.931 0 9.366 2.128 12.435 5.516" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
  <path d="m49.828 29-9-9L38 22.828l10 10V40h4v-7.03l10.142-10.142L59.314 20l-9 9h-.486Z" fill="#fff" fill-opacity=".8"/>
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
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
      <feBlend in2="shape" result="effect2_innerShadow"/>
    </filter>
  </defs>
`,
  },
  glowingBulb02: {
    width: 100,
    height: 52,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <g filter="url(#topGlowingBulb02-a)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M30 33c0-11.046 8.954-20 20-20s20 8.954 20 20v11H30V33Z" fill="#fff" fill-opacity=".3"/>
  </g>
  <ellipse cx="50" cy="30" rx="4" ry="6" fill="#fff" fill-opacity=".6"/>
  <path d="M50 15.5c4.931 0 9.366 2.128 12.435 5.516m2.438 3.495a16.66 16.66 0 0 1 1.53 4.236" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
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
      <feBlend in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      <feColorMatrix in="SourceAlpha" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
      <feOffset/>
      <feGaussianBlur stdDeviation="2"/>
      <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.5 0"/>
      <feBlend in2="shape" result="effect2_innerShadow"/>
    </filter>
  </defs>
`,
  },
  horns: {
    width: 100,
    height: 52,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="topHorns-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="8" y="12" width="84" height="40">
    <path d="M71.21 40C78.85 33.293 84.631 20.688 84 14c-.136-1.447 2-1.7 3 0 4.418 7.512 2.717 22.067 2.153 26H92v12H66V40h5.21ZM16.521 13.74c0 7.533 4.97 19.705 12.74 26.26H34v12H8V40h3.225c-.595-3.559-2.696-18.399 2.209-25.9.901-1.378 3.087-1.42 3.087-.36Z" fill="#E1E6E8"/>
  </mask>
  <g mask="url(#topHorns-a)">
    <path d="M0 0h100v52H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#000" fill-opacity=".4" d="M0 40h100v12H0z"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M15.456 13h16.113v27H20.82c-7.449-7.85-5.364-27-5.364-27ZM84.82 13h7.749v27H81.82c5.751-7.805 3-27 3-27Z" fill="#fff" fill-opacity=".4"/>
  </g>
`,
  },
  lights: {
    width: 100,
    height: 52,
    render: (
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
  },
  pyramid: {
    width: 100,
    height: 52,
    render: (
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
  },
  radar: {
    width: 100,
    height: 52,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="topRadar-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="37" y="0" width="36" height="53">
    <path d="M43.799 28.397c-7.81-7.81-7.81-20.474 0-28.284l13.435 13.435 6.453-6.453a4.002 4.002 0 0 1 6.275-4.861 4 4 0 0 1-4.86 6.275l-6.454 6.453 13.435 13.435c-5.45 5.45-13.263 7.097-20.142 4.94v18.776h-4V31.58a20.024 20.024 0 0 1-4.142-3.184Z" fill="#E1E6E8"/>
  </mask>
  <g mask="url(#topRadar-a)">
    <path d="M0 0h100v52H0V0Z" fill="#90A4AE"/>
    <path d="M0 0h100v52H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="M43.8.113c-7.811 7.81-7.811 20.474 0 28.284 7.81 7.81 20.473 7.81 28.283 0" fill="#fff" fill-opacity=".2"/>
    <circle cx="67.133" cy="7.406" r="5.657" transform="rotate(45 67.133 7.406)" fill="#fff" fill-opacity=".8"/>
  </g>
`,
  },
};
