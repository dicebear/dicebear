import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const mouth: ComponentGroup = {
  variant18: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M20 19.5C22.2 15 31.3 5.6 50.3 6" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant17: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M44.4 6.5c-4.2 2-20.4 6.7-30.4 4.2 6.2 10 35 11.4 39.6 2.5 5-9.4-4.1-9.3-9.2-6.7Z" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant16: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M13.6 13.8c4.7 4 13.5 6.5 22.5 5.4A25 25 0 0 0 54.9 8.5M10 16.5c1.6-1 4.8-3.7 5-6.6M53.1 6c1 1.6 3.8 4.8 6.6 5" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant15: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M13.6 14.5c4.7 4 12.5 10.4 22.9-2 6.6-7.8 15.9.9 18.4-3.2M10 17.3c1.6-1 4.8-3.8 5-6.7M55.3 6c-.1 1.9.1 6 2.2 8" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant14: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M15 14s4.2 1.6 7 0c2.9-1.5 3-5.9 5.2-3.6 2.6 3 3 4.9 4.5 6.3 1.5 1.5 2.6-5 3.9-7 1.2-2.3 4.6 6.1 6.6 6.1 1.9 0 1.4-9.5 3.6-7.5 2.1 1.9 1.8 5.4 8.8 3.4" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant13: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M22.2 21.5c-.5.5-3-7.1-4.1-11l7.4 1.2-3.3 9.8ZM49.4 20.4c-.7.3-3-6-4.3-10l6-2c-1 3.1-.6 11.6-1.7 12Z"/>
    <path d="M13 4.7c3 6.2 12.4 7.7 24 6.4C47.4 10 53.4 6.7 56.4 3"/>
  </g>
`,
  variant12: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M54.3 13.7c4.9-9.4-1.4-10-6.6-7.4a48.9 48.9 0 0 1-23.5 2.4C17.8 6.3 14.4 2 14 13c-.4 11 36.2 8.6 40.3.8Z"/>
    <path d="M15.2 11.9c8 2.7 27 5.8 39.2-4M24 11l-1 5.6M30.8 12.4l-.5 6.2M37.4 11.7l1 6.4M45.3 9.8l1.4 7"/>
  </g>
`,
  variant11: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M34 9c-7.2 0-14-1.2-17-2 1 2.6 3.4 12 17 12 13.7 0 16.5-9.2 18.3-12-6 1.8-11 2-18.3 2Z" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant10: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M54.7 2c-7.3 0-26-.6-38.7 2.7C16 15.4 28.6 25 39.2 22 50 19 56.2 7 54.7 2Z" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant09: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16 6.6c5.3 2.5 13.5 8 22.7 7.7 11-.3 14.6-6.1 16-9.3"/>
    <path d="M34.3 6.3c-3-1.9-8.6 1.8-10 4.2 1.6 5.5 7.4 9.2 14 9.2 7.3 0 11.3-6.3 12-8.5h0c-.7-1.2-1.8-3.3-4.8-4.9-3.7-2-6.1 6-6.8 6-.7 0-.6-3.6-4.4-6Z"/>
  </g>
`,
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M4 14.8s5.7-2.8 7.1-7.6M12.2 9c.2.8-7 9.3-7 9.3M14.2 8.6C13.7 12.7 9 18.9 9 18.9M11.6 20s5.3-4.8 5.8-10.3M19.6 9.4c0 3.5-1.7 11.2-1.7 11.2M45.6 7.7V20M18.7 20.2s4.2-5.3 4.2-9.6M49.2 18.2s-3-6.2-3-10.6M25.3 10.2c.3 2.4-2.9 9.8-2.9 9.8M55.5 6.9c.3 2.3 5.4 8.3 5.4 8.3M49.2 8a50 50 0 0 0 4.8 9.8M27.7 10c-.6 4-1.3 10.7-1.3 10.7M50.8 7.3l6.4 9.2M30 9.9c.6 2.8.8 8.6 3.7 10.6M58.5 7.3c1.5 2.3 4.4 5.9 8.2 6.8M34 9c0 1.3-1.8 5.9 1 11M40 20.5S35 14.3 35 9M37.5 8.6c0 3.8 6.1 12 6.1 12M44.5 20c-.6-2-3.8-9.3-3.4-12.5" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M12 5.6c2.4 4 6.6 15.1 22.7 15.1C51 20.7 57 6.5 57.7 5" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M43.8 10.4c-8 1.5-20.5 1-22.4 2.4-3.4 3.7 16.2 1.3 20.5.8 8.8-1 11.7-4.9 2-3.2Z" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 11.2c3 1.1 9.3 3 24.3 1.7C54 11.2 54.3 9.6 58.7 7"/>
    <path d="M35.7 7.6A36.7 36.7 0 0 0 17 12.7c15.7 12.4 34.8 0 34.8-2.6-2.4-1-2.4-3.3-16-2.5Z"/>
  </g>
`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M34 10c-7.2 0-14-1.2-17-2 1 2.6 6.4 8.3 17 8.3 12 0 16.5-5.5 18.3-8.3-6 1.8-11 2-18.3 2Z" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M19.5 10c-1.3 2.1.4 7.7 15.3 6.8 14.9-1 19-9 14.5-8.8-6.2.2-10.7 4.2-20.1 2-3.4-.7-8.5-2-9.7 0Z" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M22 16.7c7.2 3.9 23.1 2 25.4-7 .2-1 0-2.7-1.2-2.7" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M17 12a88 88 0 0 0 36.2 0" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
`,
};
