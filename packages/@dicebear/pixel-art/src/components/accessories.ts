import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const accessories: ComponentGroup = {
  'variant04': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M3 10v1h1v-1H3Zm13 0v1h1v-1h-1Z" fill="${colors.accessories.value}"/>`,
  'variant03': (components: ComponentPickCollection, colors: ColorPickCollection) => `<path fill-rule="evenodd" clip-rule="evenodd" d="M3 10v2h1v-2H3Zm13 0h1v2h-1v-2Z" fill="${colors.accessories.value}"/>`,
  'variant02': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g fill-rule="evenodd" clip-rule="evenodd"><path d="M3 10v2h1v-2H3Zm13 0h1v2h-1v-2Z" fill="${colors.accessories.value}"/><path d="M3 10v1h1v-1H3Zm13 0h1v1h-1v-1Z" fill="#fff" fill-opacity=".4"/></g>`,
  'variant01': (components: ComponentPickCollection, colors: ColorPickCollection) => `<g fill="${colors.accessories.value}"><path d="M4 11H2v2h2v-2ZM18 11h-2v2h2v-2Z"/></g>`,
}
