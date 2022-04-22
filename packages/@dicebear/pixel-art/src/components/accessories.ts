import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const accessories: ComponentGroup = {
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M2 7h1v1H2zM13 7h1v1h-1z" fill="${colors.accessories.value}"/>`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M13 7h1v2h-1zM2 7h1v2H2z" fill="${colors.accessories.value}"/>`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path fill="${colors.accessories.value}" d="M13 7h1v2h-1zM2 7h1v2H2z"/><path fill="none" d="M2 7h1v1H2zM13 7h1v1h-1z"/>`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M13 7h2v2h-2zM1 7h2v2H1z" fill="${colors.accessories.value}"/>`,
};
