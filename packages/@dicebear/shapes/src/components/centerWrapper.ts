import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const centerWrapper: ComponentGroup = {
  default: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <g transform="translate(12 12)">
    ${components.center?.value(components, colors) ?? ''}
  </g>
`,
};
