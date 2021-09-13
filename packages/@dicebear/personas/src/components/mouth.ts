import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const mouth: ComponentGroup = {
  smile: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5 5.87a1 1 0 1 1 1-1.74A6 6 0 0 0 9 5a6 6 0 0 0 3-.87 1 1 0 1 1 1 1.74A8 8 0 0 1 9 7a8 8 0 0 1-4-1.13Z" fill="#1B0640"/>
`,
  frown: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5 4.13a1 1 0 1 0 1 1.74A6 6 0 0 1 9 5a6 6 0 0 1 3 .87 1 1 0 1 0 1-1.74A8 8 0 0 0 9 3a8 8 0 0 0-4 1.13Z" fill="#1B0640"/>
`,
  surprise: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <ellipse cx="9" cy="5" rx="2" ry="2.5" fill="#1B0640"/>
`,
  pacifier: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 2c-.76 0-1.51-.14-2.27-.41A2.03 2.03 0 0 0 4 3.5c0 1.4.82 2.6 2 3.17a3 3 0 0 0 6 0 3.5 3.5 0 0 0 2-3.17 2.03 2.03 0 0 0-2.73-1.91C10.51 1.86 9.76 2 9 2ZM7.59 7h2.82A1.5 1.5 0 0 1 7.6 7Z" fill="#456DFF"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.5v.17a3.5 3.5 0 0 0 2-3.17 2.03 2.03 0 0 0-2.73-1.91 6.61 6.61 0 0 1-4.54 0A2.03 2.03 0 0 0 4 3.5c0 1.4.82 2.6 2 3.17V6.5a3 3 0 1 1 6 0ZM7.59 7h2.82A1.5 1.5 0 1 0 7.6 7Z" fill="#fff" fill-opacity=".3" style="mix-blend-mode:lighten"/>
  <circle cx="9" cy="4.5" r="1.5" fill="#fff"/>
`,
  bigSmile: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M6 3h6v1a3 3 0 0 1-6 0V3Z" fill="#fff"/>
`,
  smirk: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M7.32 5.73a.75.75 0 0 1 .36-1.46c2.44.61 4.17.32 5.29-.8a.75.75 0 1 1 1.06 1.06c-1.54 1.54-3.81 1.92-6.71 1.2Z" fill="#1B0640"/>
`,
  lips: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5 5h8s-1 2.5-4 2.5S5 5 5 5Z" fill="#DC5C7A"/>
  <path d="M5.39 4.22A2.1 2.1 0 0 1 9 4a2.1 2.1 0 0 1 3.61.22l.4.78H4.99l.39-.78Z" fill="#F57B98"/>
`,
};
