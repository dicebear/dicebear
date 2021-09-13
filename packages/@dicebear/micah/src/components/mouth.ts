import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const mouth: ComponentGroup = {
  surprised: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M36.047 54.891c10.837-1.96 17.186-13.936 14.978-26.137S38.673 7.562 27.836 9.524C17 11.483 10.65 23.46 12.86 35.66c2.208 12.2 12.35 21.192 23.188 19.23Z" fill="${colors.mouth.value}" stroke="${colors.mouth.value}" stroke-width="3.591"/>
  <mask id="mouthSurprised-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="14" y="11" width="36" height="43">
    <ellipse cx="31.942" cy="32.207" rx="17.598" ry="21.257" transform="rotate(-10.258 31.942 32.207)" fill="#171921"/>
  </mask>
  <g mask="url(#mouthSurprised-a)">
    <ellipse cx="35.202" cy="50.219" rx="20.205" ry="18.305" transform="rotate(-10.258 35.202 50.219)" fill="#FC909F"/>
  </g>
`,
  laughing: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M68.807 25.177a34 34 0 0 0 1.113-11.846c-.17-2.068-2.284-3.22-4.075-2.513-4.229 1.666-18.218 6.965-28.082 8.322-10.823 1.49-27.213-.319-31.957-.908-1.93-.24-3.649 1.418-3.316 3.433a34 34 0 0 0 66.317 3.512Z" fill="${colors.mouth.value}" stroke="${colors.mouth.value}" stroke-width="4"/>
  <mask id="mouthLaughing-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="4" y="12" width="65" height="37">
    <path d="M67.793 12.193A32.001 32.001 0 0 1 4.277 20.05l63.516-7.858Z" fill="#171921"/>
  </mask>
  <g mask="url(#mouthLaughing-a)">
    <circle cx="40.522" cy="52.315" r="21.5" transform="rotate(-7.053 40.522 52.315)" fill="#FC909F"/>
  </g>
`,
  nervous: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <rect x="4.248" y="17.471" width="70" height="24" rx="4" transform="rotate(-4 4.248 17.47)" fill="${colors.mouth.value}"/>
  <path d="m67.821 13.025-57.317 4.008 1.84 7.005a6 6 0 0 0 6.222 4.461 6 6 0 0 0-5.54 5.283l-.848 7.193 57.317-4.008-1.84-7.005a6 6 0 0 0-6.221-4.46 6 6 0 0 0 5.54-5.284l.847-7.193Z" fill="#fff"/>
  <path d="m77.42 31.704-1.02-14.57c-.257-3.686-3.737-6.254-7.32-5.485-6.945 1.49-20.222 4.134-29.818 4.805-9.595.671-23.111-.099-30.195-.609-3.656-.263-6.744 2.765-6.486 6.451l1.018 14.57c.258 3.686 3.737 6.254 7.322 5.485 6.944-1.49 20.221-4.134 29.816-4.805 9.596-.671 23.112.099 30.196.608 3.656.264 6.744-2.764 6.486-6.45Z" stroke="${colors.mouth.value}" stroke-width="4"/>
`,
  smile: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M2.5 17.5c2.5 17 31 25 57 5.5" stroke="${colors.mouth.value}" stroke-width="4"/>
`,
  sad: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M13 46c1.715-7.957 8.07-24.767 19.77-28.348 11.7-3.58 17.695 8.455 19.23 14.92" stroke="${colors.mouth.value}" stroke-width="4"/>
`,
  pucker: (
    components: ComponentPickCollection,
    colors: ColorPickCollection
  ) => `
  <path d="M26 16.697c4.167-2.334 21-5.3 21 1.5 0 8.5-11.5 8-11.5 8s13.045-3.162 10.5 6c-2.5 9-9.5 5.5-11.5 4.5" stroke="${colors.mouth.value}" stroke-width="4"/>
`,
  frown: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M2 41c3.21-7.957 15.107-24.767 37.007-28.348 21.9-3.58 33.12 8.455 35.993 14.92" stroke="${colors.mouth.value}" stroke-width="4"/>
`,
  smirk: (components: ComponentPickCollection, colors: ColorPickCollection) => `
  <path d="M10 24.165c4.941 6.447 12.428 13.589 23.977 11.96 11.549-1.629 16.687-9.595 15.172-16.047" stroke="${colors.mouth.value}" stroke-width="4"/>
`,
};
