import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const cornersWrapper: ComponentGroup = {
  default: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `${
      components.corners?.value(components, colors) ?? ''
    }<g transform="rotate(90 24 24)">${
      components.corners?.value(components, colors) ?? ''
    }</g><g transform="rotate(-90 24 24)">${
      components.corners?.value(components, colors) ?? ''
    }</g><g transform="rotate(180 24 24)">${
      components.corners?.value(components, colors) ?? ''
    }</g>`,
};
