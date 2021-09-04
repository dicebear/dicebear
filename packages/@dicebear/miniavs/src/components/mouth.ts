import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const mouth: ComponentGroup = {
  'default': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M27.93 46a1 1 0 0 1 1-1h9.142a1 1 0 0 1 1 1 5 5 0 0 1-5 5H32.93a5 5 0 0 1-5-5Z" fill="#66253C"/>
  <path d="M35.756 50.708a4.992 4.992 0 0 1-1.684.29H32.93a5 5 0 0 1-4.996-4.8c.764-.285 1.898-.253 3.017-.22.356.01.71.02 1.05.02 2.21 0 4 1.568 4 3.5 0 .426-.087.833-.245 1.21Z" fill="#B03E67"/>
  <path d="M29 45h10v1a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-1Z" fill="#fff"/>
`,
  'missingTooth': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M27.93 46a1 1 0 0 1 1-1h9.142a1 1 0 0 1 1 1 5 5 0 0 1-5 5H32.93a5 5 0 0 1-5-5Z" fill="#66253C"/>
  <path d="M35.756 50.708a4.992 4.992 0 0 1-1.684.29H32.93a5 5 0 0 1-4.996-4.8c.764-.285 1.898-.253 3.017-.22.356.01.71.02 1.05.02 2.21 0 4 1.568 4 3.5 0 .426-.087.833-.245 1.21Z" fill="#B03E67"/>
  <path d="M29 45h10v1a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-1Z" fill="#fff"/>
  <path d="M31 45.3a.3.3 0 0 1 .3-.3h1.4a.3.3 0 0 1 .3.3v2.4a.3.3 0 0 1-.3.3h-1.4a.3.3 0 0 1-.3-.3v-2.4Z" fill="#B03E67"/>
`,
}
