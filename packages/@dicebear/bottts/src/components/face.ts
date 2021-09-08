import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const face: ComponentGroup = {
  'round01': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <mask id="faceRound01-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M66 0c58.352 0 64.001 40.685 64 78-.001 33.315-25.466 42-64 42-37.461 0-66-8.685-66-42C0 40.685 7.648 0 66 0Z" fill="#fff"/>
  </mask>
  <g mask="url(#faceRound01-a)">
    <path d="M-4-2h138v124H-4V-2Z" fill="${colors.base.value}"/>
    <g transform="translate(-1 -1)">
      ${components.texture?.value(components, colors) ?? ''}
    </g>
  </g>
`,
  'round02': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <mask id="faceRound02-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 31c0 .02.014-.184 0-1 .183-.477.402-1.497 1-3 .827-3.056 2.78-6.556 6-10C16.694 6.6 35.172 0 65 0s48.306 6.6 58 17c3.22 3.444 5.173 6.944 6 10 .598 1.503.817 2.524 1 3-.014.816 0 1.02 0 1v39c0-.104-.028.501 0 1-.261 2.117-.529 4.015-1 6-1.186 5.991-3.394 11.911-7 17-9.717 16.337-27.745 26-57 26s-47.284-9.662-57-26c-3.606-5.09-5.813-11.009-7-17-.471-1.985-.739-3.883-1-6 .028-.453 0-1.323 0-1V31Z" fill="#fff"/>
  </mask>
  <g mask="url(#faceRound02-a)">
    <path d="M-4-2h138v124H-4V-2Z" fill="${colors.base.value}"/>
    <g transform="translate(-1 -1)">
      ${components.texture?.value(components, colors) ?? ''}
    </g>
  </g>
`,
  'square01': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <mask id="faceSquare01-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
    <rect width="130" height="120" rx="18" fill="#fff"/>
  </mask>
  <g mask="url(#faceSquare01-a)">
    <path d="M-2-2h134v124H-2V-2Z" fill="${colors.base.value}"/>
    <g transform="translate(-1 -1)">
      ${components.texture?.value(components, colors) ?? ''}
    </g>
  </g>
`,
  'square02': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <mask id="faceSquare02-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
    <path d="M0 12C0 5.373 5.373 0 12 0h106c6.627 0 12 5.373 12 12v70c0 20.987-17.013 38-38 38H38c-20.987 0-38-17.013-38-38V12Z" fill="#fff"/>
  </mask>
  <g mask="url(#faceSquare02-a)">
    <path d="M-2-2h134v124H-2V-2Z" fill="${colors.base.value}"/>
    <g transform="translate(-1 -1)">
      ${components.texture?.value(components, colors) ?? ''}
    </g>
  </g>
`,
  'square03': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <mask id="faceSquare03-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 18C0 8.059 8.059 0 18 0h94c9.941 0 18 8.059 18 18v27.148c0 4.535-.771 9.037-2.28 13.313l-17.481 49.53A18.002 18.002 0 0 1 93.265 120h-56.53a18 18 0 0 1-16.974-12.009l-17.48-49.53A40 40 0 0 1 0 45.148V18Z" fill="#fff"/>
  </mask>
  <g mask="url(#faceSquare03-a)">
    <path d="M-2-2h134v124H-2V-2Z" fill="${colors.base.value}"/>
    <g transform="translate(-1 -1)">
      ${components.texture?.value(components, colors) ?? ''}
    </g>
  </g>
`,
  'square04': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <mask id="faceSquare04-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="130" height="120">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M0 102V68.852a40 40 0 0 1 2.28-13.313l17.481-43.53A18 18 0 0 1 36.735 0h56.53a18.001 18.001 0 0 1 16.974 12.01l17.481 43.529A40.006 40.006 0 0 1 130 68.852V102c0 9.941-8.059 18-18 18H18c-9.941 0-18-8.059-18-18Z" fill="#fff"/>
  </mask>
  <g mask="url(#faceSquare04-a)">
    <path d="M-2-2h134v124H-2V-2Z" fill="${colors.base.value}"/>
    <g transform="translate(-1 -1)">
      ${components.texture?.value(components, colors) ?? ''}
    </g>
  </g>
`,
}
