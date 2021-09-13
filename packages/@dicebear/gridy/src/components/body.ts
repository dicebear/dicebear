import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const body: ComponentGroup = {
  variant08: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.body.value}">
    <path d="M12 19a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"/>
    <path d="M15.33 14H8.67C7.75 14 7 14.45 7 15v7c0 .55.75 1 1.67 1h6.66c.92 0 1.67-.45 1.67-1v-7c0-.55-.75-1-1.67-1Z"/>
  </g>
`,
  variant07: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g fill="${colors.body.value}">
    <path d="M6 4.2 3 21l9 2 9-2-3-16.8C16.96-.17 7 .02 6 4.2Z"/>
    <path d="M3.5 19a1.5 1.5 0 1 0 0-2.98 1.5 1.5 0 1 0 0 2.99ZM4.5 15.02a1.5 1.5 0 1 0 0-3 1.5 1.5 0 1 0 0 3ZM20.5 19a1.5 1.5 0 1 1 0-2.98 1.5 1.5 0 1 1 0 2.99ZM19.5 15.02a1.5 1.5 0 1 1 0-3 1.5 1.5 0 1 1 0 3Z"/>
  </g>
`,
  variant06: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M14.44 1 12 3.44 9.56 1 1 9.56 3.44 12 1 14.44 9.56 23 12 20.56 14.44 23 23 14.44 20.56 12 23 9.56 14.44 1Z" fill="${colors.body.value}"/>
`,
  variant05: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" fill="${colors.body.value}"/>
`,
  variant04: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M5 1v4H1v14h4v4h14v-4h4V5h-4V1H5Z" fill="${colors.body.value}"/>
`,
  variant03: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="m3.96 2 1.6 7.99L1 14.54l1.42 1.4 3.62-3.6L7.98 22h8.04l1.94-9.65 3.62 3.6L23 14.54l-4.57-4.55L20.03 2H3.97Z" fill="${colors.body.value}"/>
`,
  variant02: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M22 17.75 12 23.5 2 17.75V6.25L12 .5l10 5.75v11.5Z" fill="${colors.body.value}"/>
`,
  variant01: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="m7.1 2-1 4h-4l2 8-2 8h20l-2-8 2-8h-4l-1-4h-10Z" fill="${colors.body.value}"/>
`,
};
