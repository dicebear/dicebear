import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const centerModifier: ComponentGroup = {
  none: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `${components.centerWrapper?.value(components, colors) ?? ''}`,
  lightGray: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="centerModifierLightGray-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">${
      components.centerWrapper?.value(components, colors) ?? ''
    }</mask><g mask="url(#centerModifierLightGray-a)"><path fill="#E5E5E5" d="M0 0h48v48H0z"/></g>`,
  gray: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="centerModifierGray-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">${
      components.centerWrapper?.value(components, colors) ?? ''
    }</mask><g mask="url(#centerModifierGray-a)"><path fill="#737373" d="M0 0h48v48H0z"/></g>`,
  lighten: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="centerModifierLighten-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">${
      components.centerWrapper?.value(components, colors) ?? ''
    }</mask><g mask="url(#centerModifierLighten-a)"><path fill="${
      colors.base.value
    }" d="M0 0h48v48H0z"/><path fill="#fff" fill-opacity=".5" d="M0 0h48v48H0z"/></g>`,
};
