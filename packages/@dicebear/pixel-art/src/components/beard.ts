import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const beard: ComponentGroup = {
  variant04: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path opacity=".9" d="M4 10v3h1v1h1v1h8v-1h1v-1h1v-3h-2v1H6v-1H4Z" fill="${colors.hair.value}"/>
`,
  variant03: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path opacity=".9" d="M4 13h1v1h1v1h8v-1h1v-1h1v-3h-1v1h-1v1H6v-1H5v-1H4v3Z" fill="${colors.hair.value}"/>
`,
  variant02: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path opacity=".9" d="M4 11v2h1v1h1v1h8v-1h1v-1h1v-2H4Z" fill="${colors.hair.value}"/>
`,
  variant01: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path opacity=".9" d="M4 8v5h1v1h1v1h8v-1h1v-1h1V8h-1v2h-1v1h-1l-.059 1H7v-1H6v-1H5V8H4Z" fill="${colors.hair.value}"/>
`,
};
