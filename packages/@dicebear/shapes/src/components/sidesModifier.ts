import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const sidesModifier: ComponentGroup = {
  none: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `${components.sidesWrapper?.value(components, colors) ?? ''}`,
  lightGray: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) =>
    `<mask id="sidesModifierLightGray-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">${
      components.sidesWrapper?.value(components, colors) ?? ''
    }</mask><g mask="url(#sidesModifierLightGray-a)"><path fill="#E5E5E5" d="M0 0h48v48H0z"/></g>`,
  gray: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="sidesModifierGray-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">${
      components.sidesWrapper?.value(components, colors) ?? ''
    }</mask><g mask="url(#sidesModifierGray-a)"><path fill="#737373" d="M0 0h48v48H0z"/></g>`,
  lighten: (components: ComponentPickCollection, colors: ColorPickCollection) =>
    `<mask id="sidesModifierLighten-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="48" height="48">${
      components.sidesWrapper?.value(components, colors) ?? ''
    }</mask><g mask="url(#sidesModifierLighten-a)"><path fill="${
      colors.base.value
    }" d="M0 0h48v48H0z"/><path fill="#fff" fill-opacity=".5" d="M0 0h48v48H0z"/></g>`,
};
