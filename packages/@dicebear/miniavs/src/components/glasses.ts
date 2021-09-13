import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const glasses: ComponentGroup = {
  normal: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g stroke="#000" stroke-width="2">
    <circle cx="30.269" cy="36.269" r="4.269"/>
    <circle cx="44.269" cy="36.269" r="4.269"/>
    <path d="m33.985 35.106 7-.104"/>
  </g>
`,
};
