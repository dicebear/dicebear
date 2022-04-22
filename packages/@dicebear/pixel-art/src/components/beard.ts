import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const beard: ComponentGroup = {
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 6h1v3h8V6h1v5h-1v1H4v-1H3V6Z" fill="${colors.hair.value}"/>`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `<path d="M3 9v2h1v1h8v-1h1V9H3Z" fill="${colors.hair.value}"/>`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 9h3v1h4V9h3v2h-1v1H4v-1H3V9Z" fill="${colors.hair.value}"/>`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 6h1v2h1v1h6V8h1V6h1v5h-1v1H4v-1H3V6Z" fill="${colors.hair.value}"/>`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `<path fill="${colors.hair.value}" d="M6 11h4v1H6z"/>`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 9h2v1h6V9h2v2h-1v2h-1v1H5v-1H4v-2H3V9Z" fill="${colors.hair.value}"/>`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 11h6v1h-1v1H9v1H7v-1H6v-1H5v-1Z" fill="${colors.hair.value}"/>`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 8h2v1h1v1h4V9h1V8h2v3h-1v1H4v-1H3V8Z" fill="${colors.hair.value}"/>`,
};
