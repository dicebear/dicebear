import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const mustache: ComponentGroup = {
  pencilThinBeard: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M26.5 45s4.5-.5 11-2v2c-1.5.667-5.5 1.6-7.5 2-2.5.5-3.5-2-3.5-2ZM48 44.756S44 44 38 43v2c1.429.585 4.595 1.149 6.5 1.5 2.381.439 3.5-1.744 3.5-1.744ZM33.31 55.242A1 1 0 0 1 34.28 54h3.44a1 1 0 0 1 .97 1.242l-.25 1a1 1 0 0 1-.97.758h-2.94a1 1 0 0 1-.97-.758l-.25-1Z" fill="${colors.hair.value}"/>
`,
  pencilThin: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M37.5 43c-6.5 1.5-11 2-11 2s1 2.5 3.5 2c2-.4 6-1.333 7.5-2v-2ZM38 43c6 1 10 1.756 10 1.756s-1.119 2.183-3.5 1.744l-.32-.059C42.256 46.088 39.35 45.553 38 45v-2Z" fill="${colors.hair.value}"/>
`,
  horshoe: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M27 46a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v11a4 4 0 0 1-4-4v-7h-9v7a4 4 0 0 1-4 4V46Z" fill="${colors.hair.value}"/>
`,
  freddy: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M28 46a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3H28Z" fill="${colors.hair.value}"/>
`,
};
