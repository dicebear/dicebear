import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const eyebrows: ComponentGroup = {
  up: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M99 10.214c5.667-2.666 19-5.1 27 6.5M23.58 35.521c2.07-5.91 9.681-17.125 23.562-14.699" stroke="${colors.eyebrow.value}" stroke-width="4" stroke-linecap="round"/>
`,
  down: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M27 26.5c6.167 2.5 21.1 3 31.5-15M94 4c5.167 5.333 18.1 12.8 28.5 0" stroke="${colors.eyebrow.value}" stroke-width="4" stroke-linecap="round"/>
`,
  eyelashesUp: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M99 13.214c5.667-2.666 19-5.1 27 6.5M23.58 38.521c2.07-5.91 9.681-17.125 23.562-14.699M26.074 32.458l-6.148-5.427M122.961 14.157l6.148-5.427M32.523 26.814l-4.046-7.132M115.512 10.514l4.047-7.133M40.6 23.2l-2.202-7.9M106.436 9.9l2.201-7.9" stroke="${colors.eyebrow.value}" stroke-width="4" stroke-linecap="round"/>
`,
  eyelashesDown: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M27 29.5c6.167 2.5 21.1 3 31.5-15M94 7c5.167 5.333 18.1 12.8 28.5 0M37.148 29.458 31 24.03M116.219 12.444l1.785-8.005M45.597 25.814l-4.046-7.132M108.142 12.018l.938-8.147M52.674 20.2l-2.201-7.9M99.993 11.031l-.776-8.164" stroke="${colors.eyebrow.value}" stroke-width="4" stroke-linecap="round"/>
`,
};
