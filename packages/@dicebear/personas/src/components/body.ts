import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const body: ComponentGroup = {
  squared: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M16 5v3a5 5 0 0 0 10 0V5l6.647 2.045A9 9 0 0 1 39 15.647V20H3v-4.353a9 9 0 0 1 6.353-8.602L16 5Z" fill="${colors.clothing.value}"/>
`,
  rounded: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M16 7v.47a5 5 0 1 0 10 0V7c7.063 1.523 12.93 6.735 16 13H0C3.07 13.735 8.937 8.523 16 7Z" fill="${colors.clothing.value}"/>
`,
  small: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M32 20H10v-8a11 11 0 0 1 6-9.8V4a5 5 0 0 0 10 0V2.2a11 11 0 0 1 6 9.8v8Z" fill="${colors.clothing.value}"/>
  <mask id="bodySmall-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="10" y="2" width="22" height="18">
    <path d="M32 20H10v-8a11 11 0 0 1 6-9.8V4a5 5 0 0 0 10 0V2.2a11 11 0 0 1 6 9.8v8Z" fill="#fff"/>
  </mask>
  <g mask="url(#bodySmall-a)">
    <path opacity=".136" d="M20.617 8.25 22 8l1.207.5L10 15l10.617-6.75Z" fill="#000"/>
    <path d="M21 1h11v47H10V15l13.345-6.578L21 1Z" fill="#fff" style="mix-blend-mode:overlay" opacity=".261"/>
  </g>
`,
  checkered: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M16 5v3a5 5 0 0 0 10 0V5l6.647 2.045A9 9 0 0 1 39 15.647V20H3v-4.353a9 9 0 0 1 6.353-8.602L16 5Z" fill="${colors.clothing.value}"/>
  <mask id="bodyCheckered-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="3" y="5" width="36" height="15">
    <path d="M16 5v3a5 5 0 0 0 10 0V5l6.647 2.045A9 9 0 0 1 39 15.647V20H3v-4.353a9 9 0 0 1 6.353-8.602L16 5Z" fill="#fff"/>
  </mask>
  <g mask="url(#bodyCheckered-a)">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M7 20h4V6.538l-1.647.507A8.99 8.99 0 0 0 7 8.163V20ZM32.647 7.045 31 6.538V20h4V8.163a8.99 8.99 0 0 0-2.353-1.118ZM23 20h4v-8.392a7.017 7.017 0 0 1-4 3.102V20Zm-4 0h-4v-8.392a7.017 7.017 0 0 0 4 3.102V20Z" fill="#000" style="mix-blend-mode:overlay" opacity=".404"/>
  </g>
  <path d="M3.397 13a9.014 9.014 0 0 1 2.535-4h8.139a6.982 6.982 0 0 0 2.03 4H3.397ZM39 17v3H3v-3h36ZM36.068 9a9.014 9.014 0 0 1 2.535 4H25.899a6.982 6.982 0 0 0 2.03-4h8.14Z" style="mix-blend-mode:lighten" opacity=".18" fill="#fff"/>
  <mask id="bodyCheckered-b" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="3" y="9" width="36" height="11">
    <path d="M3.397 13a9.014 9.014 0 0 1 2.535-4h8.139a6.982 6.982 0 0 0 2.03 4H3.397ZM39 17v3H3v-3h36ZM36.068 9a9.014 9.014 0 0 1 2.535 4H25.899a6.982 6.982 0 0 0 2.03-4h8.14Z" style="mix-blend-mode:lighten" fill="#fff"/>
  </mask>
`,
};
