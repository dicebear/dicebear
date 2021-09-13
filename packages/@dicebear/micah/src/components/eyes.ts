import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const eyes: ComponentGroup = {
  eyes: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="#000">
    <ellipse cx="56.53" cy="37.402" rx="9" ry="13.5" transform="rotate(-6.776 56.53 37.402)"/>
    <ellipse cx="120.531" cy="27.402" rx="9" ry="13.5" transform="rotate(-6.276 120.531 27.402)"/>
  </g>
  <g transform="translate(-40 -8)">
    ${components.glasses?.value(components, colors) ?? ''}
  </g>
`,
  round: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g fill="#000">
    <ellipse cx="56.117" cy="36.927" rx="9" ry="10" transform="rotate(-6.776 56.117 36.927)"/>
    <ellipse cx="120.149" cy="26.923" rx="9" ry="10" transform="rotate(-6.276 120.149 26.923)"/>
  </g>
  <g transform="translate(-40 -8)">
    ${components.glasses?.value(components, colors) ?? ''}
  </g>
`,
  eyesShadow: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <circle cx="55.24" cy="28.239" r="12" transform="rotate(-6.276 55.24 28.24)" fill="${
    colors.eyeShadow.value
  }"/>
  <ellipse cx="56.53" cy="37.402" rx="9" ry="13.5" transform="rotate(-6.776 56.53 37.402)" fill="#000"/>
  <circle cx="119.019" cy="19.61" r="12" transform="rotate(-6.276 119.019 19.61)" fill="${
    colors.eyeShadow.value
  }"/>
  <ellipse cx="120.531" cy="27.402" rx="9" ry="13.5" transform="rotate(-6.276 120.531 27.402)" fill="#000"/>
  <g transform="translate(-40 -8)">
    ${components.glasses?.value(components, colors) ?? ''}
  </g>
`,
  smiling: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M45.287 42.073c.114.813 1.147.994 1.722.408 2.465-2.516 6.255-4.365 10.654-4.887 2.595-.309 5.091-.12 7.316.472.754.2 1.495-.437 1.231-1.17-1.665-4.646-6.365-7.7-11.474-7.093-5.942.706-10.185 6.095-9.48 12.036l.03.234ZM109.385 32.072c.113.814 1.146.995 1.721.41 2.443-2.486 6.192-4.312 10.542-4.829 2.565-.304 5.032-.118 7.232.464.754.2 1.495-.438 1.231-1.171-1.655-4.594-6.307-7.611-11.363-7.01-5.886.699-10.09 6.037-9.391 11.923l.028.213Z" fill="#000"/>
  <g transform="translate(-40 -8)">
    ${components.glasses?.value(components, colors) ?? ''}
  </g>
`,
};
