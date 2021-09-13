import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const mustache: ComponentGroup = {
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M65.3 21.1c-6-2.3-20.4-2.7-28.3 2.8-8 5.5-10.1 7-5.9 7.8A74 74 0 0 0 62.8 29a7 7 0 0 0 3.3-7.3"/>
    <path d="M85.4 20c-12-4.3-17-1-18.6 2.7-.7 1.5-1.2 4.8 1.3 5.8 3 1.2 22.8 1.3 32-1.6 2.6-2.2-3.4-2.8-14.7-6.8Z"/>
  </g>
`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M61 24.9c-14.7 2.1-46 8-58 11.5M126.8 22.4c-14.7 2.1-46.5 1-58.5 1.7"/>
    <path d="M60.3 25.3c-14.7 2-38 11.6-51.5 13.1M123.5 26.2c-14.8 2.1-40.6-1.6-53.9-1.6M61 24.2C46.4 26.3 15.9 30 3.6 31.7M128 17c-14.7 2.1-47.5 4.4-59.8 6.2"/>
  </g>
`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M32 23c6 4.5 20.8 11 32 0M68.7 22c3 3.8 17.3 9.1 30-1" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M63.3 24.1c-4.7-1.7-22.6 3-28 1.5-5.3-1.5-8.6-4.8-6.6-7.3s2.5-1 3.3 0c.7.8 1.6 1.5 3 1.2 2-.4 3.3-1.7 2.2-3.7-1.3-2.5-10.8-2.5-11.7 0-.8 2.5-1.8 10.6 7.4 12.6 9.1 2 29-3.6 30.4-2.8 1.3.8 13.5 2.2 22.8 1.7 9.4-.6 19-7.2 16.6-11.5-2.5-4.4-14-2.9-11.8-.4.7.6 2.6 1.5 4 .4 1.6-1.5 4.4 1.2 0 5.3-3.4 3-24.1 6-29.6 3" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
};
