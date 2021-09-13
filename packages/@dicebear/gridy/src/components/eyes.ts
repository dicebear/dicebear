import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const eyes: ComponentGroup = {
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M8 0a7.03 7.03 0 0 0-5.75 3 7 7 0 0 0 11.5 0A7.01 7.01 0 0 0 8 0Zm0 .5a2.5 2.5 0 1 1 .01 5 2.5 2.5 0 0 1 0-5Zm0 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z" fill="${colors.eyes.value}"/>
`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.eyes.value}">
    <path d="M8 1c-.99 0-1.81.86-2 2h.75c.19-.58.72-1 1.25-1s1.06.42 1.25 1H10c-.19-1.14-1.01-2-2-2Z"/>
    <path d="M6 0H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM14 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1Z"/>
  </g>
`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M11.93 4.81c1.63-.41 2.76-1.38 2.54-2.15-.21-.78-1.7-2-3.32-1.58-1.62.42-2.76 2.3-2.54 3.08.22.78 1.7 1.07 3.32.65ZM4.07 4.81C2.44 4.4 1.3 3.43 1.53 2.66c.21-.78 1.7-2 3.32-1.58 1.62.42 2.76 2.3 2.54 3.08-.22.78-1.7 1.07-3.32.65Z" fill="${colors.eyes.value}"/>
`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M2 0 0 2l4 4 3-1V3l-.05-.03A2.5 2.5 0 1 1 2.94.57L2 0Zm1.89 1.13A1.5 1.5 0 1 0 6 2.5l-.01-.1-2.1-1.27ZM14 0l-.94.56A2.48 2.48 0 0 1 11.5 5a2.5 2.5 0 0 1-2.45-2.03L9 3v2l3 1 4-4-2-2Zm-1.89 1.13-2.1 1.26v.1a1.5 1.5 0 1 0 2.1-1.36Z" fill="${colors.eyes.value}" fill-rule="evenodd" clip-rule="evenodd"/>
`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.eyes.value}">
    <path d="M6.97 4.79 2.71.5 2 1.21 6.26 5.5l.71-.71Z"/>
    <path d="m2.71 5.5 4.26-4.29-.7-.71L2 4.79l.71.71ZM14 4.79 9.74.5l-.71.71 4.26 4.29.71-.71Z"/>
    <path d="M9.74 5.5 14 1.21l-.71-.7-4.26 4.28.7.71Z"/>
  </g>
`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.eyes.value}">
    <path d="M11.5 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3ZM4.5 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
    <path d="M11.5 4.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/>
  </g>
`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.eyes.value}">
    <path d="M11.5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 1a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM4.5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5Zm0 1a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z"/>
    <path d="M8 1.5c-.99 0-1.81.86-2 2h.75c.19-.58.72-1 1.25-1s1.06.42 1.25 1H10c-.19-1.14-1.01-2-2-2Z"/>
  </g>
`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M14 1.5H2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1Z" fill="${colors.eyes.value}"/>
`,
};
