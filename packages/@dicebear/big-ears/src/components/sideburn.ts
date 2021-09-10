import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const sideburn: ComponentGroup = {
  variant07: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M52 8H11v96h41V8Z" fill="${colors.hair.value}"/>
`,
  variant06: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M26 0h-3C12.507 0 4 8.507 4 19v52c0 10.493 8.507 19 19 19h3c10.493 0 19-8.507 19-19V19C45 8.507 36.493 0 26 0Z" fill="${colors.hair.value}"/>
`,
  variant05: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M10 94V8h32l-3.657 76.851L10 94Z" fill="${colors.hair.value}"/>
`,
  variant04: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M11 103V7.5h40L11 103Z" fill="${colors.hair.value}"/>
`,
  variant03: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M43.146 45.02C42.87 31.832 41.486.988 25.579 0 8.049 0 8.683 33.651 7.75 45.02c-.825 10.078-3.49 17.277 0 36.38C9.803 92.63 17.538 94.007 25.58 94c7.641-.007 15.603-.892 17.567-9.644 4.03-17.963.274-26.148 0-39.336Z" fill="${colors.hair.value}"/>
`,
  variant02: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M18.067 31.813C17.223 12.236 14.86 2.316 31.957 0c19.632 3.579 14.112 22.55 12 31.813-2.11 9.262 9.574 18.946 7.463 39.365C49.309 91.598 26.386 101.173 15.458 84c-14-22 3.454-32.61 2.61-52.187Z" fill="${colors.hair.value}"/>
`,
  variant01: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M32.537 87.5C8.122 87.5 2.57 32.476 5 4h27.537C26.302 19.934 29.281 33.81 31 51c2 20 21.336 5.14 25.422-2.748C56.916 63.949 44.398 87.5 32.537 87.5Z" fill="${colors.hair.value}"/>
`,
};
