import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const eyebrows: ComponentGroup = {
  'variant13': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M8 4v1H7v1H5V5h2V4h1Zm4 0h1v1h2v1h-2V5h-1V4Z" fill="${colors.hair.value}"/>
    <path d="M8 4v1H7v1H5V5h2V4h1Zm4 0h1v1h2v1h-2V5h-1V4Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant12': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M6 5h3v2H8V6H6V5Zm5 0h3v1h-2v1h-1V5Z" fill="${colors.hair.value}"/>
    <path d="M6 5h3v2H8V6H6V5Zm5 0h3v1h-2v1h-1V5Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant11': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M5 5h3v1h1v1H8V6H5V5Zm10 0h-3v1h-1v1h1V6h3V5Z" fill="${colors.hair.value}"/>
    <path d="M5 5h3v1h1v1H8V6H5V5Zm10 0h-3v1h-1v1h1V6h3V5Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant10': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M6 5H4v2h1V6h1V5Zm8 0h2v2h-1V6h-1V5Z" fill="${colors.hair.value}"/>
    <path d="M6 5H4v2h1V6h1V5Zm8 0h2v2h-1V6h-1V5Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant09': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M5 6h2v1H5V6Zm8 0h2v1h-2V6Z" fill="${colors.hair.value}"/>
    <path d="M5 6h2v1H5V6Zm8 0h2v1h-2V6Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant08': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M6 5h1v1h1v1H5V6h1V5Zm7 0h1v1h1v1h-3V6h1V5Z" fill="${colors.hair.value}"/>
    <path d="M6 5h1v1h1v1H5V6h1V5Zm7 0h1v1h1v1h-3V6h1V5Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant07': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M6 5h2v1h1v1H8V6H6V5Zm8 0h-2v1h-1v1h1V6h2V5Z" fill="${colors.hair.value}"/>
    <path d="M6 5h2v1h1v1H8V6H6V5Zm8 0h-2v1h-1v1h1V6h2V5Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant06': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M12 7V6h1V5h1v1h1v1h-1V6h-1v1h-1ZM5 7V6h1V5h1v1h1v1H7V6H6v1H5Z" fill="${colors.hair.value}"/>
    <path d="M12 7V6h1V5h1v1h1v1h-1V6h-1v1h-1ZM5 7V6h1V5h1v1h1v1H7V6H6v1H5Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant05': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M7 5v1H5v1H4V6h1V5h2Zm6 0h2v1h1v1h-1V6h-2V5Z" fill="${colors.hair.value}"/>
    <path d="M7 5v1H5v1H4V6h1V5h2Zm6 0h2v1h1v1h-1V6h-2V5Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant04': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M4 7V5h3v1H5v1H4Zm12-2v2h-1V6h-2V5h3Z" fill="${colors.hair.value}"/>
    <path d="M4 7V5h3v1H5v1H4Zm12-2v2h-1V6h-2V5h3Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant03': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M7 5h1v1h1v1H8V6H7V5Zm6 0v1h-1v1h-1V6h1V5h1Z" fill="${colors.hair.value}"/>
    <path d="M7 5h1v1h1v1H8V6H7V5Zm6 0v1h-1v1h-1V6h1V5h1Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant02': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M4 7V6h1V5h1v1H5v1H4Zm10-2h1v1h1v1h-1V6h-1V5Z" fill="${colors.hair.value}"/>
    <path d="M4 7V6h1V5h1v1H5v1H4Zm10-2h1v1h1v1h-1V6h-1V5Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
  'variant01': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M7 5v1H5v1H4V6h1V5h2Zm7 0v1h-2v1h-1V6h1V5h2Z" fill="${colors.hair.value}"/>
    <path d="M7 5v1H5v1H4V6h1V5h2Zm7 0v1h-2v1h-1V6h1V5h2Z" fill="#000" fill-opacity=".1"/>
  </g>
`,
}
