import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const corners: ComponentGroup = {
  shape10: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M0 12V0l12 12H0Z" fill="${colors.base.value}"/>`,
  shape09: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M12 12H0L12 0v12Z" fill="${colors.base.value}"/>`,
  shape08: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M12 0v12L0 0h12Z" fill="${colors.base.value}"/>`,
  shape07: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M0 0h12L0 12V0Z" fill="${colors.base.value}"/>`,
  shape06: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<circle cx="6" cy="6" r="4" fill="${colors.base.value}"/>`,
  shape05: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M12 0H0l12 6V0Z" fill="${colors.base.value}"/>`,
  shape04: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M0 0v12L6 0H0Z" fill="${colors.base.value}"/>`,
  shape03: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M0 12h12L0 6v6Z" fill="${colors.base.value}"/>`,
  shape02: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M12 12V0L6 12h6Z" fill="${colors.base.value}"/>`,
  shape01: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="m0 6 6-6 6 6-6 6-6-6Z" fill="${colors.base.value}"/>`,
};
