import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const earrings: ComponentGroup = {
  hoop: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M24 0A24 24 0 1 1 0 24c0-6.4 3.5-11.5 6.57-16.5L7.5 6" stroke="${colors.earring.value}" stroke-width="4"/>
`,
  stud: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <circle cx="25" cy="2" r="4" fill="${colors.earring.value}"/>
  <circle cx="26" cy="1" r="1" fill="#fff"/>
`,
};
