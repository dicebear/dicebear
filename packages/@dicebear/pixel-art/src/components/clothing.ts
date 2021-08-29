import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const clothing: ComponentGroup = {
  'variant25': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h12v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path d="M5 20v-2h1v-1h8v1h1v2h-2v-1h-2v1H9v-1H7v1H5Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant24': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h12v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path d="M8 16H4v1H3v3h14v-3h-1v-1h-4v1h1v1h-1v1h-1v-1H9v1H8v-1H7v-1h1v-1Z" fill="#fff" fill-opacity=".2"/>
  <path d="M9 16v1h2v-1H9Z" fill="#fff"/>
`,
  'variant23': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h12v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M9 16H4v1H3v3h6v-2H8v-1h1v-1Zm2 0h5v1h1v3h-6v-2h1v-1h-1v-1Z" fill="#fff" fill-opacity=".3"/>
`,
  'variant22': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h3v2h6v-2h3v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 16H4v1H3v3h2v-4Zm1 0h1v2h6v-2h1v4H6v-4Zm9 0h1v1h1v3h-2v-4Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant21': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4v1h1v1h2v-1h1v-1h4v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 17v-1h3v1H4Zm9 0v-1h3v1h-3Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant20': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h3v-1h1v1h1v1h2v-1h.965L12 15h1v1h3v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M6 16H4v1H3v3h6v-2H8v-1H6v-1Zm2 0h1-1Zm3 0h1-1Zm2 0h1v1h-2v1h-1v2h6v-3h-1v-1h-3Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant19': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5 16H4v1H3v3h14v-3h-1v-1h-3v1H7v-1H5Z" fill="${colors.clothes.value}"/>
  <path d="M10 20v-1h3v1h-3Z" fill="#fff" fill-opacity=".5"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 16H4v1H3v3h1v-1h1v-3Zm1 0h1v1h6v-1h1v2H6v-2Zm9 0h1v1h1v3h-1v-1h-1v-3Z" fill="#fff" fill-opacity=".8"/>
`,
  'variant18': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 20v-1h1v1H3Zm2 0v-1h1v1H5Zm2 0v-1h1v1H7Zm2 0v-1h1v1H9Zm2 0v-1h1v1h-1Zm2 0v-1h1v1h-1Zm2 0v-1h1v1h-1Zm1-2h1v1h-1v-1Zm-2 0h1v1h-1v-1Zm-2 0h1v1h-1v-1Zm-2 0h1v1h-1v-1Zm-2 0h1v1H8v-1Zm-2 0h1v1H6v-1Zm-2 0h1v1H4v-1Zm-1-1h1v1H3v-1Zm2 0h1v1H5v-1Zm2 0h1v1H7v-1Zm2 0h1v1H9v-1Zm2 0h1v1h-1v-1Zm2 0h1v1h-1v-1Zm2 0h1v1h-1v-1ZM4 16h1v1H4v-1Zm2 0h1v1H6v-1Zm6 0h1v1h-1v-1Zm2 0h1v1h-1v-1Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant17': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 20v-2h1v2H3Zm3 0v-2h2v2H6Zm4 0v-2h2v2h-2Zm4 0v-2h2v2h-2Zm2-3v1h1v-1h-1Zm-2 1v-2h-2v2h2Zm-6-1v1h2v-1H8Zm-4-1v2h2v-2H4Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant16': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 19h14v1H3v-1Zm0-2h14v1H3v-1Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant15': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3Z" fill="${colors.clothes.value}"/>
`,
  'variant14': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4.027L8 15h4l.011 1H16v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path d="M3 20v-3h1v-1h12v1h1v3H3Z" fill="#fff" fill-opacity=".2"/>
  <path d="M12 20v-1h3v1h-3Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant13': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h12v1h1v3H3Z" fill="${colors.clothes.value}"/>
`,
  'variant12': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M4 16v4h4v-1H7v-1H6v-1H5v-1H4Zm12 0v4h-4v-1h1v-1h1v-1h1v-1h1Z" fill="${colors.clothes.value}"/>
`,
  'variant11': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M5 16h1v2h1v1h1v1H5v-4Zm9 0h1v4h-3v-1h1v-1h1v-2Z" fill="${colors.clothes.value}"/>
`,
  'variant10': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M4 20v-2h1v-1h1v-1h2v1h1v1h2v-1h1v-1h2v1h1v1h1v2H4Z" fill="${colors.clothes.value}"/>
`,
  'variant09': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4v1h1v1h2v-1h1v-1h4v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path d="M3 20v-3h1v-1h2v1h1v1h1v1h4v-1h1v-1h1v-1h2v1h1v3H3Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant08': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h5v1h2v-1h5v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 20v-2h1v1h3v1H3Zm14 0v-2h-1v1h-3v1h4Z" fill="#fff" fill-opacity=".4"/>
  <path d="M7 16H4v1H3v1h1v1h3v1h6v-1h3v-1h1v-1h-1v-1h-3v1H7v-1Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant07': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4v1h4v-1h4v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path d="M15 20h2v-3h-1v-1h-4v1H8v-1H4v1H3v3h2v-2h10v2Z" fill="#fff" fill-opacity=".4"/>
`,
  'variant06': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h4v1h1v1h2v-1h1v-1h4v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path d="M6 16v1h1v1h1v1h4v-1h1v-1h1v-1h-2v1h-1v1H9v-1H8v-1H6Z" fill="#fff" fill-opacity=".4"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M13 20v-1h2v1h-2Zm1-4v1h2v-1h-2Zm-8 0H4v1h2v-1Z" fill="#fff" fill-opacity=".2"/>
`,
  'variant05': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h3v1h1v1h1v1h2v-1h1v-1h1v-1h3v1h1v3H3Z" fill="${colors.clothes.value}"/>
`,
  'variant04': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 20v-3h1v-1h2v1h1v1h1v1h1v1H3Zm14 0v-3h-1v-1h-2v1h-1v1h-1v1h-1v1h6Z" fill="${colors.clothes.value}"/>
`,
  'variant03': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="${colors.clothes.value}">
    <path d="M4 16v4h4v-1H7v-1H6v-2H4ZM16 20v-4h-2v2h-1v1h-1v1h4Z"/>
  </g>
`,
  'variant02': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h3v1h1v1h1v1h2v-1h1v-1h1v-1h3v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path d="M6 16v1h1v1h1v1h1v1h2v-1h1v-1h1v-1h1v-1h-1v1h-1v1h-1v1H9v-1H8v-1H7v-1H6Z" fill="#fff" fill-opacity=".4"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M15 16v1h-1v1h-1v1h-1v1h-1v-1h1v-1h1v-1h1v-1h1ZM5 16v1h1v1h1v1h1v1h1v-1H8v-1H7v-1H6v-1H5Z" fill="#fff" fill-opacity=".2"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 20h1v-3h1v1h1v1h1v1h1v-1H7v-1H6v-1H5v-1H4v1H3v3Zm14 0v-3h-1v-1h-1v1h-1v1h-1v1h-1v1h1v-1h1v-1h1v-1h1v3h1Z" fill="#fff" fill-opacity=".1"/>
`,
  'variant01': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M3 20v-3h1v-1h5v1h2v-1h5v1h1v3H3Z" fill="${colors.clothes.value}"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M3 17h14v1H3v-1Zm0 2v1h14v-1H3Z" fill="#fff" fill-opacity=".2"/>
`,
}
