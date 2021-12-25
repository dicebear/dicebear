import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const sideburn: ComponentGroup = {
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `<path d="M52 8H11v96h41V8Z" fill="${colors.hair.value}"/>`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M26 0h-3A19 19 0 0 0 4 19v52a19 19 0 0 0 19 19h3a19 19 0 0 0 19-19V19A19 19 0 0 0 26 0Z" fill="${colors.hair.value}"/>`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `<path d="M10 94V8h32l-3.7 76.9L10 94Z" fill="${colors.hair.value}"/>`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `<path d="M11 103V7.5h40L11 103Z" fill="${colors.hair.value}"/>`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M43.1 45C43 31.8 41.5 1 25.6 0 8 0 8.6 33.7 7.8 45c-.9 10-3.5 17.3 0 36.4C9.8 92.6 17.5 94 25.6 94c7.6 0 15.6-.9 17.5-9.6 4-18 .3-26.2 0-39.4Z" fill="${colors.hair.value}"/>`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M18 31.8C17.3 12.2 15 2.3 32 0c19.6 3.6 14 22.6 12 31.8-2.2 9.3 9.5 19 7.4 39.4-2 20.4-25 30-36 12.8-14-22 3.5-32.6 2.7-52.2Z" fill="${colors.hair.value}"/>`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M32.5 87.5C8.1 87.5 2.5 32.5 5 4h27.5c-6.2 16-3.2 29.8-1.5 47 2 20 21.3 5.1 25.4-2.7.5 15.6-12 39.2-23.9 39.2Z" fill="${colors.hair.value}"/>`,
};
