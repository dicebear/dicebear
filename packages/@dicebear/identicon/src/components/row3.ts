import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const row3: ComponentGroup = {
  xooox: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M1 2H0v1h1V2ZM5 2H4v1h1V2Z" fill="${colors.row.value}"/>
`,
  xxoxx: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M2 2H0v1h2V2ZM5 2H3v1h2V2Z" fill="${colors.row.value}"/>
`,
  xoxox: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M0 2h1v1H0V2ZM4 2h1v1H4V2ZM3 2H2v1h1V2Z" fill="${colors.row.value}"/>
`,
  oxxxo: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill="${colors.row.value}" d="M1 2h3v1H1z"/>
`,
  xxxxx: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill="${colors.row.value}" d="M0 2h5v1H0z"/>
`,
  oxoxo: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M2 2H1v1h1V2ZM4 2H3v1h1V2Z" fill="${colors.row.value}"/>
`,
  ooxoo: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill="${colors.row.value}" d="M2 2h1v1H2z"/>
`,
};
