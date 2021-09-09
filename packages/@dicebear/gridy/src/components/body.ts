import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const body: ComponentGroup = {
  'variant08': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="${colors.body.value}">
    <path d="M12 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/>
    <path d="M15.333 14H8.667C7.747 14 7 14.448 7 15v7c0 .552.746 1 1.667 1h6.666c.92 0 1.667-.448 1.667-1v-7c0-.552-.746-1-1.667-1Z"/>
  </g>
`,
  'variant07': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="${colors.body.value}">
    <path d="M6 4.192 3 21.005 12 23l9-1.995-3-16.813C16.96-.156 6.996.029 6 4.192Z"/>
    <path d="M3.5 19.01a1.496 1.496 0 1 0 0-2.993 1.496 1.496 0 1 0 0 2.993ZM4.5 15.02a1.496 1.496 0 1 0 0-2.993 1.496 1.496 0 1 0 0 2.993ZM20.5 19.01a1.496 1.496 0 1 1 0-2.993 1.496 1.496 0 1 1 0 2.993ZM19.5 15.02a1.496 1.496 0 1 1 0-2.993 1.496 1.496 0 1 1 0 2.993Z"/>
  </g>
`,
  'variant06': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M14.444 1 12 3.444 9.556 1 1 9.556 3.444 12 1 14.444 9.556 23 12 20.556 14.444 23 23 14.444 20.556 12 23 9.556 14.444 1Z" fill="${colors.body.value}"/>
`,
  'variant05': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Z" fill="${colors.body.value}"/>
`,
  'variant04': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M5 1v4H1v14h4v4h14v-4h4V5h-4V1H5Z" fill="${colors.body.value}"/>
`,
  'variant03': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="m3.963 2 1.605 7.988L1 14.535l1.42 1.414 3.62-3.603L7.982 22h8.038l1.94-9.654 3.62 3.603L23 14.535l-4.568-4.547L20.037 2H3.963Z" fill="${colors.body.value}"/>
`,
  'variant02': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M22 17.75 12 23.5 2 17.75V6.25L12 .5l10 5.75v11.5Z" fill="${colors.body.value}"/>
`,
  'variant01': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="m7.102 2-1 4h-4l2 8-2 8h20l-2-8 2-8h-4l-1-4h-10Z" fill="${colors.body.value}"/>
`,
}
