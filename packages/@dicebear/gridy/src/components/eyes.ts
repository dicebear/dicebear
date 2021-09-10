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
  <path d="M8 0a7.026 7.026 0 0 0-5.75 2.994 7.01 7.01 0 0 0 8.993 2.212 7.01 7.01 0 0 0 2.507-2.2A7.01 7.01 0 0 0 8 0Zm0 .5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 1 1 0-5Zm0 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 1 0 0-3Z" fill="${colors.eyes.value}"/>
`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.eyes.value}">
    <path d="M8 1c-.99 0-1.811.858-2 2h.753c.183-.582.713-1 1.247-1 .534 0 1.064.418 1.247 1H10c-.189-1.142-1.01-2-2-2Z"/>
    <path d="M6 0H2a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1ZM14 0h-4a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1Z"/>
  </g>
`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M11.934 4.81c1.623-.415 2.757-1.376 2.54-2.151-.218-.775-1.703-1.99-3.325-1.575-1.623.416-2.757 2.301-2.54 3.076.218.776 1.703 1.066 3.325.65ZM4.066 4.81c-1.623-.415-2.757-1.376-2.54-2.151.218-.775 1.703-1.99 3.325-1.575 1.623.416 2.757 2.301 2.54 3.076-.218.776-1.703 1.066-3.325.65Z" fill="${colors.eyes.value}"/>
`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M2 0 0 2l4 4 3-1V3l-.047-.03A2.495 2.495 0 0 1 4.5 5 2.497 2.497 0 0 1 2 2.5c0-.787.37-1.48.936-1.938L2 0Zm1.887 1.133A1.498 1.498 0 0 0 4.5 4C5.33 4 6 3.33 6 2.5c0-.037-.01-.071-.012-.107l-2.101-1.26ZM14 0l-.935.562C13.63 1.02 14 1.712 14 2.5 14 3.883 12.883 5 11.5 5a2.495 2.495 0 0 1-2.453-2.03L9 3v2l3 1 4-4-2-2Zm-1.887 1.133-2.101 1.26c-.003.036-.012.07-.012.107 0 .83.67 1.5 1.5 1.5a1.498 1.498 0 0 0 .613-2.867Z" fill="${colors.eyes.value}" fill-rule="evenodd" clip-rule="evenodd"/>
`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.eyes.value}">
    <path d="M6.97 4.786 2.71.5 2 1.214 6.26 5.5l.71-.714Z"/>
    <path d="m2.71 5.5 4.26-4.286L6.26.5 2 4.786l.71.714ZM14 4.786 9.74.5l-.71.714L13.29 5.5l.71-.714Z"/>
    <path d="M9.74 5.5 14 1.214 13.29.5 9.03 4.786l.71.714Z"/>
  </g>
`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.eyes.value}">
    <path d="M11.5 4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S10 2.17 10 3s.67 1.5 1.5 1.5ZM4.5 4.5C5.33 4.5 6 3.83 6 3s-.67-1.5-1.5-1.5S3 2.17 3 3s.67 1.5 1.5 1.5Z"/>
    <path d="M11.5 4.5c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5S10 2.17 10 3s.67 1.5 1.5 1.5Z"/>
  </g>
`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.eyes.value}">
    <path d="M11.5.5A2.497 2.497 0 0 0 9 3c0 1.383 1.117 2.5 2.5 2.5S14 4.383 14 3 12.883.5 11.5.5Zm0 1c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5S10 3.83 10 3s.67-1.5 1.5-1.5ZM4.5.5A2.497 2.497 0 0 0 2 3c0 1.383 1.117 2.5 2.5 2.5S7 4.383 7 3 5.883.5 4.5.5Zm0 1C5.33 1.5 6 2.17 6 3s-.67 1.5-1.5 1.5S3 3.83 3 3s.67-1.5 1.5-1.5Z"/>
    <path d="M8 1.5c-.99 0-1.811.858-2 2h.753c.183-.582.713-1 1.247-1 .534 0 1.064.418 1.247 1H10c-.189-1.142-1.01-2-2-2Z"/>
  </g>
`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M14 1.5H2a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-1a1 1 0 0 0-1-1Z" fill="${colors.eyes.value}"/>
`,
};
