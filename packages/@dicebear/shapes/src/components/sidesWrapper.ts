import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const sidesWrapper: ComponentGroup = {
  'default': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g transform="translate(12)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="rotate(90 18 18)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="rotate(90 18 30)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="rotate(-180 24 18)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="rotate(-180 18 24)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="rotate(-90 30 18)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="rotate(-90 18 18)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
  <g transform="translate(0 12)">
    ${components.sides?.value(components, colors) ?? ''}
  </g>
`,
}
