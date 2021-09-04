import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const eyes: ComponentGroup = {
  'normal': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="${colors.hair.value}">
    <rect x="30" y="36" width="3" height="4" rx="1.5"/>
    <rect x="40" y="36" width="3" height="4" rx="1.5"/>
  </g>
  <g>
    ${components.blushes?.value(components, colors) ?? ''}
  </g>
`,
  'confident': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g>
    ${components.blushes?.value(components, colors) ?? ''}
  </g>
  <path d="M43 37.5a1.5 1.5 0 0 1-3 0v-1.227c0-.15.122-.273.273-.273h2.454c.15 0 .273.122.273.273V37.5ZM33 37.5a1.5 1.5 0 0 1-3 0v-1.227c0-.15.122-.273.273-.273h2.454c.15 0 .273.122.273.273V37.5Z" fill="${colors.hair.value}"/>
  <path stroke="${colors.hair.value}" stroke-linecap="round" d="M29.5 36.5h4M39.5 36.5h4"/>
`,
  'happy': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g>
    ${components.blushes?.value(components, colors) ?? ''}
  </g>
  <g fill="#1B0B47">
    <path d="M30 37.5a1.5 1.5 0 0 1 3 0v1.227c0 .15-.122.273-.273.273h-2.454a.273.273 0 0 1-.273-.273V37.5ZM40 37.5a1.5 1.5 0 0 1 3 0v1.227c0 .15-.122.273-.273.273h-2.454a.273.273 0 0 1-.273-.273V37.5Z"/>
  </g>
`,
}
