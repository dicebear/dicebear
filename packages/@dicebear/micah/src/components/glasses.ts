import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const glasses: ComponentGroup = {
  'round': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="${colors.glasses.value}" stroke-width="4">
    <circle cx="122.5" cy="28" r="26"/>
    <circle cx="55.5" cy="37" r="26"/>
    <path d="M97.5 35a8 8 0 0 0-16 0M30 39 0 44.5"/>
  </g>
`,
  'square': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="${colors.glasses.value}" stroke-width="4">
    <path d="M34.5 42.5 0 49.125" stroke-linecap="round"/>
    <path d="m35.472 18.535 38.716-5.442a6 6 0 0 1 6.777 5.107l5.567 39.61a6 6 0 0 1-5.107 6.777l-34.472 4.845a6 6 0 0 1-6.654-4.478l-9.811-39.015a6 6 0 0 1 4.984-7.404ZM145.919 3.22l-38.716 5.44a6 6 0 0 0-5.107 6.777l5.567 39.611a6 6 0 0 0 6.777 5.107l34.472-4.845a6 6 0 0 0 5.162-6.139l-1.323-40.207a6 6 0 0 0-6.832-5.744ZM83.5 37.125l22-3.5"/>
  </g>
`,
}
