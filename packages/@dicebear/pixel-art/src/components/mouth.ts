import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const mouth: ComponentGroup = {
  surprised03: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M9 12v2h2v-2H9Z" fill="${colors.mouth.value}"/>
`,
  surprised02: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M9 13v1h1v-1H9Z" fill="${colors.mouth.value}"/>
`,
  happy09: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M7 12v1h1v1h4v-1H8v-1H7Z" fill="${colors.mouth.value}"/>
`,
  happy08: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M10 12v1H9v1h2v-2h-1Z" fill="${colors.mouth.value}"/>
`,
  happy07: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 13v1h4v-1h1v-1h-1v1H8Z" fill="${colors.mouth.value}"/>
`,
  happy06: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M9 12v2h2v-1h-1v-1H9Z" fill="${colors.mouth.value}"/>
  <path d="M11 14v-1h-1v-1H9v1h1v1h1Z" fill="#fff" fill-opacity=".2"/>
`,
  happy05: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 12v1h1v1h2v-1h1v-1H8Z" fill="${colors.mouth.value}"/>
`,
  happy04: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M9 13v1h2v-1h1v-1h-1v1H9Z" fill="${colors.mouth.value}"/>
`,
  happy03: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 12v1h1v1h2v-1H9v-1H8Z" fill="${colors.mouth.value}"/>
`,
  happy02: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 12v1h1v1h2v-1h1v-1h-1v-1H9v1H8Z" fill="${colors.mouth.value}"/>
  <path d="M9 12v1h2v-1H9Z" fill="#fff"/>
`,
  happy01: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 12v1h1v1h2v-1h1v-1h-1v-1H9v1H8Z" fill="${colors.mouth.value}"/>
  <path d="M9 12v1h2v-1H9Z" fill="#fff" fill-opacity=".2"/>
`,
  sad08: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M9 12v1H8v1h4v-1h-1v-1H9Z" fill="${colors.mouth.value}"/>
`,
  sad07: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M11 12v1H9v1H8v-1h1v-1h2Z" fill="${colors.mouth.value}"/>
`,
  sad06: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 12h3v1H8v-1Z" fill="${colors.mouth.value}"/>
`,
  sad05: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 12h4v1H8v-1Z" fill="${colors.mouth.value}"/>
`,
  sad04: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M9 12h2v1H9v-1Z" fill="${colors.mouth.value}"/>
`,
  sad03: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 12v1h3v1h1v-1h-1v-1H8Z" fill="${colors.mouth.value}"/>
`,
  sad02: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 13v1h1v-1h3v-1H9v1H8Z" fill="${colors.mouth.value}"/>
`,
  sad01: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M10 12v1h1v1h1v-2h-2Z" fill="${colors.mouth.value}"/>
`,
  surprised01: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M8 12v2h4v-2H8Z" fill="#fff"/>
`,
};
