import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const center: ComponentGroup = {
  shape1Inverted: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M24 0H0v24h24V0ZM8.5 12 5 5l7 3.5L19 5l-3.5 7 3.5 7-7-3.5L5 19l3.5-7Z" fill="${colors.base.value}"/>
`,
  shape1: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M12 8.5 5 5l3.5 7L5 19l7-3.5 7 3.5-3.5-7L19 5l-7 3.5Z" fill="${colors.base.value}"/>
`,
  shape2Inverted: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0h24v24H0V0Zm13 13h7v7h-7v-7Zm-2 0H4v7h7v-7Zm2-9h7v7h-7V4Zm-2 0H4v7h7V4Z" fill="${colors.base.value}"/>
`,
  shape2: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M13 4h7v7h-7V4ZM11 13H4v7h7v-7ZM20 13h-7v7h7v-7ZM11 4H4v7h7V4Z" fill="${colors.base.value}"/>
`,
  shape3Inverted: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0h24v24H0V0Zm11 16.5L4 13v7l7-3.5Zm2-9L20 4v7l-7-3.5ZM11 4H4l3.5 7L11 4Zm2 16 3.5-7 3.5 7h-7Z" fill="${colors.base.value}"/>
`,
  shape3: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="m20 11-7-3.5L20 4v7ZM13 20h7l-3.5-7-3.5 7ZM11 16.5 4 13v7l7-3.5ZM11 4H4l3.5 7L11 4Z" fill="${colors.base.value}"/>
`,
  shape4Inverted: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M24 0H0v24h24V0ZM12 2v5l10 5h-5l-5 10v-5L2 12h5l5-10Z" fill="${colors.base.value}"/>
`,
  shape4: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M12 7V2L7 12H2l10 5v5l5-10h5L12 7Z" fill="${colors.base.value}"/>
`,
  shape5Inverted: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M0 0h24v24H0V0Zm20 16.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM7.5 20a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM20 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM7.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="${colors.base.value}"/>
`,
  shape5: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M20 7.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM7.5 20a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM16.5 20a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM7.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="${colors.base.value}"/>
`,
  shape6Inverted: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M24 0H0v24h24V0ZM12 6l-6 6 6 6 6-6-6-6Z" fill="${colors.base.value}"/>
`,
  shape6: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="m6 12 6-6 6 6-6 6-6-6Z" fill="${colors.base.value}"/>
`,
  shape7Inverted: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M24 0H0v24h24V0ZM12 19a7 7 0 1 0 0-14 7 7 0 0 0 0 14Z" fill="${colors.base.value}"/>
`,
  shape7: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <circle cx="12" cy="12" r="7" fill="${colors.base.value}"/>
`,
  shape8: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path fill="${colors.base.value}" d="M4 4h16v16H4z"/>
`,
  shape9: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M12 0v9L6 0h6ZM24 12h-9l9-6v6ZM12 24v-9l6 9h-6ZM9 12H0v6l9-6Z" fill="${colors.base.value}"/>
`,
};
