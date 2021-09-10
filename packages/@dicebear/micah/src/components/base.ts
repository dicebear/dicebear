import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const base: ComponentGroup = {
  standard: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M154 319.5c-14.4-20-25.667-58.666-27-78L58.5 212 30 319.5h124Z" fill="${
    colors.base.value
  }" stroke="#000" stroke-width="4"/>
  <mask id="baseStandard-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="30" y="212" width="124" height="118">
    <path d="M154 329.5c-14.4-20-25.667-68.666-27-88L58.5 212 30 329.5h124Z" fill="${colors.base.value}"/>
  </mask>
  <g mask="url(#baseStandard-a)">
    <ellipse cx="124" cy="210" rx="59" ry="54" fill="#000" style="mix-blend-mode:multiply"/>
  </g>
  <path d="m181.939 151.374.002.009.093.389.144.654c8.851 40.206-16.109 80.258-56.315 89.89-40.205 9.633-80.606-14.759-90.935-54.61l-.19-.733-16.735-69.844-.067-.289C8.512 76.334 33.544 35.757 74.048 26.053c40.504-9.704 81.206 15.123 91.161 55.501l.051.208.02.083.001.005.048.198.047.199.002.004 16.396 68.437.003.009.081.338.081.339Z" fill="${
    colors.base.value
  }" stroke="#000" stroke-width="4"/>
  <g>
    <g transform="translate(34 102.3)">
      ${components.facialHair?.value(components, colors) ?? ''}
    </g>
  </g>
`,
};
