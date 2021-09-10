import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const mouth: ComponentGroup = {
  bite: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <rect x="4" y="5" width="68" height="22" rx="5" fill="#000" fill-opacity=".2"/>
  <rect x="8" y="9" width="60" height="14" rx="2" fill="#000" fill-opacity=".6"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="m20 17 6-8H14l6 8ZM32 17l6-8H26l6 8ZM44 17l6-8H38l6 8ZM56 17l6-8H50l6 8Z" fill="#E1E6E8"/>
`,
  diagram: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <rect x="4" y="4" width="68" height="24" rx="5" fill="#000" fill-opacity=".2"/>
  <rect x="8" y="8" width="60" height="16" rx="2" fill="#000" fill-opacity=".8"/>
  <path d="M9 17h11l2-4 3 7 4-8 2 9 3-11 3 10 3-3h15l3-4 2 7 3-3h4" stroke="#4EFAC9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
`,
  grill01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="#000" fill-opacity=".6">
    <rect x="12" y="12" width="4" height="8" rx="2"/>
    <rect x="36" y="12" width="4" height="8" rx="2"/>
    <rect x="24" y="12" width="4" height="8" rx="2"/>
    <rect x="48" y="12" width="4" height="8" rx="2"/>
    <rect x="60" y="12" width="4" height="8" rx="2"/>
  </g>
`,
  grill02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="#000" fill-opacity=".6">
    <rect x="28" y="10" width="6" height="14" rx="2"/>
    <rect x="14" y="10" width="6" height="14" rx="2"/>
    <rect x="42" y="10" width="6" height="14" rx="2"/>
    <rect x="56" y="10" width="6" height="14" rx="2"/>
  </g>
`,
  grill03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <rect x="4" y="5" width="68" height="22" rx="5" fill="#000" fill-opacity=".2"/>
  <rect x="8" y="9" width="60" height="14" rx="2" fill="#fff"/>
  <path fill="#000" fill-opacity=".1" d="M18 9h4v14h-4zM42 9h4v14h-4zM30 9h4v14h-4zM54 9h4v14h-4z"/>
`,
  smile01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M27.05 8.442a2 2 0 1 1 3.9-.883C31.72 10.958 34.403 13 38 13s6.28-2.042 7.05-5.441a2 2 0 1 1 3.9.883C47.76 13.702 43.43 17 38 17s-9.76-3.298-10.95-8.558Z" fill="#000" fill-opacity=".6"/>
`,
  smile02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10.222C18 21.785 24.474 28 38 28c13.518 0 20-6.338 20-17.778C58 9.496 57.174 8 55 8H21c-2.051 0-3 1.385-3 2.222Z" fill="#000" fill-opacity=".8"/>
  <mask id="mouthSmile02-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="18" y="8" width="40" height="20">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M18 10.222C18 21.785 24.474 28 38 28c13.518 0 20-6.338 20-17.778C58 9.496 57.174 8 55 8H21c-2.051 0-3 1.385-3 2.222Z" fill="#fff"/>
  </mask>
  <g mask="url(#mouthSmile02-a)">
    <rect x="30" y="2" width="16" height="14" rx="2" fill="#fff"/>
  </g>
`,
  square01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <rect x="24" y="6" width="27" height="8" rx="4" fill="#000" fill-opacity=".8"/>
`,
  square02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <rect x="16" y="8" width="44" height="4" rx="2" fill="#000" fill-opacity=".8"/>
`,
};
