import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const mouth: ComponentGroup = {
  'variant08': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M7 5c.83 0 1.5-.67 1.5-1.5S7.83 2 7 2s-1.5.67-1.5 1.5S6.17 5 7 5Z" fill="${colors.mouth.value}"/>
`,
  'variant07': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M7 5.25c2.28 0 4.217-1.46 5-3.5H2c.783 2.04 2.72 3.5 5 3.5Z" fill="${colors.mouth.value}"/>
`,
  'variant06': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M7 1.75c2.28 0 4.217 1.46 5 3.5H2c.783-2.04 2.72-3.5 5-3.5Z" fill="${colors.mouth.value}"/>
`,
  'variant05': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M1 1c-.554 0-1 .446-1 1v3c0 .554.446 1 1 1h12c.554 0 1-.446 1-1V2c0-.554-.446-1-1-1H1Zm1.5 1c.277 0 .5.223.5.5v2a.499.499 0 1 1-1 0v-2c0-.277.223-.5.5-.5Zm3 0c.277 0 .5.223.5.5v2a.499.499 0 1 1-1 0v-2c0-.277.223-.5.5-.5Zm3 0c.277 0 .5.223.5.5v2a.499.499 0 1 1-1 0v-2c0-.277.223-.5.5-.5Zm3 0c.277 0 .5.223.5.5v2a.499.499 0 1 1-1 0v-2c0-.277.223-.5.5-.5Z" fill="${colors.mouth.value}"/>
`,
  'variant04': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 1c-.554 0-1 .446-1 1v2c0 .554 1.446 2 2 2h6c.554 0 2-1.446 2-2V2c0-.554-.446-1-1-1H3Zm1 1h2v2c0 .554-.446 1-1 1s-1-.446-1-1V2Zm4 0h2v2c0 .554-.446 1-1 1s-1-.446-1-1V2Z" fill="${colors.mouth.value}"/>
`,
  'variant03': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M2.5 2c-.277 0-.5.223-.5.5V3h-.5a.499.499 0 1 0 0 1H2v.5a.499.499 0 1 0 1 0V4h2v.5a.499.499 0 1 0 1 0V4h2v.5a.499.499 0 1 0 1 0V4h2v.5a.499.499 0 1 0 1 0V4h.5a.499.499 0 1 0 0-1H12v-.5a.499.499 0 1 0-1 0V3H9v-.5a.499.499 0 1 0-1 0V3H6v-.5a.499.499 0 1 0-1 0V3H3v-.5c0-.277-.223-.5-.5-.5Z" fill="${colors.mouth.value}"/>
`,
  'variant02': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="${colors.mouth.value}">
    <path d="M7 4.5c2.28 0 4.217-1.46 5-3.5H2c.783 2.04 2.72 3.5 5 3.5Z"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="m3.086 2 .979 5 .978-5H3.086ZM8.957 2l.978 5 .979-5H8.957Z"/>
  </g>
`,
  'variant01': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="${colors.mouth.value}">
    <path d="M7 0c2.28 0 4.217 1.46 5 3.5H2C2.783 1.46 4.72 0 7 0Z"/>
    <path fill-rule="evenodd" clip-rule="evenodd" d="m3.086 2 .979 5 .978-5H3.086ZM8.957 2l.978 5 .979-5H8.957Z"/>
  </g>
`,
}
