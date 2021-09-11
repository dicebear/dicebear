import type {
  ComponentGroup,
  ComponentPickCollection,
  ColorPickCollection,
} from '../static-types';

export const eyes: ComponentGroup = {
  bulging: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <circle cx="28" cy="24" r="18" fill="#000" fill-opacity=".2"/>
  <circle cx="74" cy="24" r="18" fill="#000" fill-opacity=".2"/>
  <circle cx="28" cy="24" r="15" fill="#F1EEDA"/>
  <circle cx="74" cy="24" r="15" fill="#F1EEDA"/>
  <rect x="26" y="15" width="10" height="10" rx="2" fill="#000" fill-opacity=".8"/>
  <rect x="74" y="15" width="10" height="10" rx="2" fill="#000" fill-opacity=".8"/>
`,
  },
  dizzy: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <path d="m25 27.2 5.5 5.5c.5.4 1.2.4 1.6 0l1.6-1.6c.4-.5.4-1.2 0-1.6L28.2 24l5.5-5.5c.4-.5.4-1.2 0-1.6l-1.6-1.6c-.5-.4-1.2-.4-1.6 0L25 20.8l-5.5-5.5c-.5-.4-1.2-.4-1.6 0l-1.6 1.6c-.4.4-.4 1.1 0 1.6l5.5 5.5-5.5 5.5c-.4.5-.4 1.2 0 1.6l1.6 1.6c.5.4 1.2.4 1.6 0l5.5-5.5ZM79 27.2l5.5 5.5c.5.4 1.2.4 1.6 0l1.6-1.6c.4-.5.4-1.2 0-1.6L82.2 24l5.5-5.5c.4-.5.4-1.2 0-1.6l-1.6-1.6c-.5-.4-1.2-.4-1.6 0L79 20.8l-5.5-5.5c-.5-.4-1.2-.4-1.6 0l-1.6 1.6c-.4.4-.4 1.1 0 1.6l5.5 5.5-5.5 5.5c-.4.5-.4 1.2 0 1.6l1.6 1.6c.5.4 1.2.4 1.6 0l5.5-5.5Z" fill="#000" fill-opacity=".8"/>
`,
  },
  eva: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <g fill-rule="evenodd" clip-rule="evenodd">
    <path d="M53 0c34.747 0 49.001 17.474 49 31-.001 13.526-19.59 17-49 17-29.047 0-51-3.474-51-17S17.114 0 53 0Z" fill="#000" fill-opacity=".8"/>
    <path d="M28.818 34.654C22.29 33.3 17.583 28.312 18.302 23.513c.72-4.8 6.594-7.592 13.12-6.238 6.527 1.354 11.235 6.342 10.516 11.141-.72 4.8-6.594 7.592-13.12 6.238ZM75.422 34.654c-6.526 1.354-12.4-1.439-13.12-6.238-.719-4.799 3.989-9.787 10.516-11.141 6.526-1.354 12.4 1.439 13.12 6.238.719 4.8-3.989 9.787-10.516 11.141Z" fill="#25A6F5"/>
  </g>
`,
  },
  frame1: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <rect y="4" width="104" height="42" rx="4" fill="#000" fill-opacity=".8"/>
  <rect x="28" y="25" width="10" height="11" rx="2" fill="#8BDDFF"/>
  <rect x="66" y="25" width="10" height="11" rx="2" fill="#8BDDFF"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M21 4h8L12 46H4L21 4Z" fill="#fff" fill-opacity=".4"/>
`,
  },
  frame2: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <rect x="8" y="10" width="88" height="36" rx="4" fill="#000" fill-opacity=".8"/>
  <rect x="28" y="21" width="10" height="17" rx="2" fill="#5EF2B8"/>
  <rect x="66" y="21" width="10" height="17" rx="2" fill="#5EF2B8"/>
  <path fill-rule="evenodd" clip-rule="evenodd" d="M83 10h5L76 46h-5l12-36Z" fill="#fff" fill-opacity=".4"/>
`,
  },
  glow: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <g fill="#fff">
    <circle cx="21" cy="30" r="15" fill-opacity=".1"/>
    <circle cx="83" cy="30" r="15" fill-opacity=".1"/>
    <circle cx="21" cy="30" r="12" fill-opacity=".1"/>
    <circle cx="83" cy="30" r="12" fill-opacity=".1"/>
    <circle cx="21" cy="30" r="6" fill-opacity=".8"/>
    <circle cx="83" cy="30" r="6" fill-opacity=".8"/>
    <circle cx="21" cy="30" r="3" fill-opacity=".8"/>
    <circle cx="83" cy="30" r="3" fill-opacity=".8"/>
  </g>
`,
  },
  happy: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <path d="m18 19 12-2M20 31c0-3.314 2.91-6 7-6 3.09 0 6 2.686 6 6M86 20l-12-3M84 31c0-3.314-2.91-6-6-6-4.09 0-7 2.686-7 6" stroke="#000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
`,
  },
  hearts: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <path d="M29.27 9.68c-2.548.133-4.965 2.242-6.25 4.153-1.484-1.765-4.102-3.61-6.65-3.477-5.482.287-8.855 3.803-8.63 8.104.3 5.722 4.884 8.886 9.697 12.245 1.715 1.148 5.004 4.144 5.426 4.816.422.672 2.14.607 2.58-.135.439-.741 3.303-4.036 4.893-5.357 4.431-3.843 8.662-7.47 8.362-13.192-.225-4.3-3.947-7.444-9.429-7.157ZM87.63 10.356c-2.548-.134-5.171 1.711-6.65 3.477-1.29-1.91-3.702-4.02-6.25-4.153-5.481-.287-9.203 2.856-9.428 7.157-.3 5.722 3.928 9.349 8.362 13.192 1.587 1.321 4.544 4.645 4.893 5.357.35.713 2.066.827 2.58.135.514-.691 3.708-3.668 5.426-4.816 4.81-3.359 9.396-6.523 9.696-12.245.226-4.301-3.147-7.817-8.63-8.104Z" fill="#FF5353" fill-opacity=".8"/>
`,
  },
  robocop: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <rect x="7" y="16" width="91" height="16" rx="4" fill="#000" fill-opacity=".8"/>
  <mask id="eyesRobocop-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="7" y="16" width="91" height="16">
    <rect x="7" y="16" width="91" height="16" rx="4" fill="#fff"/>
  </mask>
  <g mask="url(#eyesRobocop-a)" fill-rule="evenodd" clip-rule="evenodd" fill="#fff" fill-opacity=".8">
    <path d="M76 7h18L82 37H64L76 7ZM52 7h9L49 37h-9L52 7Z"/>
  </g>
`,
  },
  round: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <g fill="#fff">
    <circle cx="24" cy="30" r="6"/>
    <circle cx="80" cy="30" r="6"/>
  </g>
`,
  },
  roundFrame01: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <rect y="12" width="104" height="32" rx="16" fill="#000" fill-opacity=".8"/>
  <rect x="24" y="22" width="10" height="12" rx="2" fill="#F4F4F4"/>
  <rect x="70" y="22" width="10" height="12" rx="2" fill="#F4F4F4"/>
`,
  },
  roundFrame02: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <rect y="11" width="104" height="34" rx="17" fill="#000" fill-opacity=".8"/>
  <circle cx="29" cy="28" r="13" fill="#F1EEDA"/>
  <circle cx="75" cy="28" r="13" fill="#F1EEDA"/>
  <rect x="24" y="23" width="10" height="10" rx="2" fill="#000" fill-opacity=".8"/>
  <rect x="70" y="23" width="10" height="10" rx="2" fill="#000" fill-opacity=".8"/>
`,
  },
  sensor: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <path d="M28 44c10.37 0 18.898-7.893 19.901-18h41.515A5.001 5.001 0 0 0 99 24a5 5 0 0 0-9.584-2H47.901C46.898 11.893 38.371 4 28 4 16.954 4 8 12.954 8 24s8.954 20 20 20Z" fill="#000" fill-opacity=".2"/>
  <circle cx="94" cy="24" r="2" fill="#fff"/>
  <circle cx="28" cy="24" r="16" fill="#000" fill-opacity=".6"/>
  <circle cx="34" cy="16" r="3" fill="#fff"/>
`,
  },
  shade01: {
    width: 104,
    height: 48,
    render: (
      components: ComponentPickCollection,
      colors: ColorPickCollection
    ) => `
  <path d="M0 10a8 8 0 0 1 8-8h88a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H82.98c-3.269.167-5.48 1.137-6.975 2.347-.487.394-.981.816-1.483 1.246C72.046 41.708 69.365 44 66.278 44h-27.61c-3.136 0-5.936-2.13-8.622-4.172-.95-.722-1.886-1.434-2.817-2.036-1.456-.942-3.459-1.651-6.21-1.792H8a8 8 0 0 1-8-8V10Z" fill="#000" fill-opacity=".8"/>
  <mask id="eyesShade01-a" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="2" width="104" height="42">
    <path d="M0 10a8 8 0 0 1 8-8h88a8 8 0 0 1 8 8v18a8 8 0 0 1-8 8H82.98c-3.269.167-5.48 1.137-6.975 2.347-.487.394-.981.816-1.483 1.246C72.046 41.708 69.365 44 66.278 44h-27.61c-3.136 0-5.936-2.13-8.622-4.172-.95-.722-1.886-1.434-2.817-2.036-1.456-.942-3.459-1.651-6.21-1.792H8a8 8 0 0 1-8-8V10Z" fill="#000" fill-opacity=".8"/>
  </mask>
  <g mask="url(#eyesShade01-a)">
    <path d="M12 19a5 5 0 0 1 5-5h70a5 5 0 0 1 5 5v2a5 5 0 0 1-5 5H74.98c-3.269.167-5.48 1.137-6.975 2.347-.487.394-.981.816-1.483 1.246-2.004 1.712-4.142 3.54-6.522 4.174V34H46.668c-3.136 0-5.936-2.13-8.622-4.172-.95-.722-1.886-1.433-2.817-2.036-1.456-.942-3.459-1.651-6.21-1.792H17a5 5 0 0 1-5-5v-2Z" fill="#FF3D3D"/>
    <path d="M12 44 32-2h-4L8 44h4ZM50-2H39L19 44h11L50-2Z" fill="#fff" fill-opacity=".2"/>
  </g>
`,
  },
};
