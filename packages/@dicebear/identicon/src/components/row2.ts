import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const row2: ComponentGroup = {
  'xooox': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M1 1H0v1h1V1ZM5 1H4v1h1V1Z" fill="${colors.row.value}"/>
`,
  'xxoxx': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M2 1H0v1h2V1ZM5 1H3v1h2V1Z" fill="${colors.row.value}"/>
`,
  'xoxox': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M0 1h1v1H0V1ZM4 1h1v1H4V1ZM3 1H2v1h1V1Z" fill="${colors.row.value}"/>
`,
  'oxxxo': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill="${colors.row.value}" d="M1 1h3v1H1z"/>
`,
  'xxxxx': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill="${colors.row.value}" d="M0 1h5v1H0z"/>
`,
  'oxoxo': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M2 1H1v1h1V1ZM4 1H3v1h1V1Z" fill="${colors.row.value}"/>
`,
  'ooxoo': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill="${colors.row.value}" d="M2 1h1v1H2z"/>
`,
}
