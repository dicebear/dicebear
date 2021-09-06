import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../types.js';

export const mustache: ComponentGroup = {
  pencilThinBeard: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M26.5 45s4.5-.5 11-2v2c-1.5.67-5.5 1.6-7.5 2-2.5.5-3.5-2-3.5-2ZM48 44.76S44 44 38 43v2c1.43.59 4.6 1.15 6.5 1.5 2.38.44 3.5-1.74 3.5-1.74ZM33.31 55.24a1 1 0 0 1 .97-1.24h3.44a1 1 0 0 1 .97 1.24l-.25 1a1 1 0 0 1-.97.76h-2.94a1 1 0 0 1-.97-.76l-.25-1Z" fill="${colors.hair.value}"/>`,
  pencilThin: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<path d="M37.5 43c-6.5 1.5-11 2-11 2s1 2.5 3.5 2c2-.4 6-1.33 7.5-2v-2ZM38 43c6 1 10 1.76 10 1.76s-1.12 2.18-3.5 1.74l-.32-.06c-1.92-.35-4.83-.89-6.18-1.44v-2Z" fill="${colors.hair.value}"/>`,
  horshoe: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M27 46a3 3 0 0 1 3-3h11a3 3 0 0 1 3 3v11a4 4 0 0 1-4-4v-7h-9v7a4 4 0 0 1-4 4V46Z" fill="${colors.hair.value}"/>`,
  freddy: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<path d="M28 46a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3H28Z" fill="${colors.hair.value}"/>`,
};
