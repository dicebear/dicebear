import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const ears: ComponentGroup = {
  'attached': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M30.5 6.176A23.778 23.778 0 0 0 23.08 5c-10.493 0-19 6.5-18 18.5 1.042 12.5 8.507 17 19 17 1.168 0 2.31-.102 3.42-.299 1.21-.214 2.381-.54 3.5-.966" stroke="#000" stroke-width="8"/>
  <path d="M31.5 39.036a19.382 19.382 0 0 1-7.42 1.464c-10.493 0-17.958-4.5-19-17-1-12 7.507-18.5 18-18.5 3.138 0 6.187.606 8.92 1.73l-.5 32.306Z" fill="${colors.base.value}"/>
  <path d="M27.5 13.5c-4-1.833-12.8-2.8-16 8" stroke="#000" stroke-width="4"/>
  <path d="M17 14c2.167 1.833 6.3 7.5 5.5 15.5" stroke="#000" stroke-width="4"/>
  <g transform="translate(3 35)">
    ${components.earrings?.value(components, colors) ?? ''}
  </g>
`,
  'detached': (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M37 8.25V7.13l-.954-.585C32.312 4.254 27.772 3 23.08 3 17.44 3 12.16 4.747 8.398 8.295c-3.804 3.587-5.856 8.832-5.311 15.371.53 6.372 2.67 11.061 6.218 14.177a8.013 8.013 0 0 0-.243 3.21c.39 3.269 2.042 5.624 4.595 7.075C16.091 49.51 19.207 50 22.524 50c5.48 0 10.284-2.947 13.942-6.889l.534-.575V8.249Z" stroke="#000" stroke-width="4"/>
  <path d="M42.972 23.984c.071-.652.108-1.314.108-1.984 0-10.217-9.507-17-20-17s-19 6.5-18 18.5c.556 6.677 2.946 11.072 6.65 13.717-.588 1.024-.845 2.227-.682 3.6.63 5.281 5.138 7.183 11.476 7.183 11.105 0 19.892-14.047 20.448-24.016Z" fill="${colors.base.value}"/>
  <path d="M27.5 13.5c-4-1.833-12.8-2.8-16 8" stroke="#000" stroke-width="4"/>
  <path d="M17 14c2.167 1.833 6.3 7.5 5.5 15.5" stroke="#000" stroke-width="4"/>
  <g transform="translate(3 42)">
    ${components.earrings?.value(components, colors) ?? ''}
  </g>
`,
}
