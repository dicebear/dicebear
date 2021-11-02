import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const nose: ComponentGroup = {
  mediumRound: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M4.25 5a.75.75 0 0 1 1.5 0c0 .84.91 1.75 2.25 1.75 1.34 0 2.25-.91 2.25-1.75a.75.75 0 0 1 1.5 0c0 1.66-1.59 3.25-3.75 3.25S4.25 6.66 4.25 5Z" fill="#000" style="mix-blend-mode:overlay" opacity=".36"/>`,
  smallRound: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M5.29 6.24a.75.75 0 1 1 1.42-.48c.23.7.62 1 1.3 1 .66 0 1.05-.3 1.28-1a.75.75 0 1 1 1.42.48c-.42 1.3-1.37 2.01-2.7 2.01S5.72 7.54 5.3 6.24Z" fill="#000" style="mix-blend-mode:overlay" opacity=".36"/>`,
  wrinkles: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path opacity=".12" fill-rule="evenodd" clip-rule="evenodd" d="M11.72 5.3c.21.73.27 1.38.2 1.95a20.24 20.24 0 0 1 2.12 4.41.5.5 0 1 0 .94-.32 21.23 21.23 0 0 0-3.4-6.3c.07.07.11.16.14.25Zm-7.44 0a.75.75 0 0 1 .11-.24 28.75 28.75 0 0 0-2.07 3.22c-.48.89-.9 1.9-1.3 3.06a.5.5 0 0 0 .94.32 20.24 20.24 0 0 1 2.12-4.4 4.77 4.77 0 0 1 .19-1.97Z" fill="#000"/><path d="M5.2 4.78a.75.75 0 0 0-.92.51c-.21.75-.27 1.4-.2 1.97.23 1.6 1.6 2.49 3.92 2.49 2.33 0 3.7-.89 3.92-2.5.07-.57.01-1.22-.2-1.96a.75.75 0 1 0-1.44.42c.52 1.83-.09 2.54-2.28 2.54-2.2 0-2.8-.71-2.28-2.54a.75.75 0 0 0-.51-.93Z" fill="#000" style="mix-blend-mode:overlay" opacity=".36"/>`,
};
