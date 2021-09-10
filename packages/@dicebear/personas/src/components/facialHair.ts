import type { ComponentGroup, ComponentPickCollection, ColorPickCollection } from '../static-types';

export const facialHair: ComponentGroup = {
  beardMustache: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="m12.473 9.458 2.423-.827A2.504 2.504 0 0 1 18 10.001a2.504 2.504 0 0 1 3.104-1.37l2.423.827c3.466-1.33 6.425-3.817 8.47-6.756C31.999 2.8 32 2.9 32 3v6c0 7.732-6.268 14-14 14S4 16.732 4 9V3c0-.1.001-.2.003-.298 2.045 2.94 5.004 5.425 8.47 6.756Z" fill="${colors.hair.value}"/>
  <mask id="facialHairBeardMustache-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="2" width="28" height="21">
    <path d="m12.473 9.458 2.423-.827A2.504 2.504 0 0 1 18 10.001a2.504 2.504 0 0 1 3.104-1.37l2.423.827c3.466-1.33 6.425-3.817 8.47-6.756C31.999 2.8 32 2.9 32 3v6c0 7.732-6.268 14-14 14S4 16.732 4 9V3c0-.1.001-.2.003-.298 2.045 2.94 5.004 5.425 8.47 6.756Z" fill="#fff"/>
  </mask>
  <g mask="url(#facialHairBeardMustache-a)">
    <path d="M32 9V3c0-.1-.001-.2-.003-.298-2.045 2.94-5.004 5.425-8.47 6.756l2.812.96a1 1 0 0 1-.075 1.915l-5.081 1.3A2.715 2.715 0 0 1 18 12.046a2.718 2.718 0 0 1-3.183 1.587l-5.081-1.3a1 1 0 0 1-.075-1.916l2.812-.96c-3.466-1.33-6.425-3.816-8.47-6.755C4.001 2.8 4 2.9 4 3v6c0 7.732 6.268 14 14 14s14-6.268 14-14Z" fill="#fff" style="mix-blend-mode:overlay" opacity=".26"/>
    <path d="M22 13.424v.076a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3.076l.817.209A2.715 2.715 0 0 0 18 12.046a2.718 2.718 0 0 0 3.183 1.587l.816-.209Z" fill="#FFFEFD"/>
  </g>
`,
  pyramid: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M18.017 12.05a2.718 2.718 0 0 1-3.183 1.587l-5.082-1.3a1 1 0 0 1-.075-1.916l5.235-1.786a2.504 2.504 0 0 1 3.104 1.37 2.504 2.504 0 0 1 3.105-1.37l5.235 1.786a1 1 0 0 1-.075 1.915l-5.082 1.3a2.718 2.718 0 0 1-3.183-1.587Z" fill="${colors.hair.value}"/>
`,
  walrus: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M10 14a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5H10Z" fill="${colors.hair.value}"/>
`,
  goatee: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path fill-rule="evenodd" clip-rule="evenodd" d="M13.613 10.673C12.015 11.096 11 12.59 11 14.242v4.663c0 .997.494 1.934 1.377 2.398 1.39.73 3.634 1.697 5.78 1.697 2.14 0 4.26-.963 5.56-1.694.832-.467 1.283-1.369 1.283-2.322v-4.742c0-1.653-1.015-3.146-2.613-3.569C21.073 10.326 19.455 10 18 10c-1.455 0-3.073.326-4.387.673Zm.293 1.41c-.802.222-1.316.967-1.316 1.798v2.67c0 1.065.561 2.057 1.54 2.477 1.084.465 2.585.972 3.974.972 1.385 0 2.847-.504 3.899-.968.956-.422 1.497-1.4 1.497-2.445v-2.69c0-.84-.524-1.59-1.333-1.808-1.073-.29-2.646-.628-4.167-.628-1.512 0-3.048.334-4.094.623Z" fill="${colors.hair.value}"/>
`,
  shadow: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path opacity=".2" d="M32 3v4c0 7.732-6.268 14-14 14S4 14.732 4 7V3c0-.1.001-.2.003-.298C6.048 5.642 8.535 9.669 12 11c2-1.002 4-1.504 6-1.504s4 .502 6 1.504c3.465-1.33 5.952-5.359 7.997-8.298C31.999 2.8 32 2.9 32 3Z" fill="${colors.hair.value}"/>
`,
  soulPatch: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M16 17.5h4l-.684 2.051a1.387 1.387 0 0 1-2.632 0L16 17.5Z" fill="${colors.hair.value}"/>
`,
};
