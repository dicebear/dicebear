import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const hat: ComponentGroup = {
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `<path d="M4 1v2H2v2h16V3h-2V1H4Z" fill="${colors.hat.value}"/>`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `<path d="M4 4H2v1h16V4h-2V1H4v3Z" fill="${colors.hat.value}"/>`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 4v2h14V4h-1V3h-1V2H5v1H4v1H3Z" fill="${colors.hat.value}"/>`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M6 1v1H5v1H4v2h14V4h-2V3h-1V2h-1V1H6Z" fill="${colors.hat.value}"/>`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 5V3h2V1h10v2h2v2H3Z" fill="${colors.hat.value}"/><path d="M4 1v2h12V1H4Z" fill="#fff" fill-opacity=".2"/>`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 5V4h2V1h10v3h2v1H3Z" fill="${colors.hat.value}"/><path d="M5 1v3h10V1H5Z" fill="#fff" fill-opacity=".2"/>`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 6V4h1V3h1V2h10v1h1v1h1v2H3Z" fill="${colors.hat.value}"/><path fill-rule="evenodd" clip-rule="evenodd" d="M4 3v1h12V3H4ZM3 5v1h14V5H3Z" fill="#fff" fill-opacity=".2"/>`,
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M14 2H6v1H5v1H4v2h14V5h-2V4h-1V3h-1V2Z" fill="${colors.hat.value}"/><path d="M5 6h1V5h1V4h1V3H7v1H6v1H5v1Z" fill="#fff" fill-opacity=".2"/>`,
  variant09: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 1v2H3v2h14V3h-2V1H5Z" fill="${colors.hat.value}"/><path d="M14 3V0h-1v3h1Z" fill="#fff" fill-opacity=".2"/>`,
  variant10: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M4 0v5H2v1h16V5h-2V0H4Z" fill="${colors.hat.value}"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15 3V0h-1v3h1Zm-2-3v2h-1V0h1Z" fill="#fff" fill-opacity=".2"/>`,
  variant11: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M3 3v2h14V3h-1V2h-1V1H5v1H4v1H3Z" fill="${colors.hat.value}"/><path fill-rule="evenodd" clip-rule="evenodd" d="M14 1v4h-1V1h1Zm-2 0v4h-1V1h1Z" fill="#fff" fill-opacity=".2"/>`,
  variant12: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5 4H4v2h14V5h-2V4h-1V3h-1V2H6v1H5v1Z" fill="${colors.hat.value}"/><path d="M14 4h-3v1h3V4Z" fill="#fff" fill-opacity=".2"/>`,
};
