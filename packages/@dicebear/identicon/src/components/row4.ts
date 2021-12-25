import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const row4: ComponentGroup = {
  xooox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M1 3H0v1h1V3ZM5 3H4v1h1V3Z" fill="${colors.row.value}"/>`,
  xxoxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M2 3H0v1h2V3ZM5 3H3v1h2V3Z" fill="${colors.row.value}"/>`,
  xoxox: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M0 3h1v1H0V3ZM4 3h1v1H4V3ZM3 3H2v1h1V3Z" fill="${colors.row.value}"/>`,
  oxxxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${colors.row.value}" d="M1 3h3v1H1z"/>`,
  xxxxx: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${colors.row.value}" d="M0 3h5v1H0z"/>`,
  oxoxo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M2 3H1v1h1V3ZM4 3H3v1h1V3Z" fill="${colors.row.value}"/>`,
  ooxoo: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path fill="${colors.row.value}" d="M2 3h1v1H2z"/>`,
};
