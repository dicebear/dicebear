import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const glasses: ComponentGroup = {
  normal: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<g stroke="#000" stroke-width="2"><circle cx="30.27" cy="36.27" r="4.27"/><circle cx="44.27" cy="36.27" r="4.27"/><path d="m33.99 35.11 7-.1"/></g>`,
};
