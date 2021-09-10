import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const eyebrows: ComponentGroup = {
  up: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="${colors.eyebrow.value}" stroke-width="4" stroke-linecap="round">
    <path d="M99 10.214c5.667-2.666 19-5.1 27 6.5M23.58 35.521c2.07-5.91 9.681-17.125 23.562-14.699"/>
  </g>
`,
  down: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="${colors.eyebrow.value}" stroke-width="4" stroke-linecap="round">
    <path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0"/>
  </g>
`,
  eyelashesUp: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="${colors.eyebrow.value}" stroke-width="4" stroke-linecap="round">
    <path d="M99 10.214c5.667-2.666 19-5.1 27 6.5M23.58 35.521c2.07-5.91 9.681-17.125 23.562-14.699M26.074 29.458l-6.148-5.427M122.961 11.157l6.148-5.427M32.523 23.814l-4.046-7.132M115.512 7.513l4.047-7.132M40.6 20.2l-2.202-7.9M106.436 6.9l2.201-7.9"/>
  </g>
`,
  eyelashesDown: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <g stroke="${colors.eyebrow.value}" stroke-width="4" stroke-linecap="round">
    <path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0M37.148 26.458 31 21.03M116.219 9.444l1.785-8.005M45.597 22.814l-4.046-7.132M108.142 9.018 109.08.87M52.674 17.2l-2.201-7.9M99.993 8.031l-.776-8.164"/>
  </g>
`,
};
