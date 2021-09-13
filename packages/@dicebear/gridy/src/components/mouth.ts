import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const mouth: ComponentGroup = {
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M7 5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z" fill="${colors.mouth.value}"/>
`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M7 5.25a5.38 5.38 0 0 0 5-3.5H2a5.38 5.38 0 0 0 5 3.5Z" fill="${colors.mouth.value}"/>
`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M7 1.75a5.38 5.38 0 0 1 5 3.5H2a5.38 5.38 0 0 1 5-3.5Z" fill="${colors.mouth.value}"/>
`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M1 1a1 1 0 0 0-1 1v3a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H1Zm1.5 1c.28 0 .5.22.5.5v2a.5.5 0 1 1-1 0v-2c0-.28.22-.5.5-.5Zm3 0c.28 0 .5.22.5.5v2a.5.5 0 1 1-1 0v-2c0-.28.22-.5.5-.5Zm3 0c.28 0 .5.22.5.5v2a.5.5 0 1 1-1 0v-2c0-.28.22-.5.5-.5Zm3 0c.28 0 .5.22.5.5v2a.5.5 0 1 1-1 0v-2c0-.28.22-.5.5-.5Z" fill="${colors.mouth.value}"/>
`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M3 1a1 1 0 0 0-1 1v2c0 .55 1.45 2 2 2h6c.55 0 2-1.45 2-2V2a1 1 0 0 0-1-1H3Zm1 1h2v2a1 1 0 1 1-2 0V2Zm4 0h2v2a1 1 0 1 1-2 0V2Z" fill="${colors.mouth.value}"/>
`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M2.5 2a.5.5 0 0 0-.5.5V3h-.5a.5.5 0 1 0 0 1H2v.5a.5.5 0 1 0 1 0V4h2v.5a.5.5 0 1 0 1 0V4h2v.5a.5.5 0 1 0 1 0V4h2v.5a.5.5 0 1 0 1 0V4h.5a.5.5 0 1 0 0-1H12v-.5a.5.5 0 1 0-1 0V3H9v-.5a.5.5 0 1 0-1 0V3H6v-.5a.5.5 0 1 0-1 0V3H3v-.5a.5.5 0 0 0-.5-.5Z" fill="${colors.mouth.value}"/>
`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.mouth.value}">
    <path d="M7 4.5A5.38 5.38 0 0 0 12 1H2a5.38 5.38 0 0 0 5 3.5Z"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="m3.09 2 .97 5 .98-5H3.1ZM8.96 2l.98 5 .97-5H8.96Z"/>
  </g>
`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.mouth.value}">
    <path d="M7 0a5.38 5.38 0 0 1 5 3.5H2A5.38 5.38 0 0 1 7 0Z"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="m3.09 2 .97 5 .98-5H3.1ZM8.96 2l.98 5 .97-5H8.96Z"/>
  </g>
`,
};
