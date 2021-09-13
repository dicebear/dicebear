import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const earrings: ComponentGroup = {
  hoop: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M26 2c13.255 0 24 10.745 24 24S39.255 50 26 50 2 39.255 2 26c0-6.391 3.5-11.5 6.572-16.5L9.5 8" stroke="${colors.earring.value}" stroke-width="4"/>
`,
  stud: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <circle cx="25" cy="4" r="4" fill="${colors.earring.value}"/>
  <circle cx="26" cy="3" r="1" fill="#fff"/>
`,
};
