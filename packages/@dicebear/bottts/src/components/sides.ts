import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const sides: ComponentGroup = {
  antenna01: {
    width: 180,
    height: 76,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="sidesAntenna01-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="6" y="11" width="156" height="51">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M13 11h-2v20h1.4c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C6 34.04 6 35.16 6 37.4v1.2c0 2.24 0 3.36.436 4.216a4 4 0 0 0 1.748 1.748C9.04 45 10.16 45 12.4 45H18v10.6c0 2.24 0 3.36.436 4.216a4 4 0 0 0 1.748 1.748C21.04 62 22.16 62 24.4 62h23.2c2.24 0 3.36 0 4.216-.436a4 4 0 0 0 1.748-1.748C54 58.96 54 57.84 54 55.6V20.4c0-2.24 0-3.36-.436-4.216a4 4 0 0 0-1.748-1.748C50.96 14 49.84 14 47.6 14H24.4c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C18 17.04 18 18.16 18 20.4V31h-5V11Zm113 23.4c0-2.24 0-3.36.436-4.216a3.996 3.996 0 0 1 1.748-1.748C129.04 28 130.16 28 132.4 28h23.2c2.24 0 3.36 0 4.216.436a3.996 3.996 0 0 1 1.748 1.748c.436.856.436 1.976.436 4.216v11.2c0 2.24 0 3.36-.436 4.216a3.996 3.996 0 0 1-1.748 1.748C158.96 52 157.84 52 155.6 52h-23.2c-2.24 0-3.36 0-4.216-.436a3.996 3.996 0 0 1-1.748-1.748C126 48.96 126 47.84 126 45.6V34.4Z" fill="#0076DE"/>
  </mask>
  <g mask="url(#sidesAntenna01-a)">
    <path d="M0 0h180v76H0V0Z" fill="${colors.base.value}"/>
    <path fill="#fff" fill-opacity=".3" d="M0 0h180v76H0z"/>
    <path fill="#000" fill-opacity=".1" d="M0 38h180v38H0z"/>
  </g>
  <path fill="#fff" fill-opacity=".4" d="M11 11h2v20h-2z"/>
  <circle cx="12" cy="8" r="4" fill="#FFEA8F"/>
  <circle cx="13" cy="7" r="2" fill="#fff"/>
`,
  },
  antenna02: {
    width: 180,
    height: 76,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="sidesAntenna02-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="10" y="9" width="160" height="51">
    <path d="M160 9h2v19h1.6c2.24 0 3.36 0 4.216.436a3.996 3.996 0 0 1 1.748 1.748c.436.856.436 1.976.436 4.216v19.2c0 2.24 0 3.36-.436 4.216a3.996 3.996 0 0 1-1.748 1.748C166.96 60 165.84 60 163.6 60h-23.2c-2.24 0-3.36 0-4.216-.436a3.996 3.996 0 0 1-1.748-1.748C134 56.96 134 55.84 134 53.6V34.4c0-2.24 0-3.36.436-4.216a3.996 3.996 0 0 1 1.748-1.748C137.04 28 138.16 28 140.4 28H160V9ZM10 34.4c0-2.24 0-3.36.436-4.216a4 4 0 0 1 1.748-1.748C13.04 28 14.16 28 16.4 28h23.2c2.24 0 3.36 0 4.216.436a4 4 0 0 1 1.748 1.748C46 31.04 46 32.16 46 34.4v19.2c0 2.24 0 3.36-.436 4.216a4 4 0 0 1-1.748 1.748C42.96 60 41.84 60 39.6 60H16.4c-2.24 0-3.36 0-4.216-.436a4 4 0 0 1-1.748-1.748C10 56.96 10 55.84 10 53.6V34.4Z" fill="#0076DE"/>
  </mask>
  <g mask="url(#sidesAntenna02-a)">
    <path d="M0 0h180v76H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#000" fill-opacity=".1" d="M0 38h180v38H0z"/>
  </g>
  <path fill="#fff" fill-opacity=".4" d="M160 8h2v20h-2z"/>
  <circle cx="161" cy="5" r="4" fill="#E1E6E8"/>
  <circle cx="162" cy="4" r="2" fill="#fff"/>
`,
  },
  cables01: {
    width: 180,
    height: 76,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <path d="M38 12c-2.954 11.697-19.904 6.666-23.369 18.009C11.167 41.352 22.657 50 32.155 50" stroke="#2A3544" stroke-width="6" opacity=".9"/>
  <path d="M150 55c8.394 3.486 20.102-7.594 16-16.5-4.102-8.906-16-6.694-16-19.305" stroke="#2A3544" stroke-width="4" opacity=".9"/>
  <mask id="sidesCables01-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="21" y="6" width="138" height="58">
    <path d="M138 6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h19a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-19ZM21 37a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2H23a2 2 0 0 1-2-2V37ZM136 44a2 2 0 0 1 2-2h19a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2h-19a2 2 0 0 1-2-2V44Z" fill="#273951"/>
  </mask>
  <g mask="url(#sidesCables01-a)">
    <path d="M0 0h180v76H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/>
  </g>
`,
  },
  cables02: {
    width: 180,
    height: 76,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <g opacity=".9" stroke="#2A3544">
    <ellipse cx="32.5" cy="23" rx="16.5" ry="18" stroke-width="6"/>
    <path d="M29.515 36.765C22.1 41.045 12.51 38.31 8.092 30.658" stroke-width="4"/>
    <ellipse cx="28.5" cy="52.5" rx="16.5" ry="14.5" stroke-width="4"/>
  </g>
  <g opacity=".9" stroke="#2A3544">
    <path d="M168.606 60.423C164.326 53.01 154.653 50.582 147 55" stroke-width="4"/>
    <ellipse cx="148.5" cy="22.5" rx="16.5" ry="15.5" stroke-width="6"/>
  </g>
  <mask id="sidesCables02-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="21" y="0" width="138" height="72">
    <path d="M145 0a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2h-12ZM23 27a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V29a2 2 0 0 0-2-2H23ZM24 60a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2H24ZM143 44a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2V44Z" fill="#273951"/>
  </mask>
  <g mask="url(#sidesCables02-a)">
    <path d="M0 0h180v76H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/>
  </g>
`,
  },
  round: {
    width: 180,
    height: 76,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="sidesRound-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="12" y="16" width="156" height="45">
    <path d="M30 61c-9.941 0-18-10.074-18-22.5S20.059 16 30 16s18 10.074 18 22.5S39.941 61 30 61ZM150 61c9.941 0 18-10.074 18-22.5S159.941 16 150 16s-18 10.074-18 22.5S140.059 61 150 61Z" fill="#E1E6E8"/>
  </mask>
  <g mask="url(#sidesRound-a)">
    <path d="M0 0h180v76H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#000" fill-opacity=".2" d="M20 0h140v76H20z"/>
  </g>
`,
  },
  square: {
    width: 180,
    height: 76,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="sidesSquare-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="14" y="16" width="152" height="44">
    <path d="M14.98 20.914C14 22.84 14 25.36 14 30.4v15.2c0 5.04 0 7.56.98 9.486a9 9 0 0 0 3.934 3.933C20.84 60 23.36 60 28.4 60h7.2c5.04 0 7.56 0 9.486-.98a9 9 0 0 0 3.933-3.934C50 53.16 50 50.64 50 45.6V30.4c0-5.04 0-7.56-.98-9.486a9 9 0 0 0-3.934-3.933C43.16 16 40.64 16 35.6 16h-7.2c-5.04 0-7.56 0-9.486.98a9 9 0 0 0-3.933 3.934ZM130.981 20.914C130 22.84 130 25.36 130 30.4v15.2c0 5.04 0 7.56.981 9.486a9.003 9.003 0 0 0 3.933 3.933c1.925.981 4.446.981 9.486.981h7.2c5.04 0 7.561 0 9.486-.98a9.003 9.003 0 0 0 3.933-3.934C166 53.16 166 50.64 166 45.6V30.4c0-5.04 0-7.56-.981-9.486a9.003 9.003 0 0 0-3.933-3.933C159.161 16 156.64 16 151.6 16h-7.2c-5.04 0-7.561 0-9.486.98a9.003 9.003 0 0 0-3.933 3.934Z" fill="#0076DE"/>
  </mask>
  <g mask="url(#sidesSquare-a)">
    <path d="M0 0h180v76H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#000" fill-opacity=".1" d="M0 38h180v38H0z"/>
  </g>
`,
  },
  squareAssymetric: {
    width: 180,
    height: 76,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <mask id="sidesSquareAssymetric-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="10" y="8" width="165" height="60">
    <path d="M134.436 10.184C134 11.04 134 12.16 134 14.4v47.2c0 2.24 0 3.36.436 4.216a3.996 3.996 0 0 0 1.748 1.748c.856.436 1.976.436 4.216.436h23.2c2.24 0 3.36 0 4.216-.436a3.996 3.996 0 0 0 1.748-1.748C170 64.96 170 63.84 170 61.6v-8.606c1.35-.018 2.161-.096 2.816-.43a3.996 3.996 0 0 0 1.748-1.748C175 49.96 175 48.84 175 46.6V29.4c0-2.24 0-3.36-.436-4.216a3.996 3.996 0 0 0-1.748-1.748c-.655-.334-1.466-.412-2.816-.43V14.4c0-2.24 0-3.36-.436-4.216a3.996 3.996 0 0 0-1.748-1.748C166.96 8 165.84 8 163.6 8h-23.2c-2.24 0-3.36 0-4.216.436a3.996 3.996 0 0 0-1.748 1.748ZM20.436 17.184C20 18.04 20 19.16 20 21.4V31h-3.6c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748C10 34.04 10 35.16 10 37.4v17.2c0 2.24 0 3.36.436 4.216a4 4 0 0 0 1.748 1.748C13.04 61 14.16 61 16.4 61h23.2c2.24 0 3.36 0 4.216-.436a4 4 0 0 0 1.748-1.748C46 57.96 46 56.84 46 54.6V21.4c0-2.24 0-3.36-.436-4.216a4 4 0 0 0-1.748-1.748C42.96 15 41.84 15 39.6 15H26.4c-2.24 0-3.36 0-4.216.436a4 4 0 0 0-1.748 1.748Z" fill="#0076DE"/>
  </mask>
  <g mask="url(#sidesSquareAssymetric-a)">
    <path d="M0 0h180v76H0V0Z" fill="${colors.base.value}"/>
    <path d="M0 0h180v76H0V0Z" fill="#fff" fill-opacity=".3"/>
    <path fill="#000" fill-opacity=".1" d="M0 47h180v29H0z"/>
    <circle cx="161" cy="20" r="5" fill="#fff" fill-opacity=".6"/>
    <circle cx="161" cy="36" r="5" fill="#fff" fill-opacity=".6"/>
  </g>
`,
  },
};
